import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { verifyAiQuota } from './guardrails';
import { createGitRepository, createGitPullRequest } from './git.service';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Guardrails & Git Core v1.0' });
});

// ১. ইউজার রেজিস্ট্রেশন
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password || 'devpass123', 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        quota: { create: {} }
      },
      include: { quota: true }
    });

    res.json({ message: "User registered with strict guardrails!", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ২. কঠোর লিমিটেশনসহ গিট রিপোজিটরি তৈরি
app.post('/api/repos/create', async (req, res) => {
  try {
    const { userId, repoName, description, isPrivate } = req.body;

    if (!userId || !repoName) {
      return res.status(400).json({ error: "userId and repoName are required" });
    }

    // কোটা যাচাই (কঠোর সর্বোচ্চ ৫টি রিপোজিটরি লিমিট)
    const quota = await prisma.usageQuota.findUnique({ where: { userId } });
    if (!quota) return res.status(404).json({ error: "User quota not found" });

    const currentRepoCount = await prisma.repository.count({ where: { ownerId: userId } });

    if (currentRepoCount >= quota.maxRepositories) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "REPO_LIMIT_EXCEEDED",
          details: `Blocked: Attempted to create repository #${currentRepoCount + 1} (Max limit: ${quota.maxRepositories})`
        }
      });

      return res.status(403).json({
        error: `Guardrails Blocked: Maximum repository limit (${quota.maxRepositories}) reached! Upgrade or delete existing repository.`
      });
    }

    // Git ইঞ্জিনে আসল রিপোজিটরি তৈরি
    const gitRepo = await createGitRepository(repoName, description, isPrivate);

    // মেটাডাটা ডাটাবেজে সংরক্ষণ
    const savedRepo = await prisma.repository.create({
      data: {
        name: repoName,
        description: description || '',
        isPrivate: !!isPrivate,
        ownerId: userId
      }
    });

    res.json({
      success: true,
      message: "Git Repository initialized successfully!",
      repository: {
        id: savedRepo.id,
        name: savedRepo.name,
        cloneUrl: gitRepo.clone_url,
        defaultBranch: gitRepo.default_branch,
        totalReposUsed: currentRepoCount + 1,
        maxAllowed: quota.maxRepositories
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৩. Pull Request (PR) তৈরি
app.post('/api/repos/pulls', async (req, res) => {
  try {
    const { repoName, title, headBranch, baseBranch } = req.body;
    const pr = await createGitPullRequest(repoName, title, headBranch, baseBranch || 'main');
    res.json({ success: true, message: "Pull Request created!", pr });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Core Gateway live on http://localhost:${PORT}`);
});

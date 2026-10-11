import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { verifyAiQuota } from './guardrails';
import { createGitRepository, createGitPullRequest } from './git.service';
import { executeAiQuery } from '../../../packages/ai-engine/index';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Core & AI Intelligence v1.0' });
});

// ১. রেজিস্ট্রেশন
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

// ২. রিপোজিটরি তৈরি
app.post('/api/repos/create', async (req, res) => {
  try {
    const { userId, repoName, description, isPrivate } = req.body;
    const quota = await prisma.usageQuota.findUnique({ where: { userId } });
    if (!quota) return res.status(404).json({ error: "User quota not found" });

    const currentRepoCount = await prisma.repository.count({ where: { ownerId: userId } });
    if (currentRepoCount >= quota.maxRepositories) {
      return res.status(403).json({ error: `Max repository limit (${quota.maxRepositories}) reached!` });
    }

    const gitRepo = await createGitRepository(repoName, description, isPrivate);
    const savedRepo = await prisma.repository.create({
      data: { name: repoName, description: description || '', isPrivate: !!isPrivate, ownerId: userId }
    });

    res.json({
      success: true,
      repository: { id: savedRepo.id, name: savedRepo.name, cloneUrl: gitRepo.clone_url, totalReposUsed: currentRepoCount + 1, maxAllowed: quota.maxRepositories }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৩. GittiG Intelligence (AI চ্যাট ও কোডিং উইথ BYOK & কঠোর কোটা)
app.post('/api/ai/query', async (req, res) => {
  try {
    const { userId, prompt, userApiKey, provider } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    let isByok = false;

    // যদি ব্যবহারকারী নিজস্ব API কি ব্যবহার না করে, তবে কঠোর কোটা কাটা হবে
    if (!userApiKey) {
      if (!userId) return res.status(400).json({ error: "userId is required for platform AI usage" });
      
      const quotaCheck = await verifyAiQuota(userId);
      if (!quotaCheck.allowed) {
        return res.status(429).json({ error: quotaCheck.message });
      }

      // কোটা ১ বাড়ানো
      await prisma.usageQuota.update({
        where: { userId },
        data: { usedAiToday: { increment: 1 } }
      });
    } else {
      isByok = true; // BYOK হলে কোনো লিমিট কাটা হবে না
    }

    const aiResult = await executeAiQuery({
      prompt,
      userApiKey,
      preferredProvider: provider || 'groq'
    });

    // লেটেস্ট কোটা তথ্য বের করা
    let quotaInfo = null;
    if (userId) {
      const q = await prisma.usageQuota.findUnique({ where: { userId } });
      if (q) {
        quotaInfo = { usedAiToday: q.usedAiToday, dailyLimit: q.dailyAiLimit, remaining: q.dailyAiLimit - q.usedAiToday };
      }
    }

    res.json({
      success: true,
      isByok,
      aiResult,
      quotaStatus: isByok ? "Unlimited (BYOK Key active - ৳০ server cost)" : quotaInfo
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Core & AI Intelligence live on http://localhost:${PORT}`);
});

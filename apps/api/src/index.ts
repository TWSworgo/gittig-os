import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { prisma } from './db';
import { verifyAiQuota } from './guardrails';
import { createGitRepository, createGitPullRequest } from './git.service';
import { executeAiQuery } from '../../../packages/ai-engine/index';
import { saveCodeMemory, searchCodeMemory } from './memory.service';
import { executeBuildPipeline } from './flow.service';

const app = express();
app.use(cors());
app.use(express.json());

// ১. হেলথ চেক
app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Core, AI, Memory & Flow v1.0' });
});

// ২. ইউজার রেজিস্ট্রেশন
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password || 'devpass123', 10);
    const user = await prisma.user.create({
      data: { username, email, passwordHash, quota: { create: {} } },
      include: { quota: true }
    });
    res.json({ message: "User registered with strict guardrails!", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ৩. রিপোজিটরি তৈরি
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

// ৪. AI চ্যাট
app.post('/api/ai/query', async (req, res) => {
  try {
    const { userId, prompt, userApiKey, provider } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    if (!userApiKey && userId) {
      const quotaCheck = await verifyAiQuota(userId);
      if (!quotaCheck.allowed) return res.status(429).json({ error: quotaCheck.message });
      await prisma.usageQuota.update({ where: { userId }, data: { usedAiToday: { increment: 1 } } });
    }

    const aiResult = await executeAiQuery({ prompt, userApiKey, preferredProvider: provider || 'groq' });
    res.json({ success: true, aiResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৫. CI/CD Flow পাইপলাইন ট্রিগার (APK / EXE / Bundle বিল্ড)
app.post('/api/flow/trigger', async (req, res) => {
  try {
    const { userId, repoName, target } = req.body;
    const buildTarget = target || 'apk';

    if (userId) {
      const quota = await prisma.usageQuota.findUnique({ where: { userId } });
      if (quota && quota.usedBuildMinsToday >= quota.dailyBuildMinsLimit) {
        return res.status(429).json({
          error: `Guardrails Blocked: Daily build runner quota (${quota.dailyBuildMinsLimit} mins) reached!`
        });
      }
      // ১ মিনিট বিল্ড সময় যোগ করা
      if (quota) {
        await prisma.usageQuota.update({ where: { userId }, data: { usedBuildMinsToday: { increment: 1 } } });
      }
    }

    const result = await executeBuildPipeline(buildTarget, repoName || 'my-app');
    res.json({
      success: true,
      result,
      downloadUrl: `http://localhost:4000/api/flow/artifacts/${result.artifactFileName}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৬. আসল বিল্ড আর্টফ্যাক্ট (APK/EXE/Bundle) ফাইল ডাউনলোড এন্ডপয়েন্ট
app.get('/api/flow/artifacts/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../storage/artifacts', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Artifact file not found or expired." });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Core, AI & Flow CI/CD live on http://localhost:${PORT}`);
});

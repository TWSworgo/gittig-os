import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { verifyAiQuota } from './guardrails';
import { createGitRepository, createGitPullRequest } from './git.service';
import { executeAiQuery } from '../../../packages/ai-engine/index';
import { saveCodeMemory, searchCodeMemory } from './memory.service';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Core, AI & Qdrant Memory v1.0' });
});

// ১. রেজিস্ট্রেশন
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

// ৩. কোড ভেক্টর মেমোরিতে ইনডেক্স করা (Qdrant)
app.post('/api/memory/index', async (req, res) => {
  try {
    const { id, filePath, codeSnippet } = req.body;
    const result = await saveCodeMemory(id || 1, filePath, codeSnippet);
    res.json({ success: true, message: `Code indexed into Qdrant memory from ${filePath}`, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৪. মেমোরি সার্চ ও AI কনটেক্সট উত্তর
app.post('/api/memory/search', async (req, res) => {
  try {
    const { query } = req.body;
    const searchResults = await searchCodeMemory(query);
    res.json({ success: true, query, matches: searchResults.result || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Core, AI & Memory live on http://localhost:${PORT}`);
});

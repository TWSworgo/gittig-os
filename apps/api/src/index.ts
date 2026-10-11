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
import { scanCodebaseSecurity } from './sentinel.service';
import { provisionLiveDeployment, getRegistryPackages } from './launch.service';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Core, Flow, Sentinel & Launch v1.0' });
});

// AI চ্যাট
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

// CI/CD Flow
app.post('/api/flow/trigger', async (req, res) => {
  try {
    const { target, repoName } = req.body;
    const result = await executeBuildPipeline(target || 'apk', repoName || 'my-app');
    res.json({ success: true, result, downloadUrl: `/api/flow/artifacts/${result.artifactFileName}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/flow/artifacts/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../storage/artifacts', req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ error: "File not found" });
});

// Sentinel Security
app.post('/api/sentinel/scan', (req, res) => {
  try {
    const { simulateLeak } = req.body;
    let files = [
      { path: 'src/index.ts', content: "import express from 'express';\nconst app = express();" },
      { path: 'src/services/auth.service.ts', content: "export function auth() { return true; }" }
    ];
    if (simulateLeak) {
      const mockKey = ['sk', 'live', 'demo_key_9928172648291048'].join('_');
      files.push({
        path: '.env.production',
        content: `DATABASE_URL=postgres://...\nSTRIPE_SECRET_KEY=${mockKey}\nADMIN_PASSWORD="my_super_secret_db_pass_123"`
      });
    }
    const report = scanCodebaseSecurity(files);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৮. GittiG Launch (লাইভ প্রিভিউ হোস্টিং)
app.post('/api/launch/deploy', (req, res) => {
  try {
    const { repoName } = req.body;
    const deployment = provisionLiveDeployment(repoName || 'my-gittig-core-app');
    res.json({ success: true, deployment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ৯. GittiG Registry (রিলিজ ও প্যাকেজ হাব)
app.get('/api/registry/releases', (req, res) => {
  try {
    const releases = getRegistryPackages('my-gittig-core-app');
    res.json({ success: true, releases });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Full Engine live on http://localhost:${PORT}`);
});

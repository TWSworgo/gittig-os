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
import { getMarketplaceCatalog, processPurchase } from './marketplace.service';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Full OS & Marketplace v1.0' });
});

// Flow CI/CD
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
    let files = [{ path: 'src/index.ts', content: "const app = express();" }];
    if (simulateLeak) {
      const mockKey = ['sk', 'live', 'demo_key_9928172648291048'].join('_');
      files.push({ path: '.env.production', content: `STRIPE_KEY=${mockKey}\nPASS="secret_123"` });
    }
    const report = scanCodebaseSecurity(files);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Launch হোস্টিং
app.post('/api/launch/deploy', (req, res) => {
  try {
    const deployment = provisionLiveDeployment(req.body.repoName || 'my-gittig-core-app');
    res.json({ success: true, deployment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ১০. GittiG Marketplace এন্ডপয়েন্ট
app.get('/api/marketplace/items', (req, res) => {
  res.json({ success: true, items: getMarketplaceCatalog() });
});

app.post('/api/marketplace/buy', (req, res) => {
  try {
    const receipt = processPurchase(req.body.itemId);
    res.json({ success: true, receipt });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Full OS & Economy Engine live on http://localhost:${PORT}`);
});

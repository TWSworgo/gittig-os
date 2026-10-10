import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { verifyAiQuota } from './guardrails';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'GittiG Guardrails Gateway v1.0' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password || 'devpass123', 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        quota: {
          create: {} // ডিফল্ট কঠোর সীমা: ৩০টি AI রিকোয়েস্ট, ১০০ MB স্টোরেজ
        }
      },
      include: { quota: true }
    });

    res.json({
      message: "User registered with strict guardrails!",
      user: { id: user.id, username: user.username, quota: user.quota }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/test/ai-request', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const check = await verifyAiQuota(userId);
    if (!check.allowed) {
      return res.status(429).json({ error: check.message });
    }

    const updatedQuota = await prisma.usageQuota.update({
      where: { userId },
      data: { usedAiToday: { increment: 1 } }
    });

    res.json({
      success: true,
      message: "AI Request Allowed & Processed!",
      usedToday: updatedQuota.usedAiToday,
      dailyLimit: updatedQuota.dailyAiLimit,
      remainingToday: updatedQuota.dailyAiLimit - updatedQuota.usedAiToday
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`[GittiG OS] Guardrails API live on http://localhost:${PORT}`);
});

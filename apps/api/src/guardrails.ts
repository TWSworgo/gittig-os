import { prisma } from './db';

export async function verifyAiQuota(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const quota = await prisma.usageQuota.findUnique({ where: { userId } });

  if (!quota) {
    return { allowed: false, message: "No quota found for user." };
  }

  if (quota.usedAiToday >= quota.dailyAiLimit) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: "QUOTA_EXCEEDED",
        details: `Blocked: Daily AI quota exceeded (${quota.usedAiToday}/${quota.dailyAiLimit})`
      }
    });

    return {
      allowed: false,
      message: `Blocked by Guardrails! Daily AI quota limit of ${quota.dailyAiLimit} requests reached.`
    };
  }

  return { allowed: true };
}

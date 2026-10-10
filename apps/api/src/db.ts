import { PrismaClient } from '../../../packages/database/node_modules/@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://gittig_admin:gittig_dev_password_2026@localhost:5432/gittig_db?schema=public"
    }
  }
});

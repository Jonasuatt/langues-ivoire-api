/**
 * Singleton Prisma Client — une seule instance partagée dans tout le process.
 * Connection_limit=3 évite la saturation du pool PostgreSQL sur Railway.
 */
const { PrismaClient } = require('@prisma/client');

function buildUrl() {
  const base = process.env.DATABASE_URL || '';
  if (!base) return base;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}connection_limit=3&pool_timeout=10`;
}

const prisma = global._prismaInstance
  || new PrismaClient({ datasources: { db: { url: buildUrl() } } });

global._prismaInstance = prisma;

module.exports = prisma;

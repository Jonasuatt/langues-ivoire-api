const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('langues:', await prisma.language.count());
  console.log('users:', await prisma.user.count());
  const t = await prisma.user.findUnique({ where: { email: 'enseignant.test@languesivoire.ci' }, select: { role: true, isPremium: true } });
  console.log('teacher:', JSON.stringify(t));
}
main().catch(console.error).finally(() => prisma.$disconnect());

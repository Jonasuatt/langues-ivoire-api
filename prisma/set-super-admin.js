/**
 * Script : Promouvoir un compte en SUPER_ADMIN
 * Usage  : node prisma/set-super-admin.js ouattaranogolourgo@gmail.com
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('❌  Usage : node prisma/set-super-admin.js <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`❌  Aucun compte trouvé pour l'email : ${email}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' },
  });

  console.log(`✅  Compte promu en SUPER_ADMIN :`);
  console.log(`   - Nom    : ${updated.prenom} ${updated.nom}`);
  console.log(`   - Email  : ${updated.email}`);
  console.log(`   - Rôle   : ${updated.role}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

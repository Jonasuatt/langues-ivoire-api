/**
 * Crée (ou réinitialise) le compte de test Enseignant.
 * Usage : node prisma/create-teacher-test.js [motDePasse]
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const EMAIL    = 'enseignant.test@languesivoire.ci';
const PASSWORD = process.argv[2] || 'Enseignant#2026';

async function main() {
  const motDePasseHash = await bcrypt.hash(PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { role: 'TEACHER', motDePasseHash, isActive: true, isPremium: true },
    create: {
      nom: 'TEST',
      prenom: 'Enseignant',
      email: EMAIL,
      motDePasseHash,
      role: 'TEACHER',
      genre: 'M',
      isActive: true,
      isPremium: true, // accès complet au contenu pour préparer les cours
    },
  });

  console.log('✅ Compte test Enseignant prêt :');
  console.log(`   - Email : ${user.email}`);
  console.log(`   - Rôle  : ${user.role}`);
  console.log(`   - Mot de passe : ${PASSWORD}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

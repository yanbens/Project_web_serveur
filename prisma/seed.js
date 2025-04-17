import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

console.log("🌱 Démarrage du seed...");

async function main() {
  await prisma.priority.createMany({
    data: [
      { description: 'Faible' },
      { description: 'Moyenne' },
      { description: 'Haute' },
    ]
  });

  await prisma.status.createMany({
    data: [
      { description: 'À faire' },
      { description: 'En cours' },
      { description: 'Terminé' },
    ]
  });

  console.log('✅ Données de base insérées avec succès !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

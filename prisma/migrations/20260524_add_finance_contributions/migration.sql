-- CreateTable
CREATE TABLE "finance_contributions" (
    "id" TEXT NOT NULL,
    "contributeurNom" TEXT,
    "contributeurEmail" TEXT,
    "montant" INTEGER NOT NULL,
    "objet" TEXT NOT NULL DEFAULT 'SOUTIEN_GENERAL',
    "methode" TEXT NOT NULL DEFAULT 'ORANGE_MONEY',
    "message" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_contributions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "finance_contributions" ADD CONSTRAINT "finance_contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

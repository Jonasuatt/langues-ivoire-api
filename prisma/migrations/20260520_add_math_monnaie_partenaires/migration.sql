-- CreateEnum
CREATE TYPE "MathType" AS ENUM ('COMPTAGE', 'ADDITION', 'SOUSTRACTION', 'MULTIPLICATION', 'DIVISION', 'PAIR_IMPAIR');

-- CreateEnum
CREATE TYPE "MonnaieType" AS ENUM ('RECONNAISSANCE', 'CALCUL', 'RENDU_MONNAIE', 'CONVERSION');

-- CreateTable
CREATE TABLE "math_contenus" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "type" "MathType" NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "niveau" TEXT NOT NULL DEFAULT 'A1',
    "contenu" JSONB NOT NULL,
    "pointsXp" INTEGER NOT NULL DEFAULT 20,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "math_contenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monnaie_contenus" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "type" "MonnaieType" NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "contenu" JSONB NOT NULL,
    "pointsXp" INTEGER NOT NULL DEFAULT 20,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monnaie_contenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partenaires" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "siteWeb" TEXT,
    "categorie" TEXT,
    "pays" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partenaires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "math_contenus_languageId_type_idx" ON "math_contenus"("languageId", "type");

-- CreateIndex
CREATE INDEX "monnaie_contenus_languageId_type_idx" ON "monnaie_contenus"("languageId", "type");

-- AddForeignKey
ALTER TABLE "math_contenus" ADD CONSTRAINT "math_contenus_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monnaie_contenus" ADD CONSTRAINT "monnaie_contenus_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

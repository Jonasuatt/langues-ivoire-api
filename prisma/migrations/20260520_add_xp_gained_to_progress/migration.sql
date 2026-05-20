-- AlterTable: ajouter xpGained sur user_progress pour XP proportionnel au score
ALTER TABLE "user_progress" ADD COLUMN IF NOT EXISTS "xpGained" INTEGER;

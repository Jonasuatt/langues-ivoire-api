-- AlterTable: ajouter les champs de carte géographique au modèle Language
ALTER TABLE "Language" ADD COLUMN IF NOT EXISTS "lat"     DOUBLE PRECISION;
ALTER TABLE "Language" ADD COLUMN IF NOT EXISTS "lng"     DOUBLE PRECISION;
ALTER TABLE "Language" ADD COLUMN IF NOT EXISTS "couleur" TEXT;
ALTER TABLE "Language" ADD COLUMN IF NOT EXISTS "emoji"   TEXT;

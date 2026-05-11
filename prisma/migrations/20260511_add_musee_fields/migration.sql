-- AddColumn: champs Musée des Trésors sur cultural_items
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "seuilXp"   INTEGER;
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "matiere"   TEXT;
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "typeObjet" TEXT;
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "emoji"     TEXT;

-- AlterEnum: ajouter TRESOR à CulturalItemType
-- PostgreSQL ne permet pas d'ajouter une valeur à un enum si elle existe déjà,
-- donc on utilise une vérification conditionnelle.
DO $$ BEGIN
  ALTER TYPE "CulturalItemType" ADD VALUE 'TRESOR';
EXCEPTION WHEN duplicate_object THEN null;
END $$;

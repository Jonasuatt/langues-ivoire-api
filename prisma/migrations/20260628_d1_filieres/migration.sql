-- Phase D1 — Filières Métiers au Lycée
-- Crée la table filieres et ajoute filiereId sur enrollments

CREATE TABLE IF NOT EXISTS "filieres" (
  "id"          TEXT        NOT NULL,
  "code"        TEXT        NOT NULL,
  "nom"         TEXT        NOT NULL,
  "description" TEXT,
  "emoji"       TEXT,
  "isActive"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "filieres_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "filieres_code_key" ON "filieres"("code");

-- Ajouter filiereId sur enrollments (nullable)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'filiereId'
  ) THEN
    ALTER TABLE "enrollments" ADD COLUMN "filiereId" TEXT;
  END IF;
END $$;

-- Clé étrangère enrollments → filieres
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_filiereId_fkey'
  ) THEN
    ALTER TABLE "enrollments"
      ADD CONSTRAINT "enrollments_filiereId_fkey"
      FOREIGN KEY ("filiereId") REFERENCES "filieres"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Seed des 5 filières initiales
INSERT INTO "filieres" ("id", "code", "nom", "description", "emoji", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'AGRICULTURE_TERROIR',     'Agriculture & Terroir',            'Pratiques agricoles, savoirs du terroir et gestion des ressources naturelles en langue locale', '🌾', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'ARTISANAT_PATRIMOINE',    'Artisanat & Patrimoine',            'Techniques artisanales, transmission du savoir-faire et valorisation du patrimoine culturel',  '🏺', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'COMMERCE_MARCHE',         'Commerce & Marché',                 'Pratiques commerciales, négociation et vocabulaire économique en contexte local',               '🛒', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'NUMERIQUE_COMMUNICATION', 'Numérique & Communication',         'Médias, technologies numériques et expression orale/écrite dans la langue',                    '💻', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'SANTE_BIENETRE',          'Santé & Bien-être Communautaire',   'Santé, hygiène, médecine traditionnelle et bien-être exprimés dans la langue',                '🏥', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Phase D2 — Parcours Chercheur
-- Crée l'enum TypeObjectifChercheur + la table objectifs_chercheur
-- Seed des objectifs par défaut pour les 3 niveaux Chercheur

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TypeObjectifChercheur') THEN
    CREATE TYPE "TypeObjectifChercheur" AS ENUM (
      'AUDIO_ENREGISTREMENT',
      'CONTRIBUTION_LANGUE',
      'LECON_MAITRISEE'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "objectifs_chercheur" (
  "id"           TEXT         NOT NULL,
  "gradeLevelId" TEXT         NOT NULL,
  "type"         "TypeObjectifChercheur" NOT NULL,
  "quantite"     INTEGER      NOT NULL,
  "description"  TEXT,
  "isActive"     BOOLEAN      NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "objectifs_chercheur_pkey" PRIMARY KEY ("id")
);

-- Clé étrangère → grade_levels
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'objectifs_chercheur_gradeLevelId_fkey'
  ) THEN
    ALTER TABLE "objectifs_chercheur"
      ADD CONSTRAINT "objectifs_chercheur_gradeLevelId_fkey"
      FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Seed des objectifs par défaut
-- Chercheur I (ordre=14) : 10 audio + 5 contributions + 5 leçons maîtrisées
INSERT INTO "objectifs_chercheur" ("id", "gradeLevelId", "type", "quantite", "description", "isActive", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  g.id,
  obj.type::"TypeObjectifChercheur",
  obj.quantite,
  obj.description,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "grade_levels" g
CROSS JOIN (VALUES
  ('AUDIO_ENREGISTREMENT', 10, '10 enregistrements audio validés'),
  ('CONTRIBUTION_LANGUE',   5, '5 contributions dictionnaire publiées'),
  ('LECON_MAITRISEE',       5, '5 leçons maîtrisées (score ≥ 75 %)')
) AS obj(type, quantite, description)
WHERE g.ordre = 14
ON CONFLICT DO NOTHING;

-- Chercheur II (ordre=15) : 20 audio + 10 contributions + 10 leçons
INSERT INTO "objectifs_chercheur" ("id", "gradeLevelId", "type", "quantite", "description", "isActive", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  g.id,
  obj.type::"TypeObjectifChercheur",
  obj.quantite,
  obj.description,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "grade_levels" g
CROSS JOIN (VALUES
  ('AUDIO_ENREGISTREMENT', 20, '20 enregistrements audio validés'),
  ('CONTRIBUTION_LANGUE',  10, '10 contributions dictionnaire publiées'),
  ('LECON_MAITRISEE',      10, '10 leçons maîtrisées (score ≥ 75 %)')
) AS obj(type, quantite, description)
WHERE g.ordre = 15
ON CONFLICT DO NOTHING;

-- Chercheur III (ordre=16) : 30 audio + 15 contributions + 20 leçons
INSERT INTO "objectifs_chercheur" ("id", "gradeLevelId", "type", "quantite", "description", "isActive", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  g.id,
  obj.type::"TypeObjectifChercheur",
  obj.quantite,
  obj.description,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "grade_levels" g
CROSS JOIN (VALUES
  ('AUDIO_ENREGISTREMENT', 30, '30 enregistrements audio validés'),
  ('CONTRIBUTION_LANGUE',  15, '15 contributions dictionnaire publiées'),
  ('LECON_MAITRISEE',      20, '20 leçons maîtrisées (score ≥ 75 %)')
) AS obj(type, quantite, description)
WHERE g.ordre = 16
ON CONFLICT DO NOTHING;

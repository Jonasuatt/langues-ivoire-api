-- Migration : Workflow de certification ILA par le comité de 5 experts
-- Ajout du rôle EXPERT, des statuts de certification et du modèle ValidationVote

-- 1. Mettre à jour l'enum Role pour ajouter EXPERT
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'EXPERT';

-- 2. Créer l'enum CertificationStatus
DO $$ BEGIN
  CREATE TYPE "CertificationStatus" AS ENUM (
    'SUBMITTED',
    'IN_REVIEW',
    'CERTIFIED_ILA',
    'REVISION_REQUESTED',
    'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Créer l'enum ExpertVoteType
DO $$ BEGIN
  CREATE TYPE "ExpertVoteType" AS ENUM (
    'APPROVED',
    'REVISION_REQUESTED',
    'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Ajouter les colonnes de certification sur audio_contributions
ALTER TABLE "audio_contributions"
  ADD COLUMN IF NOT EXISTS "certificationStatus" "CertificationStatus" NOT NULL DEFAULT 'SUBMITTED',
  ADD COLUMN IF NOT EXISTS "certifiedAt"          TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "certifiedBy"          TEXT;

-- 5. Migrer les enregistrements déjà validés → CERTIFIED_ILA
UPDATE "audio_contributions"
SET "certificationStatus" = 'CERTIFIED_ILA',
    "certifiedAt"         = "validatedAt"
WHERE "isValidated" = TRUE;

-- 6. Créer la table validation_votes
CREATE TABLE IF NOT EXISTS "validation_votes" (
  "id"                  TEXT        NOT NULL,
  "audioContributionId" TEXT        NOT NULL,
  "expertId"            TEXT        NOT NULL,
  "vote"                "ExpertVoteType" NOT NULL,
  "comment"             TEXT,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "validation_votes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "validation_votes_audioContributionId_expertId_key"
    UNIQUE ("audioContributionId", "expertId")
);

-- 7. Foreign keys
ALTER TABLE "validation_votes"
  ADD CONSTRAINT "validation_votes_audioContributionId_fkey"
    FOREIGN KEY ("audioContributionId")
    REFERENCES "audio_contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "validation_votes_expertId_fkey"
    FOREIGN KEY ("expertId")
    REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 8. Index
CREATE INDEX IF NOT EXISTS "audio_contributions_certificationStatus_idx"
  ON "audio_contributions"("certificationStatus");
CREATE INDEX IF NOT EXISTS "validation_votes_audioContributionId_idx"
  ON "validation_votes"("audioContributionId");
CREATE INDEX IF NOT EXISTS "validation_votes_expertId_idx"
  ON "validation_votes"("expertId");

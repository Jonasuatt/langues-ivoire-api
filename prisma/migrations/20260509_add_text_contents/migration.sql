-- CreateTable: text_contents — Textes & Récits (contes, chansons, histoires, légendes, proverbes…)
CREATE TABLE IF NOT EXISTS "text_contents" (
    "id"             TEXT NOT NULL,
    "languageId"     TEXT,
    "type"           TEXT NOT NULL DEFAULT 'CONTE',
    "titre"          TEXT NOT NULL,
    "contenu"        TEXT NOT NULL,
    "traduction"     TEXT,
    "transcription"  TEXT,
    "resume"         TEXT,
    "audioUrl"       TEXT,
    "imageUrl"       TEXT,
    "niveau"         TEXT NOT NULL DEFAULT 'A1',
    "auteur"         TEXT,
    "sourceEthnique" TEXT,
    "tags"           TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dureeMin"       INTEGER,
    "status"         "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "text_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "text_contents_languageId_status_idx" ON "text_contents"("languageId", "status");
CREATE INDEX IF NOT EXISTS "text_contents_type_idx" ON "text_contents"("type");

-- AddForeignKey (optionnel — languageId nullable)
ALTER TABLE "text_contents"
    ADD CONSTRAINT "text_contents_languageId_fkey"
    FOREIGN KEY ("languageId") REFERENCES "languages"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

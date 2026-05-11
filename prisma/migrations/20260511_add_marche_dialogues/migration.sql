-- CreateTable: marche_dialogues
CREATE TABLE IF NOT EXISTS "marche_dialogues" (
    "id"              TEXT NOT NULL,
    "languageId"      TEXT NOT NULL,
    "vendeur"         TEXT NOT NULL,
    "vendeurDesc"     TEXT,
    "salutation"      TEXT NOT NULL,
    "repliques"       JSONB NOT NULL DEFAULT '[]',
    "audioSalutation" TEXT,
    "isActive"        BOOLEAN NOT NULL DEFAULT true,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marche_dialogues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "marche_dialogues_languageId_idx" ON "marche_dialogues"("languageId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "marche_dialogues" ADD CONSTRAINT "marche_dialogues_languageId_fkey"
    FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

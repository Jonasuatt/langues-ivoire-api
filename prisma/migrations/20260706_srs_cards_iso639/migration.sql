-- Répétition espacée (SRS) + code ISO 639-3 sur les langues

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SrsItemType') THEN
    CREATE TYPE "SrsItemType" AS ENUM ('DICTIONARY', 'PHRASE');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "srs_cards" (
    "id"           TEXT          NOT NULL,
    "userId"       TEXT          NOT NULL,
    "languageId"   TEXT          NOT NULL,
    "itemType"     "SrsItemType" NOT NULL DEFAULT 'DICTIONARY',
    "itemId"       TEXT          NOT NULL,
    "repetitions"  INTEGER       NOT NULL DEFAULT 0,
    "easeFactor"   DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER       NOT NULL DEFAULT 0,
    "dueAt"        TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastQuality"  INTEGER,
    "lapses"       INTEGER       NOT NULL DEFAULT 0,
    "suspended"    BOOLEAN       NOT NULL DEFAULT false,
    "createdAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "srs_cards_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "srs_cards_userId_itemType_itemId_key"
    ON "srs_cards"("userId", "itemType", "itemId");
CREATE INDEX IF NOT EXISTS "srs_cards_userId_dueAt_idx"
    ON "srs_cards"("userId", "dueAt");
CREATE INDEX IF NOT EXISTS "srs_cards_userId_languageId_dueAt_idx"
    ON "srs_cards"("userId", "languageId", "dueAt");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'srs_cards_userId_fkey') THEN
    ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'srs_cards_languageId_fkey') THEN
    ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_languageId_fkey"
      FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- ISO 639-3
ALTER TABLE "languages" ADD COLUMN IF NOT EXISTS "iso639_3" TEXT;

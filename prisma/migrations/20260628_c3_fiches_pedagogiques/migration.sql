DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TypeFiche') THEN
    CREATE TYPE "TypeFiche" AS ENUM ('COURS', 'EXERCICE', 'EVALUATION', 'RESSOURCE');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "fiches_pedagogiques" (
    "id"          TEXT        NOT NULL,
    "titre"       TEXT        NOT NULL,
    "description" TEXT,
    "contenu"     TEXT        NOT NULL,
    "type"        "TypeFiche" NOT NULL DEFAULT 'COURS',
    "pilier"      "PilierMatiere",
    "trimestre"   "Trimestre",
    "semaine"     INTEGER,
    "isPublished" BOOLEAN     NOT NULL DEFAULT false,
    "fileUrl"     TEXT,
    "languageId"  TEXT        NOT NULL,
    "gradeLevelId" TEXT       NOT NULL,
    "createdById" TEXT        NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fiches_pedagogiques_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "fiches_pedagogiques_languageId_gradeLevelId_idx"
    ON "fiches_pedagogiques"("languageId", "gradeLevelId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fiches_pedagogiques_languageId_fkey') THEN
    ALTER TABLE "fiches_pedagogiques" ADD CONSTRAINT "fiches_pedagogiques_languageId_fkey"
      FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fiches_pedagogiques_gradeLevelId_fkey') THEN
    ALTER TABLE "fiches_pedagogiques" ADD CONSTRAINT "fiches_pedagogiques_gradeLevelId_fkey"
      FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fiches_pedagogiques_createdById_fkey') THEN
    ALTER TABLE "fiches_pedagogiques" ADD CONSTRAINT "fiches_pedagogiques_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "users"("id") ON UPDATE CASCADE;
  END IF;
END $$;

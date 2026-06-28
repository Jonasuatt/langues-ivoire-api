DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Trimestre') THEN
    CREATE TYPE "Trimestre" AS ENUM ('T1', 'T2', 'T3');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MentionBulletin') THEN
    CREATE TYPE "MentionBulletin" AS ENUM ('EXCELLENT', 'TRES_BIEN', 'BIEN', 'ASSEZ_BIEN', 'PASSABLE', 'INSUFFISANT');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "notes_lecons" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "trimestre" "Trimestre" NOT NULL,
    "annee" INTEGER NOT NULL,
    "tentative" INTEGER NOT NULL DEFAULT 1,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notes_lecons_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notes_lecons_enrollmentId_lessonId_key" UNIQUE ("enrollmentId", "lessonId")
);

CREATE TABLE IF NOT EXISTS "bulletins" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "trimestre" "Trimestre" NOT NULL,
    "annee" INTEGER NOT NULL,
    "moyenneLangue" DOUBLE PRECISION,
    "moyenneCulture" DOUBLE PRECISION,
    "moyennePratique" DOUBLE PRECISION,
    "moyenneGenerale" DOUBLE PRECISION,
    "mention" "MentionBulletin",
    "rang" INTEGER,
    "nombreEleves" INTEGER,
    "observations" TEXT,
    "validatedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "codeVerification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bulletins_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bulletins_codeVerification_key" UNIQUE ("codeVerification"),
    CONSTRAINT "bulletins_enrollmentId_trimestre_annee_key" UNIQUE ("enrollmentId", "trimestre", "annee")
);

CREATE INDEX IF NOT EXISTS "notes_lecons_enrollmentId_trimestre_idx" ON "notes_lecons"("enrollmentId", "trimestre");
CREATE INDEX IF NOT EXISTS "bulletins_enrollmentId_idx" ON "bulletins"("enrollmentId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notes_lecons_enrollmentId_fkey') THEN
    ALTER TABLE "notes_lecons" ADD CONSTRAINT "notes_lecons_enrollmentId_fkey"
      FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notes_lecons_lessonId_fkey') THEN
    ALTER TABLE "notes_lecons" ADD CONSTRAINT "notes_lecons_lessonId_fkey"
      FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bulletins_enrollmentId_fkey') THEN
    ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_enrollmentId_fkey"
      FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bulletins_gradeLevelId_fkey') THEN
    ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_gradeLevelId_fkey"
      FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bulletins_validatedBy_fkey') THEN
    ALTER TABLE "bulletins" ADD CONSTRAINT "bulletins_validatedBy_fkey"
      FOREIGN KEY ("validatedBy") REFERENCES "users"("id") ON UPDATE CASCADE;
  END IF;
END $$;

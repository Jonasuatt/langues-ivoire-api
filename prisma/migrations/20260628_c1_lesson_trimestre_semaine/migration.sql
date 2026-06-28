DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Trimestre') THEN CREATE TYPE "Trimestre" AS ENUM ('T1', 'T2', 'T3'); END IF; END $$;
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "trimestre" "Trimestre";
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "semaine" INTEGER;
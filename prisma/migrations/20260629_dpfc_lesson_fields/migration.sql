-- Ajout des champs DPFC APC sur la table lessons
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='competence') THEN
    ALTER TABLE "lessons" ADD COLUMN "competence" TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lessons' AND column_name='situation') THEN
    ALTER TABLE "lessons" ADD COLUMN "situation" TEXT;
  END IF;
END $$;

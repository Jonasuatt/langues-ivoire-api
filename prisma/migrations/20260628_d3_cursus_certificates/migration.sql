DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TypeCertificatCursus') THEN
    CREATE TYPE "TypeCertificatCursus" AS ENUM (
      'ETAPE_CP2',
      'PRIMAIRE',
      'PREMIER_CYCLE',
      'MAITRISE_LINGUISTIQUE',
      'CHERCHEUR'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "cursus_certificates" (
    "id"               TEXT         NOT NULL,
    "userId"           TEXT         NOT NULL,
    "languageId"       TEXT         NOT NULL,
    "gradeLevelId"     TEXT         NOT NULL,
    "type"             "TypeCertificatCursus" NOT NULL,
    "codeVerification" TEXT         NOT NULL,
    "issuedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedById"       TEXT,
    CONSTRAINT "cursus_certificates_pkey"                        PRIMARY KEY ("id"),
    CONSTRAINT "cursus_certificates_codeVerification_key"        UNIQUE ("codeVerification"),
    CONSTRAINT "cursus_certificates_userId_languageId_type_key"  UNIQUE ("userId", "languageId", "type")
);

CREATE INDEX IF NOT EXISTS "cursus_certificates_userId_idx" ON "cursus_certificates"("userId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cursus_certificates_userId_fkey') THEN
    ALTER TABLE "cursus_certificates" ADD CONSTRAINT "cursus_certificates_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cursus_certificates_languageId_fkey') THEN
    ALTER TABLE "cursus_certificates" ADD CONSTRAINT "cursus_certificates_languageId_fkey"
      FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cursus_certificates_gradeLevelId_fkey') THEN
    ALTER TABLE "cursus_certificates" ADD CONSTRAINT "cursus_certificates_gradeLevelId_fkey"
      FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cursus_certificates_issuedById_fkey') THEN
    ALTER TABLE "cursus_certificates" ADD CONSTRAINT "cursus_certificates_issuedById_fkey"
      FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON UPDATE CASCADE;
  END IF;
END $$;

-- Mode Enseignant : rôles TEACHER + PARTNER, classes et membres

-- Nouveaux rôles (PARTNER était référencé par le mobile/CMS mais absent de l'enum)
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'TEACHER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'PARTNER';

CREATE TABLE IF NOT EXISTS "classrooms" (
    "id"            TEXT         NOT NULL,
    "nom"           TEXT         NOT NULL,
    "code"          TEXT         NOT NULL,
    "etablissement" TEXT,
    "teacherId"     TEXT         NOT NULL,
    "languageId"    TEXT         NOT NULL,
    "gradeLevelId"  TEXT,
    "isActive"      BOOLEAN      NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "classrooms_code_key" ON "classrooms"("code");
CREATE INDEX IF NOT EXISTS "classrooms_teacherId_idx" ON "classrooms"("teacherId");

CREATE TABLE IF NOT EXISTS "classroom_members" (
    "id"          TEXT         NOT NULL,
    "classroomId" TEXT         NOT NULL,
    "userId"      TEXT         NOT NULL,
    "joinedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classroom_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "classroom_members_classroomId_userId_key"
    ON "classroom_members"("classroomId", "userId");
CREATE INDEX IF NOT EXISTS "classroom_members_userId_idx" ON "classroom_members"("userId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classrooms_teacherId_fkey') THEN
    ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacherId_fkey"
      FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classrooms_languageId_fkey') THEN
    ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_languageId_fkey"
      FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classrooms_gradeLevelId_fkey') THEN
    ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_gradeLevelId_fkey"
      FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classroom_members_classroomId_fkey') THEN
    ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_classroomId_fkey"
      FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classroom_members_userId_fkey') THEN
    ALTER TABLE "classroom_members" ADD CONSTRAINT "classroom_members_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

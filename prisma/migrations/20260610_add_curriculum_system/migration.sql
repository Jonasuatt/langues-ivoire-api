-- CreateEnum
CREATE TYPE "PassageMode" AS ENUM ('AUTO', 'COMITE');

-- CreateEnum
CREATE TYPE "PilierMatiere" AS ENUM ('LANGUE_COMMUNICATION', 'CULTURE_CITOYENNETE', 'PRATIQUE_METIERS');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PHONE_VALIDATED';

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "gradeLevelId" TEXT,
ADD COLUMN     "isObligatoire" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pilier" "PilierMatiere";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "phone_otps" (
    "id" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_levels" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "cycle" TEXT NOT NULL,
    "passageMode" "PassageMode" NOT NULL DEFAULT 'AUTO',
    "seuilPassage" INTEGER NOT NULL DEFAULT 75,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grade_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "moyenne" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment_history" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "moyenneFinale" DOUBLE PRECISION,
    "passageMode" "PassageMode" NOT NULL,
    "decidedBy" TEXT,
    "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_questions" (
    "id" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "niveauOrdre" INTEGER NOT NULL,
    "donnees" JSONB NOT NULL,
    "solution" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_modules" (
    "id" TEXT NOT NULL,
    "moduleKey" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "pilier" "PilierMatiere" NOT NULL,
    "minGradeOrdre" INTEGER NOT NULL DEFAULT 1,
    "isCursus" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_modules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "phone_otps_telephone_idx" ON "phone_otps"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_code_key" ON "grade_levels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_ordre_key" ON "grade_levels"("ordre");

-- CreateIndex
CREATE INDEX "enrollments_gradeLevelId_idx" ON "enrollments"("gradeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_languageId_key" ON "enrollments"("userId", "languageId");

-- CreateIndex
CREATE INDEX "enrollment_history_enrollmentId_idx" ON "enrollment_history"("enrollmentId");

-- CreateIndex
CREATE INDEX "placement_questions_languageId_isActive_idx" ON "placement_questions"("languageId", "isActive");

-- CreateIndex
CREATE INDEX "placement_results_userId_languageId_idx" ON "placement_results"("userId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_modules_moduleKey_key" ON "curriculum_modules"("moduleKey");

-- CreateIndex
CREATE INDEX "lessons_gradeLevelId_idx" ON "lessons"("gradeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "users_telephone_key" ON "users"("telephone");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_history" ADD CONSTRAINT "enrollment_history_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_history" ADD CONSTRAINT "enrollment_history_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_questions" ADD CONSTRAINT "placement_questions_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_results" ADD CONSTRAINT "placement_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_results" ADD CONSTRAINT "placement_results_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_results" ADD CONSTRAINT "placement_results_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- DropIndex
DROP INDEX "tutors_languageId_key";

-- AlterTable
ALTER TABLE "tutors" ADD COLUMN     "genre" TEXT NOT NULL DEFAULT 'M';

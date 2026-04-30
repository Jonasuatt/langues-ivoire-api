-- AlterTable
ALTER TABLE "audio_contributions" ADD COLUMN     "estVoixOfficielle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "genreVoix" TEXT;

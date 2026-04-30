-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bonusXp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "duree" INTEGER,
    "categorie" TEXT NOT NULL DEFAULT 'culturel',
    "source" TEXT NOT NULL DEFAULT 'youtube',
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_contributions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "mot" TEXT NOT NULL,
    "traduction" TEXT,
    "audioUrl" TEXT NOT NULL,
    "transcription" TEXT,
    "categorie" TEXT,
    "duree" INTEGER,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validatedBy" TEXT,
    "validatedAt" TIMESTAMP(3),
    "qualityScore" DOUBLE PRECISION,
    "timesPlayed" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "tutorId" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'listen_repeat',
    "wordsCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "audioRecordings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "videos_languageId_categorie_idx" ON "videos"("languageId", "categorie");

-- CreateIndex
CREATE INDEX "audio_contributions_languageId_isValidated_idx" ON "audio_contributions"("languageId", "isValidated");

-- CreateIndex
CREATE INDEX "audio_contributions_mot_languageId_idx" ON "audio_contributions"("mot", "languageId");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_contributions" ADD CONSTRAINT "audio_contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_contributions" ADD CONSTRAINT "audio_contributions_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

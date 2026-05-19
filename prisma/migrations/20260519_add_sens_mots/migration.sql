-- CreateTable
CREATE TABLE "sens_mots" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "motSource" TEXT NOT NULL,
    "transcription" TEXT,
    "audioUrl" TEXT,
    "sensHistoriqueFr" TEXT NOT NULL,
    "sensVeritable" TEXT NOT NULL,
    "contexteErreur" TEXT,
    "source" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sens_mots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sens_mots_languageId_status_idx" ON "sens_mots"("languageId", "status");

-- AddForeignKey
ALTER TABLE "sens_mots" ADD CONSTRAINT "sens_mots_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

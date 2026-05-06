-- CreateTable
CREATE TABLE IF NOT EXISTS "premiers_secours_phrases" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "situation" TEXT NOT NULL,
    "consigne" TEXT NOT NULL,
    "traduction" TEXT,
    "transcription" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "genreVoix" TEXT,
    "priorite" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premiers_secours_phrases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "civic_content" (
    "id" TEXT NOT NULL,
    "languageId" TEXT,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "traduction" TEXT,
    "explication" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "genreVoix" TEXT,
    "valeur" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "civic_content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "premiers_secours_phrases" ADD CONSTRAINT "premiers_secours_phrases_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "civic_content" ADD CONSTRAINT "civic_content_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: image_galleries
CREATE TABLE IF NOT EXISTS "image_galleries" (
    "id"          TEXT NOT NULL,
    "languageId"  TEXT,
    "rubrique"    TEXT NOT NULL DEFAULT '',
    "titre"       TEXT NOT NULL,
    "description" TEXT,
    "coverUrl"    TEXT,
    "ordre"       INTEGER NOT NULL DEFAULT 0,
    "status"      "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable: gallery_images
CREATE TABLE IF NOT EXISTS "gallery_images" (
    "id"            TEXT NOT NULL,
    "galleryId"     TEXT NOT NULL,
    "imageUrl"      TEXT NOT NULL,
    "legende"       TEXT,
    "transcription" TEXT,
    "traduction"    TEXT,
    "ordre"         INTEGER NOT NULL DEFAULT 1,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "image_galleries_languageId_idx" ON "image_galleries"("languageId");
CREATE INDEX IF NOT EXISTS "gallery_images_galleryId_idx" ON "gallery_images"("galleryId");

-- AddForeignKey (only if language exists)
DO $$ BEGIN
  ALTER TABLE "image_galleries" ADD CONSTRAINT "image_galleries_languageId_fkey"
    FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_galleryId_fkey"
    FOREIGN KEY ("galleryId") REFERENCES "image_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

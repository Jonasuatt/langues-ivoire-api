-- AddColumn: audioUrlFr sur cultural_items (pour Musée des Trésors)
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "audioUrlFr" TEXT;

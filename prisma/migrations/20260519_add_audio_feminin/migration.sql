-- Add female audio fields to useful_phrases, cultural_items, premiers_secours_phrases

ALTER TABLE "useful_phrases" ADD COLUMN IF NOT EXISTS "audioUrlF" TEXT;
ALTER TABLE "useful_phrases" ADD COLUMN IF NOT EXISTS "audioUrlFrF" TEXT;

ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "audioUrlF" TEXT;
ALTER TABLE "cultural_items" ADD COLUMN IF NOT EXISTS "audioUrlFrF" TEXT;

ALTER TABLE "premiers_secours_phrases" ADD COLUMN IF NOT EXISTS "audioUrlF" TEXT;
ALTER TABLE "premiers_secours_phrases" ADD COLUMN IF NOT EXISTS "audioUrlFrF" TEXT;

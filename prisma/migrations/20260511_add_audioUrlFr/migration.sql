-- Add audioUrlFr column (French audio URL) to all content models that have audioUrl

-- TextContent (Textes & Récits)
ALTER TABLE "text_contents" ADD COLUMN IF NOT EXISTS "audioUrlFr" TEXT;

-- PremierSecoursPhrase (Premiers Secours)
ALTER TABLE "premiers_secours_phrases" ADD COLUMN IF NOT EXISTS "audioUrlFr" TEXT;

-- CivicContent (Civisme)
ALTER TABLE "civic_content" ADD COLUMN IF NOT EXISTS "audioUrlFr" TEXT;

-- UsefulPhrase (Phrases Utiles)
ALTER TABLE "useful_phrases" ADD COLUMN IF NOT EXISTS "audioUrlFr" TEXT;

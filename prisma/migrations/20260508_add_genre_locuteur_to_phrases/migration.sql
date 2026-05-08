-- AddColumn: genre du locuteur audio sur UsefulPhrase
-- 'M' = masculin, 'F' = féminin, NULL = non renseigné
ALTER TABLE "useful_phrases" ADD COLUMN IF NOT EXISTS "genreLocuteur" TEXT;

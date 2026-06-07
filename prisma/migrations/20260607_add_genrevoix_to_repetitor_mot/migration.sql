-- Ajout du genre de voix sur les mots du jeu RÉPÉTO
-- "M" = voix masculine, "F" = voix féminine, NULL = non précisé
ALTER TABLE "repetitor_mots" ADD COLUMN "genreVoix" TEXT;

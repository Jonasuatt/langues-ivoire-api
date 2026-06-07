-- ==================== RÉPÉTO — Compagnon Vocal ILA ====================
-- Phase 1 : Mode Écho — collecte de corpus audio pour les langues ethniques ivoiriennes
-- Phase 2 (future) : IA de reconnaissance vocale entraînée sur corpus ILA

-- Table des mots du jeu RÉPÉTO (configurés par langue par l'admin CMS)
CREATE TABLE "repetitor_mots" (
    "id"          TEXT NOT NULL,
    "languageId"  TEXT NOT NULL,
    "languageNom" TEXT,
    "mot"         TEXT NOT NULL,
    "traduction"  TEXT,
    "audioUrl"    TEXT NOT NULL,
    "emoji"       TEXT,
    "categorie"   TEXT NOT NULL DEFAULT 'general',
    "niveau"      TEXT NOT NULL DEFAULT 'debutant',
    "ordre"       INTEGER NOT NULL DEFAULT 0,
    "actif"       BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repetitor_mots_pkey" PRIMARY KEY ("id")
);

-- Table des sessions enregistrées par les apprenants via l'app mobile
CREATE TABLE "repetitor_sessions" (
    "id"              TEXT NOT NULL,
    "repetitorMotId"  TEXT,
    "languageId"      TEXT,
    "languageNom"     TEXT,
    "motCible"        TEXT NOT NULL,
    "traduction"      TEXT,
    "audioNatifUrl"   TEXT,
    "audioEnfantUrl"  TEXT NOT NULL,
    "dureeMs"         INTEGER,
    "ageGroupe"       TEXT NOT NULL DEFAULT 'INCONNU',
    "statut"          TEXT NOT NULL DEFAULT 'BRUT',
    "scoreProximite"  DOUBLE PRECISION,
    "deviceId"        TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repetitor_sessions_pkey" PRIMARY KEY ("id")
);

-- Index pour les requêtes fréquentes
CREATE INDEX "repetitor_mots_languageId_actif_idx"    ON "repetitor_mots"("languageId", "actif");
CREATE INDEX "repetitor_sessions_languageId_idx"       ON "repetitor_sessions"("languageId");
CREATE INDEX "repetitor_sessions_statut_idx"           ON "repetitor_sessions"("statut");
CREATE INDEX "repetitor_sessions_createdAt_idx"        ON "repetitor_sessions"("createdAt");

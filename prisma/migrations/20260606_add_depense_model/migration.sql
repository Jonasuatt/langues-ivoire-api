-- CreateTable: Depense
-- Rapport des dépenses financières de la plateforme Langues Ivoire

CREATE TABLE "depenses" (
    "id"               TEXT NOT NULL,
    "sujet"            TEXT NOT NULL,
    "objet"            TEXT NOT NULL,
    "description"      TEXT,
    "montant"          INTEGER NOT NULL,
    "date"             TIMESTAMP(3) NOT NULL,
    "statut"           TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "pieceJointeUrl"   TEXT,
    "pieceJointeNom"   TEXT,
    "pieceJointeType"  TEXT,
    "reference"        TEXT,
    "fournisseur"      TEXT,
    "createdById"      TEXT,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

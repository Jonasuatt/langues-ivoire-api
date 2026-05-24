-- Rendre adminId optionnel et ajouter userId + auteur à SupportReply
-- Permet aux utilisateurs de répondre dans leur propre thread de support

-- adminId devient nullable (les réponses utilisateur n'ont pas d'adminId)
ALTER TABLE "support_replies" ALTER COLUMN "adminId" DROP NOT NULL;

-- Ajouter userId (nullable) pour les réponses utilisateur
ALTER TABLE "support_replies" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Ajouter auteur : 'ADMIN' par défaut (rétrocompatible avec les réponses existantes)
ALTER TABLE "support_replies" ADD COLUMN IF NOT EXISTS "auteur" TEXT NOT NULL DEFAULT 'ADMIN';

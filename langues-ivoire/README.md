# LANGUES IVOIRE — Écosystème numérique complet

> Application mobile + CMS Web + API REST + Agent IA (TEV)

## Structure du projet

```
langues-ivoire/
├── api/          → Backend Node.js + Express + Prisma (PostgreSQL)
├── mobile/       → Application React Native (Expo) — iOS & Android
├── cms/          → Back-Office React.js + TailwindCSS
└── ai/           → Service IA Python FastAPI (Tuteurs + Prononciation + TTS/ASR)
```

## Lancement rapide

### 1. API (Node.js)
```bash
cd api
cp .env.example .env        # remplir les variables
npm install
npx prisma migrate dev       # créer les tables
node prisma/seed.js          # insérer les données de base
npm run dev                  # → http://localhost:3000
```

### 2. CMS (React.js)
```bash
cd cms
npm install
npm run dev                  # → http://localhost:3001
# Connexion : admin@languesivoire.ci / Admin@2026!
```

### 3. Application Mobile (React Native)
```bash
cd mobile
npm install
npx expo start               # Scanner le QR code avec Expo Go
```

### 4. Service IA (Python)
```bash
cd ai
cp .env.example .env         # remplir ANTHROPIC_API_KEY ou OPENAI_API_KEY
pip install -r requirements.txt
python main.py               # → http://localhost:8000
```

## Stack technique

| Composant | Technologie |
|-----------|------------|
| Mobile | React Native + Expo SDK 55 |
| API | Node.js + Express + Prisma + PostgreSQL |
| CMS | React.js + TailwindCSS + Vite |
| IA | Python FastAPI + Claude (Anthropic) / GPT-4o |
| ASR | facebook/mms-1b-all |
| TTS | facebook/mms-tts |
| Cache | Redis |
| Fichiers | Cloudinary |
| CI/CD | GitHub Actions + EAS |

## 8 Langues MVP

| Langue | Tuteur IA | Région |
|--------|-----------|--------|
| Baoulé | Koffi | Centre |
| Dioula | Amara | Nord & national |
| Bété | Yoro | Ouest |
| Senoufo | Tialagnon | Nord (Korhogo) |
| Agni | Tehia | Est |
| Gouro | Zan Bi | Centre-Ouest |
| Guéré | Oulahi | Ouest |
| Nouchi | Pololo | Abidjan & national |

## Variables d'environnement requises

### API (`.env`)
- `DATABASE_URL` — URL PostgreSQL
- `JWT_SECRET` — Secret JWT (min. 32 chars)
- `CLOUDINARY_*` — Credentials Cloudinary

### IA (`.env`)
- `ANTHROPIC_API_KEY` ou `OPENAI_API_KEY`
- `LLM_PROVIDER` — `"anthropic"` ou `"openai"`

## Modèle économique Freemium
- Gratuit : accès limité aux leçons
- Premium : **100 FCFA/jour** | **2 500 FCFA/mois** | **25 000 FCFA/an**

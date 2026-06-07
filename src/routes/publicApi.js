/**
 * LINGUA Africa — API Publique v1
 * Accès en lecture seule pour partenaires, chercheurs et apps tierces
 *
 * Authentification : clé API (X-API-Key header)
 * Base URL : /api/v1/public
 *
 * Endpoints disponibles :
 *   GET /languages          — Liste des langues
 *   GET /languages/:code    — Détail d'une langue
 *   GET /dictionary         — Entrées du dictionnaire (paginées)
 *   GET /proverbs           — Proverbes et traditions culturelles
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const apiKeyAuth = require('../middleware/apiKey');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limit spécifique à l'API publique : 60 req/min par clé
const publicLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  message: { error: 'Limite de 60 requêtes/minute atteinte', docs: '/api-docs' },
});

router.use(apiKeyAuth);
router.use(publicLimit);

// ─── GET /languages ────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/public/languages:
 *   get:
 *     summary: Liste des langues disponibles
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *         description: "Filtrer par pays (code ISO 3166-1 alpha-2 : CI, ML, BF, SN…)"
 *       - in: query
 *         name: mvpOnly
 *         schema: { type: boolean }
 *         description: "Afficher uniquement les langues du MVP"
 *     responses:
 *       200:
 *         description: Liste des langues actives
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: { type: integer }
 *                 languages:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Language' }
 */
router.get('/languages', async (req, res, next) => {
  try {
    const { country, mvpOnly } = req.query;
    const where = { isActive: true };
    if (country) where.countryCode = country.toUpperCase();
    if (mvpOnly === 'true') where.isInMvp = true;

    const languages = await prisma.language.findMany({
      where,
      orderBy: { ordreAffichage: 'asc' },
      select: {
        id: true, nom: true, code: true, famille: true, region: true,
        locuteurs: true, description: true, imageDrapeau: true,
        countryCode: true, countryName: true,
        emoji: true, couleur: true, lat: true, lng: true,
        isInMvp: true,
        _count: {
          select: { lessons: true, dictEntries: { where: { status: 'PUBLISHED' } } }
        },
      },
    });

    res.json({ count: languages.length, languages });
  } catch (err) { next(err); }
});

// ─── GET /languages/:code ──────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/public/languages/{code}:
 *   get:
 *     summary: Détail d'une langue
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *         description: "Code de la langue (ex: baoule, dioula)"
 *     responses:
 *       200:
 *         description: Détail de la langue
 *       404:
 *         description: Langue non trouvée
 */
router.get('/languages/:code', async (req, res, next) => {
  try {
    const lang = await prisma.language.findFirst({
      where: { code: req.params.code, isActive: true },
      select: {
        id: true, nom: true, code: true, famille: true, region: true,
        locuteurs: true, description: true, imageDrapeau: true,
        countryCode: true, countryName: true,
        emoji: true, couleur: true, lat: true, lng: true,
        isInMvp: true,
        _count: {
          select: { lessons: true, dictEntries: { where: { status: 'PUBLISHED' } } }
        },
      },
    });
    if (!lang) return res.status(404).json({ error: 'Langue non trouvée' });
    res.json(lang);
  } catch (err) { next(err); }
});

// ─── GET /dictionary ────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/public/dictionary:
 *   get:
 *     summary: Entrées du dictionnaire (paginées)
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema: { type: string }
 *         description: "Code de langue (ex: baoule)"
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: "Terme de recherche"
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: "Catégorie (salutations, famille, nourriture…)"
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50, maximum: 200 }
 *     responses:
 *       200:
 *         description: Entrées du dictionnaire
 */
router.get('/dictionary', async (req, res, next) => {
  try {
    const { lang, q, category, page = '1', limit = '50' } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = { status: 'PUBLISHED' };
    if (lang) where.language = { code: lang };
    if (category) where.categorie = { contains: category, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { mot:        { contains: q, mode: 'insensitive' } },
        { traduction: { contains: q, mode: 'insensitive' } },
        { phonetique: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, entries] = await Promise.all([
      prisma.dictionaryEntry.count({ where }),
      prisma.dictionaryEntry.findMany({
        where,
        skip, take: limitNum,
        orderBy: { mot: 'asc' },
        select: {
          id: true, mot: true, traduction: true, phonetique: true,
          categorie: true, exemple: true, audioUrl: true,
          language: { select: { nom: true, code: true } },
        },
      }),
    ]);

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      entries,
    });
  } catch (err) { next(err); }
});

// ─── GET /proverbs ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/public/proverbs:
 *   get:
 *     summary: Proverbes et items culturels
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema: { type: string }
 *         description: "Code de langue"
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [PROVERB, TRADITION, ANECDOTE, TALE, MUSIC, DANCE, TRESOR] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *     responses:
 *       200:
 *         description: Items culturels
 */
router.get('/proverbs', async (req, res, next) => {
  try {
    const { lang, type = 'PROVERB', limit = '20' } = req.query;
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const where = { status: 'PUBLISHED', type };
    if (lang) where.language = { code: lang };

    const items = await prisma.culturalItem.findMany({
      where,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, titre: true, contenu: true, traduction: true,
        explication: true, type: true, audioUrl: true,
        language: { select: { nom: true, code: true } },
      },
    });

    res.json({ count: items.length, items });
  } catch (err) { next(err); }
});

// ─── GET /stats ────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/v1/public/stats:
 *   get:
 *     summary: Statistiques globales de la plateforme
 *     tags: [Public API]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Statistiques agrégées
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [languages, words, proverbs, users] = await Promise.all([
      prisma.language.count({ where: { isActive: true } }),
      prisma.dictionaryEntry.count({ where: { status: 'PUBLISHED' } }),
      prisma.culturalItem.count({ where: { type: 'PROVERB', status: 'PUBLISHED' } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    res.json({
      platform: 'LINGUA Africa',
      version: '1.0.0',
      stats: { languages, words, proverbs, learners: users },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) { next(err); }
});

module.exports = router;

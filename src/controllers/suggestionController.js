const prisma = require('../lib/prisma');
const { alerterNouvelleProposition } = require('../services/emailService');

const clean = (v, max) => String(v ?? '').trim().slice(0, max);

// Public : enregistre une proposition. Le champ « siteWeb » est un piège à robots (invisible pour les humains).
const creer = async (req, res, next) => {
  try {
    const { nom, contact, texte, publiable, siteWeb } = req.body || {};
    if (siteWeb) return res.status(201).json({ ok: true }); // robot : on fait semblant, on ne stocke rien
    const corps = clean(texte, 2000);
    if (corps.length < 5) return res.status(400).json({ error: 'Écrivez au moins quelques mots.' });
    const creee = await prisma.suggestion.create({
      data: { nom: clean(nom, 80) || null, contact: clean(contact, 120) || null, texte: corps, publiable: publiable === true },
    });
    res.status(201).json({ ok: true });
    alerterNouvelleProposition(creee); // en arrière-plan : n'attend pas, n'échoue jamais
  } catch (e) { next(e); }
};

// Public : seulement les échanges que l'équipe a publiés avec l'accord de l'auteur (jamais le contact).
const publiees = async (req, res, next) => {
  try {
    const rows = await prisma.suggestion.findMany({
      where: { publiee: true, publiable: true, reponse: { not: null } },
      select: { nom: true, texte: true, reponse: true, repondueLe: true },
      orderBy: { repondueLe: 'desc' },
      take: 30,
    });
    res.set('Cache-Control', 'public, max-age=60');
    res.json(rows.map((r) => ({ nom: r.nom || 'Anonyme', texte: r.texte, reponse: r.reponse, repondueLe: r.repondueLe })));
  } catch (e) { next(e); }
};

// Admin
const lister = async (req, res, next) => {
  try {
    const where = req.query.statut ? { statut: String(req.query.statut) } : {};
    const rows = await prisma.suggestion.findMany({ where, orderBy: { createdAt: 'desc' }, take: 300 });
    res.json(rows);
  } catch (e) { next(e); }
};

const mettreAJour = async (req, res, next) => {
  try {
    const cur = await prisma.suggestion.findUnique({ where: { id: req.params.id } });
    if (!cur) return res.status(404).json({ error: 'Proposition introuvable' });
    const data = {};
    if (typeof req.body.reponse === 'string') {
      const r = clean(req.body.reponse, 2000);
      data.reponse = r || null;
      if (r) { data.repondueLe = new Date(); data.statut = 'REPONDU'; }
      else { data.publiee = false; data.statut = 'LU'; }
    }
    if (typeof req.body.statut === 'string' && ['NOUVEAU', 'LU', 'REPONDU'].includes(req.body.statut) && data.statut === undefined) data.statut = req.body.statut;
    if (typeof req.body.publiee === 'boolean') {
      const reponse = data.reponse !== undefined ? data.reponse : cur.reponse;
      if (req.body.publiee && (!cur.publiable || !reponse)) {
        return res.status(400).json({ error: 'Publication impossible : il faut une réponse et l’accord de l’auteur.' });
      }
      data.publiee = req.body.publiee && data.publiee !== false;
    }
    res.json(await prisma.suggestion.update({ where: { id: cur.id }, data }));
  } catch (e) { next(e); }
};

const supprimer = async (req, res, next) => {
  try {
    await prisma.suggestion.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) { if (e.code === 'P2025') return res.status(404).json({ error: 'Proposition introuvable' }); next(e); }
};

module.exports = { creer, publiees, lister, mettreAJour, supprimer };

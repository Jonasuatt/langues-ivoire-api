const rateLimit = require('express-rate-limit');

/**
 * Limiteur pour les routes qui déclenchent un appel IA facturé
 * (Whisper, Claude). Objectif : plafonner la dépense en cas d'abus
 * sans gêner un usage normal — y compris une classe entière derrière
 * une seule connexion partagée (NAT), fréquent en milieu scolaire.
 *
 * Clé : l'utilisateur connecté si présent, sinon l'IP.
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Trop de requêtes vocales — patientez quelques minutes.' },
});

/** Chat des tuteurs : même cadence que l'agent IA (30 / 5 min). */
const tutorChatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Trop de questions — attendez quelques minutes avant de réessayer.' },
});

module.exports = { aiLimiter, tutorChatLimiter };

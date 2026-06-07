/**
 * Middleware d'authentification par clé API
 * Utilisé pour les routes publiques v1 (partenaires, chercheurs, apps tierces)
 *
 * La clé est passée dans l'en-tête : X-API-Key: <clé>
 * ou en query param : ?api_key=<clé>
 *
 * Les clés valides sont dans la variable d'env API_KEYS (séparées par des virgules)
 * Exemple : API_KEYS=key_abc123,key_def456
 */

module.exports = function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;

  if (!key) {
    return res.status(401).json({
      error: 'Clé API manquante',
      hint: 'Ajoutez l\'en-tête X-API-Key ou le paramètre api_key',
      docs: '/api-docs',
    });
  }

  const validKeys = (process.env.API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean);

  // En développement, accepter la clé "dev_key" sans config
  if (process.env.NODE_ENV !== 'production' && key === 'dev_key') {
    req.apiKeyInfo = { tier: 'dev', partner: 'Development' };
    return next();
  }

  if (!validKeys.includes(key)) {
    return res.status(403).json({
      error: 'Clé API invalide ou révoquée',
      docs: '/api-docs',
    });
  }

  req.apiKeyInfo = { key };
  next();
};

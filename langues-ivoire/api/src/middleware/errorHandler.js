const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token invalide' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expiré' });
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint
    return res.status(409).json({ error: 'Cette ressource existe déjà' });
  }

  if (err.code === 'P2025') {
    // Prisma not found
    return res.status(404).json({ error: 'Ressource non trouvée' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
};

module.exports = { errorHandler };

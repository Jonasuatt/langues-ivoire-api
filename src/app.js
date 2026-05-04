require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const languageRoutes = require('./routes/languages');
const dictionaryRoutes = require('./routes/dictionary');
const lessonRoutes = require('./routes/lessons');
const contributionRoutes = require('./routes/contributions');
const culturalRoutes = require('./routes/cultural');
const tutorRoutes = require('./routes/tutors');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');
const syncRoutes = require('./routes/sync');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');
const videoRoutes = require('./routes/videos');
const audioContribRoutes = require('./routes/audioContributions');
const searchRoutes = require('./routes/search');
const agentChatRoutes = require('./routes/agentChat');
const phrasesRoutes = require('./routes/phrases');
const badgesRoutes = require('./routes/badges');
const supportRoutes = require('./routes/support');
const certificateRoutes = require('./routes/certificates');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Sécurité
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';
app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
});
app.use('/api/', limiter);

// Corps des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logs
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/cultural', culturalRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/users', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/audio-contributions', audioContribRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/agent-chat', agentChatRoutes);
app.use('/api/phrases', phrasesRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/certificates', certificateRoutes);

// Santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', project: 'Langues Ivoire' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestionnaire d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Langues Ivoire API démarrée sur le port ${PORT}`);
});

module.exports = app;

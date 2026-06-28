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
const premierSecoursRoutes = require('./routes/premierSecours');
const civismeRoutes = require('./routes/civisme');
const textContentRoutes = require('./routes/textContent');
const imageGalleryRoutes = require('./routes/imageGalleries');
const marcheDialoguesRoutes = require('./routes/marcheDialogues');
const sensMotsRoutes = require('./routes/sensMots');
const mathRoutes = require('./routes/math');
const monnaieRoutes = require('./routes/monnaie');
const partenairesRoutes = require('./routes/partenaires');
const financeContribRoutes = require('./routes/financeContributions');
const depensesRoutes = require('./routes/depenses');
const repetitorRoutes = require('./routes/repetitor');
const publicApiRoutes     = require('./routes/publicApi');
const pronunciationRoutes = require('./routes/pronunciation');
const { errorHandler } = require('./middleware/errorHandler');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// Sécurité
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';
app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting global (désactivé en développement local)
// Les requêtes avec un token JWT valide sont exemptées (admins CMS)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    skip: (req) => {
      // Exempter les requêtes authentifiées (Bearer token présent)
      return !!(req.headers.authorization && req.headers.authorization.startsWith('Bearer '));
    },
    message: { error: 'Trop de requêtes, réessayez plus tard.' },
  });
  app.use('/api/', limiter);
}

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
app.use('/api/premiers-secours', premierSecoursRoutes);
app.use('/api/civisme', civismeRoutes);
app.use('/api/text-contents', textContentRoutes);
app.use('/api/image-galleries', imageGalleryRoutes);
app.use('/api/marche-dialogues', marcheDialoguesRoutes);
app.use('/api/sens-mots', sensMotsRoutes);
app.use('/api/mathematiques', mathRoutes);
app.use('/api/monnaie', monnaieRoutes);
app.use('/api/partenaires', partenairesRoutes);
app.use('/api/finance', financeContribRoutes);
app.use('/api/depenses', depensesRoutes);
app.use('/api/admin/seed-galleries', require('./routes/seedAdmin'));
app.use('/api/validation-committee', require('./routes/validationCommittee'));
app.use('/api/repetitor', repetitorRoutes);

// ─── Cursus Scolaire (Phase A+B) ───────────────────────────────────────────
app.use('/api/curriculum', require('./routes/curriculum'));

// ─── Cahier de notes & Bulletins (Phase C) ─────────────────────────────────
app.use('/api/notes',  require('./routes/notes'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/fiches', require('./routes/fiches'));

// ─── API Publique v1 ────────────────────────────────────────────────────────
app.use('/api/v1/public', publicApiRoutes);

// ─── Prononciation & Traducteur IA (Phase 6) ──────────────────────────────
app.use('/api/pronunciation', pronunciationRoutes);

// ─── Documentation Swagger ─────────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'LINGUA Africa — API Docs',
    customCss: '.swagger-ui .topbar { background-color: #0B3D2E; }',
    swaggerOptions: { persistAuthorization: true },
  }),
);
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '2.5.0', project: 'LINGUA Africa', docs: '/api-docs' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestionnaire d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LINGUA Africa API démarrée sur le port ${PORT}`);
  console.log(`📚 Documentation : http://localhost:${PORT}/api-docs`);
});

module.exports = app;

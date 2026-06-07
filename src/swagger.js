/**
 * Configuration Swagger pour LINGUA Africa API Publique v1
 */
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LINGUA Africa — API Publique',
      version: '1.0.0',
      description: `
## API Publique LINGUA Africa v1

Accès en lecture seule aux données linguistiques africaines :
langues, dictionnaire, proverbes et statistiques.

### Authentification
Toutes les routes nécessitent une clé API passée dans l'en-tête :

\`\`\`
X-API-Key: votre_cle_api
\`\`\`

Ou en query parameter : \`?api_key=votre_cle_api\`

### Obtenir une clé API
Contactez **contact@lingua-africa.ci** en indiquant votre usage.

### Langues disponibles
Baoulé, Dioula, Bété, Guéré, Agni, Attié, Sénoufo, Gouro, Nouchi, Yacouba

### Rate Limiting
60 requêtes par minute par clé API.
      `,
      contact: {
        name: 'Équipe LINGUA Africa',
        email: 'api@lingua-africa.ci',
        url: 'https://www.lingua-africa.ci',
      },
      license: {
        name: 'Creative Commons BY-NC 4.0',
        url: 'https://creativecommons.org/licenses/by-nc/4.0/',
      },
    },
    servers: [
      {
        url: 'https://api-production-7107f.up.railway.app',
        description: 'Serveur de production (Railway)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement local',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
      schemas: {
        Language: {
          type: 'object',
          properties: {
            id:          { type: 'string', format: 'uuid' },
            nom:         { type: 'string', example: 'Baoulé' },
            code:        { type: 'string', example: 'baoule' },
            famille:     { type: 'string', example: 'Akan' },
            region:      { type: 'string', example: 'Centre' },
            locuteurs:   { type: 'integer', example: 2500000 },
            description: { type: 'string' },
            countryCode: { type: 'string', example: 'CI' },
            countryName: { type: 'string', example: "Côte d'Ivoire" },
            emoji:       { type: 'string', example: '🌿' },
            couleur:     { type: 'string', example: '#D4A017' },
            lat:         { type: 'number', example: 7.54 },
            lng:         { type: 'number', example: -5.55 },
            isInMvp:     { type: 'boolean' },
          },
        },
        DictionaryEntry: {
          type: 'object',
          properties: {
            id:          { type: 'string', format: 'uuid' },
            mot:         { type: 'string', example: 'Akwaba' },
            traduction:  { type: 'string', example: 'Bienvenue' },
            phonetique:  { type: 'string', example: '[akwaba]' },
            categorie:   { type: 'string', example: 'salutations' },
            exemple:     { type: 'string' },
            audioUrl:    { type: 'string', format: 'uri' },
            language: {
              type: 'object',
              properties: {
                nom:  { type: 'string' },
                code: { type: 'string' },
              },
            },
          },
        },
        CulturalItem: {
          type: 'object',
          properties: {
            id:          { type: 'string', format: 'uuid' },
            titre:       { type: 'string' },
            contenu:     { type: 'string' },
            traduction:  { type: 'string' },
            explication: { type: 'string' },
            type: {
              type: 'string',
              enum: ['PROVERB', 'TRADITION', 'ANECDOTE', 'TALE', 'MUSIC', 'DANCE', 'TRESOR'],
            },
            audioUrl: { type: 'string', format: 'uri' },
          },
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ['./src/routes/publicApi.js'],
};

module.exports = swaggerJsdoc(options);

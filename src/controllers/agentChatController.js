const { PrismaClient } = require('@prisma/client');
const Anthropic = require('@anthropic-ai/sdk');

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Extraire les mots-clés d'une question utilisateur
// Priorité aux mots entre guillemets/apostrophes, sinon mots significatifs
function extractKeywords(message) {
  // Mots entre guillemets ou apostrophes → recherche exacte
  const quoted = message.match(/['"""«»]([^'"""«»]+)['"""«»]/g);
  if (quoted && quoted.length > 0) {
    return quoted.map(q => q.replace(/['"""«»]/g, '').trim()).filter(Boolean);
  }

  // Sinon : supprimer les formules de politesse et mots vides, garder les termes clés
  const stopWords = [
    'comment', 'dit', 'dites', 'dire', 'on', 'peut', 'traduire', 'traduction',
    'traduisez', 'signifie', 'veut', 'que', 'est', 'ce', 'sens', 'quel',
    'quelle', 'merci', 'bonjour', 'svp', 'stp', 'pour', 'dans', 'avec',
    'une', 'les', 'des', 'son', 'ses', 'mon', 'ma', 'mes', 'votre', 'leur',
    'mot', 'phrase', 'langue', 'langues', 'français', 'française', 'texte',
  ];

  return message
    .toLowerCase()
    .replace(/[?!.,;:«»"""'']/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));
}

// POST /api/agent-chat
const agentChat = async (req, res, next) => {
  try {
    const { message, langCode, agentName, agentGender } = req.body;

    if (!message?.trim() || !langCode) {
      return res.status(400).json({ error: 'Message et langue requis' });
    }

    // Trouver la langue
    const language = await prisma.language.findFirst({
      where: { OR: [{ id: langCode }, { code: langCode }] },
    });
    if (!language) return res.status(404).json({ error: 'Langue non trouvée' });

    const keywords = extractKeywords(message.trim());

    // ── Étape 1 : chercher dans les contributions audio ──
    for (const keyword of keywords) {
      const audioMatch = await prisma.audioContribution.findFirst({
        where: {
          languageId: language.id,
          isValidated: true,
          isActive: true,
          OR: [
            { mot: { contains: keyword, mode: 'insensitive' } },
            { traduction: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          { estVoixOfficielle: 'desc' },
          // Préférer le genre de l'agent demandeur
          ...(agentGender ? [{ genreVoix: 'asc' }] : []),
          { timesPlayed: 'asc' },
        ],
        select: {
          mot: true, traduction: true, audioUrl: true,
          transcription: true, estVoixOfficielle: true, genreVoix: true,
        },
      });

      if (audioMatch) {
        const traduction = audioMatch.traduction || '—';
        const phonetique = audioMatch.transcription ? ` [${audioMatch.transcription}]` : '';
        return res.json({
          source: 'database',
          response: `En ${language.nom}, "${traduction}" se dit "${audioMatch.mot}"${phonetique}.`,
          mot: audioMatch.mot,
          traduction: audioMatch.traduction,
          audioUrl: audioMatch.audioUrl,
          transcription: audioMatch.transcription,
          estVoixOfficielle: audioMatch.estVoixOfficielle,
        });
      }
    }

    // ── Étape 2 : chercher dans le dictionnaire ──
    for (const keyword of keywords) {
      const dictMatch = await prisma.dictionaryEntry.findFirst({
        where: {
          languageId: language.id,
          status: 'PUBLISHED',
          OR: [
            { mot: { contains: keyword, mode: 'insensitive' } },
            { traduction: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        select: {
          mot: true, traduction: true, audioUrl: true, transcription: true,
        },
      });

      if (dictMatch) {
        const traduction = dictMatch.traduction || '—';
        const phonetique = dictMatch.transcription ? ` [${dictMatch.transcription}]` : '';
        return res.json({
          source: 'dictionary',
          response: `En ${language.nom}, "${traduction}" se dit "${dictMatch.mot}"${phonetique}.`,
          mot: dictMatch.mot,
          traduction: dictMatch.traduction,
          audioUrl: dictMatch.audioUrl,
          transcription: dictMatch.transcription,
          estVoixOfficielle: false,
        });
      }
    }

    // ── Étape 3 : Claude API (fallback IA) ──
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        source: 'unavailable',
        response: `Je ne trouve pas encore ce mot dans ma base de données ${language.nom}. Revenez bientôt — la base s'enrichit chaque jour !`,
        mot: null, audioUrl: null,
      });
    }

    const systemPrompt = `Tu es ${agentName || 'un agent IA'}, tuteur spécialisé en langues ivoiriennes de Côte d'Ivoire.
Tu aides les apprenants à traduire et comprendre la langue ${language.nom}.
Règles importantes :
- Réponds en 1 à 2 phrases maximum (ta réponse sera lue à voix haute par un agent vocal).
- Si tu n'es pas certain de la traduction, commence par "Je pense que…" ou "Je ne suis pas sûr, mais…".
- Réponds uniquement en français sauf si on te demande de parler en ${language.nom}.
- Ne réponds qu'aux questions liées aux langues et à la culture de Côte d'Ivoire.
- Si la question n'a rien à voir avec la langue ou la culture ivoirienne, dis poliment que tu ne peux pas aider sur ce sujet.`;

    const aiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 180,
      system: systemPrompt,
      messages: [{ role: 'user', content: message.trim() }],
    });

    const responseText = aiResponse.content[0]?.text || 'Je n\'ai pas pu répondre à cette question.';

    return res.json({
      source: 'ai',
      response: responseText,
      mot: null,
      audioUrl: null,
      transcription: null,
      estVoixOfficielle: false,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { agentChat };

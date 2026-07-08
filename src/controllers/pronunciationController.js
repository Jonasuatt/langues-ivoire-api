/**
 * Évaluation de la prononciation — Phase 6
 *
 * Pipeline :
 *   1. Reçoit l'audio (multipart/form-data)
 *   2. Transcrit via Whisper API (OpenAI)  → texte dit par l'utilisateur
 *   3. Compare avec le mot cible via distance phonétique (Levenshtein normalisé)
 *   4. Si score < 70 % → Claude génère un feedback précis
 *   5. Retourne { transcript, score, stars, feedback, tips }
 *
 * Fallback (si pas de OPENAI_API_KEY) :
 *   → score fixe à 0, feedback générique, app peut quand même fonctionner
 */

const fs   = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// ─── Levenshtein normalisé ─────────────────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function phoneticScore(pronounced, target) {
  const a = pronounced.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round((1 - dist / maxLen) * 100);
}

function scoreToStars(score) {
  if (score >= 85) return 3;
  if (score >= 60) return 2;
  if (score >= 35) return 1;
  return 0;
}

// ─── Transcription Whisper ─────────────────────────────────────────────────
async function transcribeWithWhisper(filePath, language = 'fr') {
  if (!process.env.OPENAI_API_KEY) return null;

  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const audioStream = fs.createReadStream(filePath);
  const resp = await openai.audio.transcriptions.create({
    file: audioStream,
    model: 'whisper-1',
    language,        // 'fr' pour les mots en langues ivoiriennes translittérées
    response_format: 'text',
    temperature: 0,
  });
  return typeof resp === 'string' ? resp.trim() : resp?.text?.trim() ?? null;
}

// ─── Feedback Claude ───────────────────────────────────────────────────────
async function generateFeedback(targetWord, phonetique, pronounced, langName) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Tu es un professeur de prononciation pour la langue ${langName}.
Le mot à prononcer est "${targetWord}" (phonétique : ${phonetique || targetWord}).
L'apprenant a dit : "${pronounced}".
Donne en 2 phrases maximum : 1 encouragement bref + 1 conseil concret sur la différence phonétique.
Réponds directement en français, sans introduction. Ton français doit être impeccable
(grammaire et accords parfaits) et ne modifie jamais l'orthographe du mot "${targetWord}".`,
    }],
  });
  return msg.content[0]?.text?.trim() ?? null;
}

// ─── Feedback phonétique sans transcription (mode sans Whisper) ───────────
async function generatePhoneticTips(targetWord, phonetique, langName) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 250,
      messages: [{
        role: 'user',
        content: `Tu es un professeur de prononciation pour la langue ${langName}.
Le mot à prononcer est "${targetWord}"${phonetique ? ` (phonétique : ${phonetique})` : ''}.
Donne 2 conseils concrets et courts pour bien prononcer ce mot en ${langName}.
Commence par un encouragement. Réponds en français, sans introduction. Ton français doit
être impeccable (grammaire et accords parfaits) et ne modifie jamais l'orthographe du mot "${targetWord}".`,
      }],
    });
    return msg.content[0]?.text?.trim() ?? null;
  } catch (e) {
    console.error('[Pronunciation] Claude tips error:', e.message);
    return null;
  }
}

// ─── Score de participation (sans Whisper) ────────────────────────────────
function participationScore(fileSizeBytes, durationHint) {
  // Si l'audio a un contenu réel (> 5 Ko), l'utilisateur a bien parlé
  if (!fileSizeBytes || fileSizeBytes < 2000) return 45; // audio vide
  if (fileSizeBytes < 10000) return 55;  // très court
  if (fileSizeBytes < 30000) return 65;  // court (~3s)
  return 72;                              // bonne durée
}

// ─── Contrôleur principal ──────────────────────────────────────────────────
const evaluate = async (req, res, next) => {
  const filePath = req.file?.path;

  try {
    const { targetWord, phonetique, languageName = 'cette langue' } = req.body;

    if (!targetWord) {
      return res.status(400).json({ error: 'targetWord requis' });
    }

    // 1. Essai Whisper si clé disponible
    let transcript = null;
    if (filePath && process.env.OPENAI_API_KEY) {
      try {
        transcript = await transcribeWithWhisper(filePath, 'fr');
      } catch (e) {
        console.error('[Pronunciation] Whisper error:', e.message);
      }
    }

    let score, stars, feedback;

    if (transcript) {
      // ── Mode Whisper : score basé sur la comparaison ──
      score = phoneticScore(transcript, phonetique || targetWord);
      stars = scoreToStars(score);

      if (score < 70 && process.env.ANTHROPIC_API_KEY) {
        try {
          feedback = await generateFeedback(targetWord, phonetique, transcript, languageName);
        } catch (e) {
          console.error('[Pronunciation] Claude feedback error:', e.message);
        }
      }

      const defaultMessages = {
        3: '🌟 Excellent ! Votre prononciation est parfaite !',
        2: '👍 Bien ! Quelques petits ajustements et ce sera parfait.',
        1: '💪 Continue à pratiquer, tu y es presque !',
        0: '🎯 Essaie encore — écoute bien la phonétique ci-dessous.',
      };
      feedback = feedback ?? defaultMessages[stars];

    } else {
      // ── Mode sans Whisper : score de participation ──
      const fileSize = req.file?.size ?? 0;
      score = participationScore(fileSize);
      stars = scoreToStars(score);

      // Vérifier que l'audio n'est pas vide
      if (fileSize < 2000) {
        return res.json({
          transcript: null,
          score: 0,
          stars: 0,
          feedback: '⚠️ Aucune voix détectée — parlez plus fort et plus près du micro.',
          whisperAvailable: false,
          mode: 'participation',
        });
      }

      // Générer des conseils phonétiques via Claude
      const tips = await generatePhoneticTips(targetWord, phonetique, languageName);
      feedback = tips ??
        `👏 Bravo ! Vous avez prononcé "${targetWord}". ` +
        (phonetique ? `Entraînez-vous sur la phonétique : ${phonetique}` : 'Continuez à pratiquer !');
    }

    res.json({
      transcript,
      score,
      stars,
      feedback,
      whisperAvailable: !!process.env.OPENAI_API_KEY,
      mode: transcript ? 'whisper' : 'participation',
    });

  } catch (err) {
    next(err);
  } finally {
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
};

// ─── Traducteur IA (Phase 6.3) ─────────────────────────────────────────────
const translate = async (req, res, next) => {
  try {
    const { text, fromLang, toLang, languageCode } = req.body;

    if (!text || !fromLang || !toLang) {
      return res.status(400).json({ error: 'text, fromLang, toLang requis' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré' });
    }

    const client = new Anthropic();

    const isToLocal = toLang !== 'fr';
    const localLang = isToLocal ? toLang : fromLang;

    const prompt = isToLocal
      ? `Traduis ce texte du français vers le ${localLang} (langue ivoirienne).
Donne uniquement :
1. La traduction en ${localLang}
2. La phonétique entre crochets
3. Une note culturelle courte (optionnel)

Format JSON : {"traduction": "...", "phonetique": "...", "note": "..."}
Texte : "${text}"`
      : `Traduis ce texte du ${localLang} (langue ivoirienne) vers le français.
Donne uniquement :
1. La traduction en français
2. Une explication du sens littéral si différent

Format JSON : {"traduction": "...", "sens_litteral": "..."}
Texte : "${text}"`;

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = msg.content[0]?.text?.trim() ?? '{}';

    // Extraction JSON robuste
    let result = {};
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { traduction: raw };
    } catch {
      result = { traduction: raw };
    }

    res.json({
      input: text,
      fromLang,
      toLang,
      ...result,
    });

  } catch (err) {
    next(err);
  }
};

// ─── Transcription simple (mode Perroquet) ────────────────────────────────
const transcribe = async (req, res, next) => {
  const filePath = req.file?.path;
  try {
    if (!filePath) return res.status(400).json({ error: 'Fichier audio requis' });

    let transcript = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        transcript = await transcribeWithWhisper(filePath, 'fr');
      } catch (e) {
        console.error('[Transcribe] Whisper error:', e.message);
      }
    }

    res.json({ transcript, whisperAvailable: !!process.env.OPENAI_API_KEY });
  } catch (err) {
    next(err);
  } finally {
    if (filePath) { try { fs.unlinkSync(filePath); } catch (_) {} }
  }
};

module.exports = { evaluate, translate, transcribe };

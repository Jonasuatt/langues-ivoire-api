/**
 * smsService.js — LANGUES IVOIRE
 * Couche d'abstraction pour l'envoi de SMS/WhatsApp OTP.
 *
 * Fournisseurs supportés :
 *   - Africa's Talking (SMS) → AFRICASTALKING_API_KEY + AFRICASTALKING_USERNAME
 *   - WhatsApp Cloud API Meta (futur) → WHATSAPP_PHONE_ID + WHATSAPP_API_TOKEN
 *   - Mode développement : OTP affiché dans les logs (aucune clé requise)
 *
 * Variable d'env SMS_PROVIDER : 'africastalking' | 'whatsapp' | 'dev' (défaut)
 */

const provider = process.env.SMS_PROVIDER || 'dev';

// ─── Africa's Talking ──────────────────────────────────────────────────────
let atSMS = null;

function getAfricasTalking() {
  if (atSMS) return atSMS;
  if (!process.env.AFRICASTALKING_API_KEY) {
    throw new Error('AFRICASTALKING_API_KEY manquant dans les variables d\'environnement');
  }
  const AfricasTalking = require('africastalking');
  const at = AfricasTalking({
    apiKey:   process.env.AFRICASTALKING_API_KEY,
    username: process.env.AFRICASTALKING_USERNAME || 'sandbox',
  });
  atSMS = at.SMS;
  return atSMS;
}

// ─── WhatsApp Cloud API (Meta) ─────────────────────────────────────────────
async function sendViaWhatsApp(telephone, message) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token   = process.env.WHATSAPP_API_TOKEN;

  if (!phoneId || !token) {
    throw new Error('WHATSAPP_PHONE_ID ou WHATSAPP_API_TOKEN manquant');
  }

  // Formater le numéro : supprimer le '+' pour l'API Meta
  const to = telephone.replace('+', '');

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`WhatsApp API error: ${err?.error?.message || response.statusText}`);
  }
}

// ─── Envoi principal ───────────────────────────────────────────────────────
/**
 * Envoie un OTP par SMS ou WhatsApp.
 * @param {string} telephone - Numéro au format E.164 (+225XXXXXXXXXX)
 * @param {string} code      - Code OTP à 6 chiffres
 * @returns {Promise<{ sent: boolean, devCode?: string }>}
 */
async function sendOTP(telephone, code) {
  const message =
    `🌍 LANGUES IVOIRE\n` +
    `Votre code de vérification : *${code}*\n` +
    `Valable 10 minutes. Ne le partagez jamais.`;

  // ── Mode développement ──────────────────────────────────────────────────
  if (provider === 'dev' || process.env.NODE_ENV === 'development') {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📱 OTP DEV pour ${telephone} : ${code}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    // En mode dev, on renvoie le code pour faciliter les tests (retirer en prod)
    return { sent: true, devCode: code };
  }

  // ── Africa's Talking ────────────────────────────────────────────────────
  if (provider === 'africastalking') {
    const sms = getAfricasTalking();
    await sms.send({
      to:      [telephone],
      message: `LANGUES IVOIRE\nCode: ${code}\nValable 10min.`,
      from:    process.env.AFRICASTALKING_SENDER_ID || undefined,
    });
    return { sent: true };
  }

  // ── WhatsApp Cloud API ──────────────────────────────────────────────────
  if (provider === 'whatsapp') {
    await sendViaWhatsApp(telephone, message);
    return { sent: true };
  }

  throw new Error(`Fournisseur SMS inconnu : ${provider}`);
}

module.exports = { sendOTP };

/**
 * whatsappController.js — Activation du numéro de téléphone par WhatsApp.
 *
 * Principe économique : chez Meta, une conversation ouverte PAR L'UTILISATEUR
 * relève du service et non de l'authentification facturée. On inverse donc le
 * sens habituel : la plateforme n'envoie pas de code, c'est l'utilisateur qui
 * écrit au numéro Business avec un code affiché dans l'application.
 *
 * Bénéfice secondaire, non négligeable : le numéro n'est pas déclaré puis
 * vérifié — il EST celui de l'expéditeur. Aucune usurpation possible, et
 * aucune faute de frappe.
 */
const prisma = require('../lib/prisma');
const { notifyUser } = require('../services/pushService');

const DUREE_VALIDITE_MIN = 30;
const ALPHABET = '23456789ACDEFGHJKLMNPQRSTUVWXYZ'; // ni O/0 ni I/1 : le code sera lu puis retapé

function genererCode() {
  let s = '';
  for (let i = 0; i < 4; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return 'LI-' + s;
}

/** POST /api/whatsapp/activation-code — prépare une activation pour l'utilisateur connecté. */
const creerCodeActivation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (req.user.phoneVerified) {
      return res.status(400).json({ error: 'Votre numéro est déjà activé.' });
    }

    // Un seul code actif à la fois : les précédents sont invalidés.
    await prisma.phoneActivation.deleteMany({ where: { userId, usedAt: null } });

    let code = genererCode();
    for (let essai = 0; essai < 5; essai++) {
      const existe = await prisma.phoneActivation.findUnique({ where: { code } });
      if (!existe) break;
      code = genererCode();
    }

    const activation = await prisma.phoneActivation.create({
      data: { code, userId, expiresAt: new Date(Date.now() + DUREE_VALIDITE_MIN * 60000) },
    });

    res.json({
      code: activation.code,
      expiresAt: activation.expiresAt,
      numeroWhatsApp: process.env.WHATSAPP_BUSINESS_NUMBER || '+2250798541864',
      message: 'Activation LANGUES IVOIRE — code ' + activation.code,
    });
  } catch (err) { next(err); }
};

/** GET /api/whatsapp/activation-status — l'application suit l'avancement. */
const statutActivation = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { phoneVerified: true, telephone: true },
    });
    const enAttente = await prisma.phoneActivation.findFirst({
      where: { userId: req.user.id, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      select: { code: true, expiresAt: true },
    });
    res.json({
      phoneVerified: user ? user.phoneVerified : false,
      telephone: user ? user.telephone : null,
      enAttente,
    });
  } catch (err) { next(err); }
};

/** GET /api/whatsapp/webhook — vérification d'abonnement exigée par Meta. */
const verifierWebhook = (req, res) => {
  const mode  = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const defi  = req.query['hub.challenge'];
  if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(defi);
  }
  res.sendStatus(403);
};

/** Réponse dans la fenêtre de service — gratuite, car l'utilisateur a écrit en premier. */
async function repondreWhatsApp(destinataire, texte) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token   = process.env.WHATSAPP_API_TOKEN;
  if (!phoneId || !token) return; // non configuré : le reste doit fonctionner quand même
  try {
    await fetch('https://graph.facebook.com/v19.0/' + phoneId + '/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: destinataire.replace('+', ''),
        type: 'text',
        text: { body: texte },
      }),
    });
  } catch (e) {
    console.error('[WhatsApp] réponse impossible :', e.message);
  }
}

/** POST /api/whatsapp/webhook — un message entrant arrive. */
const recevoirWebhook = async (req, res) => {
  // Meta réessaie tant qu'il n'a pas reçu 200 : on accuse réception tout de
  // suite et on traite ensuite, pour qu'une erreur métier ne provoque pas de rejeu.
  res.sendStatus(200);

  try {
    const entry = req.body && req.body.entry && req.body.entry[0];
    const valeur = entry && entry.changes && entry.changes[0] && entry.changes[0].value;
    const message = valeur && valeur.messages && valeur.messages[0];
    if (!message || message.type !== 'text') return;

    const expediteur = message.from; // format international, sans le +
    const texte = ((message.text && message.text.body) || '').toUpperCase();
    const trouve = texte.match(/LI-[23456789ACDEFGHJKLMNPQRSTUVWXYZ]{4}/);

    if (!trouve) {
      await repondreWhatsApp(expediteur,
        'Bonjour 👋🏾\nPour activer la connexion par téléphone, ouvrez LANGUES IVOIRE, ' +
        'touchez « Activer la connexion par téléphone » et envoyez le message proposé.');
      return;
    }

    const code = trouve[0];
    const activation = await prisma.phoneActivation.findUnique({ where: { code } });
    if (!activation || activation.usedAt || activation.expiresAt < new Date()) {
      await repondreWhatsApp(expediteur,
        "⏳ Ce code n'est plus valable. Rouvrez l'application pour en obtenir un nouveau.");
      return;
    }

    const telephone = '+' + expediteur;

    // Un même numéro ne peut pas servir deux comptes.
    const dejaPris = await prisma.user.findFirst({
      where: { telephone, NOT: { id: activation.userId } },
      select: { id: true },
    });
    if (dejaPris) {
      await repondreWhatsApp(expediteur,
        '⚠️ Ce numéro est déjà associé à un autre compte LANGUES IVOIRE. ' +
        "Contactez-nous si vous pensez qu'il s'agit d'une erreur.");
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: activation.userId },
        data:  { telephone, phoneVerified: true },
      }),
      prisma.phoneActivation.update({
        where: { id: activation.id },
        data:  { telephone, usedAt: new Date() },
      }),
    ]);

    await repondreWhatsApp(expediteur,
      '✅ Numéro activé !\nVous pouvez désormais vous connecter à LANGUES IVOIRE avec ' + telephone + '.');

    await notifyUser(activation.userId, {
      type:  'PHONE_VALIDATED',
      titre: '📱 Numéro de téléphone activé',
      corps: 'Votre numéro ' + telephone + ' est validé. Vous pouvez maintenant vous connecter avec votre numéro.',
      data:  { telephone },
    });
  } catch (err) {
    console.error('[WhatsApp] traitement du message :', err.message);
  }
};

module.exports = { creerCodeActivation, statutActivation, verifierWebhook, recevoirWebhook };

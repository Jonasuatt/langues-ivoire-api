// Envoi d'e-mails via l'API HTTP de Resend (aucune dépendance). Inactif tant que RESEND_API_KEY n'est pas défini.
//   RESEND_API_KEY  clé API Resend (à définir dans Railway)
//   MAIL_FROM       expéditeur, ex. « LANGUES IVOIRE <noreply@languesivoire.ci> » (domaine à vérifier chez Resend)
//                   par défaut : onboarding@resend.dev (bac à sable : n'envoie qu'à l'adresse du compte Resend)
//   ALERT_EMAIL_TO  destinataire(s) des alertes, séparés par des virgules (défaut : contact@languesivoire.ci)
const MAX_PAR_HEURE = 20; // garde-fou : jamais plus de 20 alertes par heure, même sous attaque
let fenetre = Date.now();
let envoyes = 0;

async function envoyerEmail({ to, subject, text }) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) { console.log('[email] RESEND_API_KEY absent : e-mail non envoyé'); return false; }
  if (Date.now() - fenetre > 3600 * 1000) { fenetre = Date.now(); envoyes = 0; }
  if (++envoyes > MAX_PAR_HEURE) { console.warn('[email] plafond horaire atteint : e-mail ignoré'); return false; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'LANGUES IVOIRE <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : String(to).split(',').map((s) => s.trim()).filter(Boolean),
      subject,
      text,
    }),
  });
  if (!r.ok) console.error('[email] échec', r.status, (await r.text().catch(() => '')).slice(0, 200));
  return r.ok;
}

// Alerte « nouvelle proposition » : ne lève jamais d'erreur (l'envoi du visiteur ne doit pas en dépendre).
async function alerterNouvelleProposition(s) {
  try {
    const to = process.env.ALERT_EMAIL_TO || 'contact@languesivoire.ci';
    const texte = s.texte.length > 600 ? `${s.texte.slice(0, 600)}…` : s.texte;
    await envoyerEmail({
      to,
      subject: 'Nouvelle proposition sur languesivoire.ci',
      text: [
        'Une nouvelle proposition vient d’arriver.', '',
        `De : ${s.nom || 'Anonyme'}${s.contact ? ` (${s.contact})` : ''}`,
        `Accord de publication : ${s.publiable ? 'oui' : 'non'}`, '',
        texte, '',
        'Répondre : https://languesivoire.ci/suggestions (menu Communauté → Propositions)',
      ].join('\n'),
    });
  } catch (e) { console.error('[email] alerte impossible :', e.message); }
}

module.exports = { envoyerEmail, alerterNouvelleProposition };

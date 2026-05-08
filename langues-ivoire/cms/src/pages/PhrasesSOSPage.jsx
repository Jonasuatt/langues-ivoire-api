/**
 * PhrasesSOSPage — Gestion des phrases d'urgence (catégorie "urgence")
 *
 * Ces phrases alimentent l'écran "S.O.S. LANGUES" du mobile.
 * Elles remplacent les 10 phrases intégrées en dur si elles existent dans l'API.
 * Format attendu par le mobile : { phrase (langue locale), traduction (fr), contexte (emoji) }
 */
import { useEffect, useState } from 'react';
import { phrasesAdminAPI, languagesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  ExclamationTriangleIcon, PlusIcon, PencilIcon, TrashIcon,
  SpeakerWaveIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Langues utilisées par le mobile pour les phrases SOS
const MOBILE_LANGS = ['dioula', 'baoule', 'bete', 'senoufo', 'agni', 'gouro', 'guere', 'nouchi'];
const LANG_FLAGS = { dioula: '🌍', baoule: '🌿', bete: '🌺', senoufo: '🌾', agni: '👑', gouro: '🎨', guere: '🌳', nouchi: '🌆' };
const PHRASES_HARDCODED = 10; // Nombre de phrases intégrées en dur dans le mobile par langue

// Emojis suggérés pour les phrases d'urgence
const EMOJI_SUGGESTIONS = ['🆘', '🤕', '🏥', '👨‍⚕️', '🚨', '💧', '⚠️', '🗺️', '👨‍👩‍👧', '💊', '🔥', '🚑'];

const EMPTY_FORM = { languageId: '', phrase: '', transcription: '', traduction: '', contexte: '🆘', audioUrl: '', status: 'PUBLISHED' };

export default function PhrasesSOSPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const [phrases, setPhrases] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterLang, setFilterLang] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { languagesAPI.getAll().then(({ data }) => setLanguages(data)).catch(() => {}); }, []);

  const load = () => {
    setLoading(true);
    const params = { limit: 200, categorie: 'urgence' };
    if (filterLang) params.languageId = filterLang;
    phrasesAdminAPI.getAll(params)
      .then(({ data }) => { setPhrases(data.data || []); setTotal(data.total || 0); })
      .catch(() => toast.error('Erreur de chargement', { id: 'sos-load' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterLang]);

  // Compte des phrases par code de langue (via language.code)
  const countByCode = {};
  phrases.forEach(p => {
    const code = p.language?.code;
    if (code) countByCode[code] = (countByCode[code] || 0) + 1;
  });

  const openAdd = (langId) => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, languageId: langId || '' });
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditItem(p);
    setForm({ languageId: p.languageId || '', phrase: p.phrase || '', transcription: p.transcription || '',
      traduction: p.traduction || '', contexte: p.contexte || '🆘', audioUrl: p.audioUrl || '', status: p.status || 'PUBLISHED' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.languageId || !form.phrase || !form.traduction) { toast.error('Langue, phrase et traduction sont requis'); return; }
    setSaving(true);
    const payload = { languageId: form.languageId, phrase: form.phrase.trim(),
      transcription: form.transcription.trim() || null, traduction: form.traduction.trim(),
      categorie: 'urgence', contexte: form.contexte || '🆘',
      audioUrl: form.audioUrl.trim() || null, status: form.status };
    try {
      if (editItem) { await phrasesAdminAPI.update(editItem.id, payload); toast.success('Phrase SOS mise à jour'); }
      else { await phrasesAdminAPI.create(payload); toast.success('Phrase SOS ajoutée'); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Supprimer "${p.phrase}" ?`)) return;
    try { await phrasesAdminAPI.delete(p.id); toast.success('Phrase supprimée'); load(); }
    catch (err) { toast.error(err.response?.data?.error || 'Erreur'); }
  };

  const langsByCode = {};
  languages.forEach(l => { langsByCode[l.code] = l; });

  // Phrases filtrées pour l'affichage (par langue si filtre actif)
  const filtered = filterLang
    ? phrases.filter(p => p.languageId === filterLang)
    : phrases;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-7 h-7 text-red-500" />
            Phrases SOS
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Phrases d'urgence pour l'écran "S.O.S. Langues" du mobile · catégorie <code className="bg-red-50 text-red-600 px-1 rounded text-xs">urgence</code>
          </p>
        </div>
        <button onClick={() => openAdd('')} className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700">
          <PlusIcon className="w-4 h-4" /> Ajouter une phrase SOS
        </button>
      </div>

      {/* Encart explicatif */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">
          <strong>Comment ça fonctionne :</strong> Le mobile contient <strong>10 phrases intégrées</strong> par langue en dur.
          Si vous ajoutez des phrases ici (categorie = urgence), elles <strong>remplaceront</strong> les phrases intégrées pour cette langue.
          Le champ <em>contexte</em> correspond à l'emoji affiché devant chaque phrase (ex: 🆘, 🤕, 🏥).
        </div>
      </div>

      {/* Indicateur par langue mobile */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {MOBILE_LANGS.map(code => {
          const lang = langsByCode[code];
          const count = countByCode[code] || 0;
          const hasOverride = count > 0;
          return (
            <div key={code}
              className={`card py-3 px-4 cursor-pointer hover:shadow-md transition-shadow border-2 ${
                hasOverride ? 'border-green-200' : 'border-dashed border-gray-200'
              }`}
              onClick={() => {
                if (lang) setFilterLang(filterLang === lang.id ? '' : lang.id);
              }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{LANG_FLAGS[code]}</span>
                {hasOverride
                  ? <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  : <XCircleIcon className="w-4 h-4 text-gray-300" />
                }
              </div>
              <p className="text-sm font-bold text-gray-900">{lang?.nom || code}</p>
              {hasOverride ? (
                <p className="text-xs text-green-600">{count} phrase{count > 1 ? 's' : ''} API ✓</p>
              ) : (
                <p className="text-xs text-gray-400">{PHRASES_HARDCODED} intégrées</p>
              )}
              {lang && (
                <button
                  className="mt-2 w-full text-xs text-red-600 hover:underline text-left"
                  onClick={e => { e.stopPropagation(); openAdd(lang.id); }}>
                  + Ajouter
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card py-3 px-5"><p className="text-2xl font-bold text-red-600">{total}</p><p className="text-sm text-gray-500">Phrases SOS dans l'API</p></div>
        <div className="card py-3 px-5"><p className="text-2xl font-bold text-green-600">{Object.keys(countByCode).length}</p><p className="text-sm text-gray-500">Langues avec override API</p></div>
        <div className="card py-3 px-5"><p className="text-2xl font-bold text-gray-400">{MOBILE_LANGS.length - Object.keys(countByCode).length}</p><p className="text-sm text-gray-500">Langues sur fallback intégré</p></div>
      </div>

      {/* Filtre langue */}
      {filterLang && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Filtré par :</span>
          <span className="badge bg-red-100 text-red-700">{languages.find(l => l.id === filterLang)?.nom}</span>
          <button onClick={() => setFilterLang('')} className="text-xs text-gray-400 hover:text-gray-600">✕ Effacer</button>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-2 animate-pulse">{[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 border-2 border-dashed border-red-200">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune phrase SOS dans l'API</p>
          <p className="text-sm text-gray-400 mt-1">Le mobile utilise les {PHRASES_HARDCODED} phrases intégrées par langue</p>
          <button onClick={() => openAdd('')} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
            <PlusIcon className="w-4 h-4" /> Ajouter la première phrase SOS
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50 border-b border-red-100">
                <tr>{['Emoji', 'Phrase (locale)', 'Traduction (FR)', 'Langue', 'Audio', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-red-700 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-4 py-3 text-2xl">{p.contexte || '🆘'}</td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-bold text-gray-900">{p.traduction}</p>
                      <p className="text-sm text-red-600 italic">{p.phrase}</p>
                      {p.transcription && <p className="text-xs text-gray-400">{p.transcription}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px]"><span className="line-clamp-2">{p.traduction}</span></td>
                    <td className="px-4 py-3 text-xs"><span className="badge bg-red-50 text-red-700">{p.language?.nom || '—'}</span></td>
                    <td className="px-4 py-3">
                      {p.audioUrl
                        ? <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"><PencilIcon className="w-4 h-4" /></button>
                        {isAdmin && <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><TrashIcon className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{editItem ? 'Modifier la phrase SOS' : 'Nouvelle phrase SOS'}</h2>
            <p className="text-xs text-gray-500 mb-5">Catégorie fixée à <code className="bg-red-50 text-red-600 px-1 rounded">urgence</code></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue *</label>
                <select className="input" value={form.languageId} onChange={e => setForm({ ...form, languageId: e.target.value })}>
                  <option value="">-- Sélectionner --</option>
                  {languages.map(l => <option key={l.id} value={l.id}>{LANG_FLAGS[l.code] || ''} {l.nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Traduction française *</label>
                <input className="input" value={form.traduction} onChange={e => setForm({ ...form, traduction: e.target.value })} placeholder="ex: Aidez-moi ! Au secours !" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phrase en langue locale *</label>
                <input className="input" value={form.phrase} onChange={e => setForm({ ...form, phrase: e.target.value })} placeholder="ex: A dɛmɛ n'na ! Bɔ n'ma !" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transcription phonétique (optionnel)</label>
                <input className="input" value={form.transcription} onChange={e => setForm({ ...form, transcription: e.target.value })} placeholder="ex: a-de-mè-na" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji (contexte) *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EMOJI_SUGGESTIONS.map(e => (
                    <button key={e} type="button"
                      onClick={() => setForm({ ...form, contexte: e })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                        form.contexte === e ? 'bg-red-100 ring-2 ring-red-500' : 'bg-gray-50 hover:bg-gray-100'
                      }`}>{e}</button>
                  ))}
                </div>
                <input className="input" value={form.contexte} onChange={e => setForm({ ...form, contexte: e.target.value })} placeholder="🆘 ou emoji personnalisé" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio (optionnel)</label>
                <input className="input" value={form.audioUrl} onChange={e => setForm({ ...form, audioUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 justify-center flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {saving ? 'Sauvegarde...' : editItem ? 'Mettre à jour' : 'Ajouter la phrase SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

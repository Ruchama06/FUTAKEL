import { useEffect, useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Caisse() {
  const [caisse, setCaisse] = useState<any>(null);
  const [afficherForm, setAfficherForm] = useState(false);
  const [form, setForm] = useState({ description: '', categorie: '', montantTotal: 0 });
  const [erreur, setErreur] = useState('');

  async function charger() {
    try {
      const { data } = await apiClient.get('/caisse');
      setCaisse(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { charger(); }, []);

  async function ajouterDepense(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await apiClient.post('/depenses', form);
      setForm({ description: '', categorie: '', montantTotal: 0 });
      setAfficherForm(false);
      charger();
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur');
    }
  }

  if (!caisse) return <p className="text-texte-secondaire">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-texte">Caisse</h1>
          <p className="text-texte-secondaire mt-1">Solde et mouvements de Saint Basile</p>
        </div>
        <button onClick={() => setAfficherForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nouvelle dépense
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-texte-secondaire mb-2">Solde actuel</p>
          <p className="text-3xl font-bold text-vert">{Number(caisse.soldeCourant).toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="card">
          <p className="text-sm text-texte-secondaire mb-2">Total entrées</p>
          <p className="text-2xl font-bold text-vert">{Number(caisse.totalEntrees).toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="card">
          <p className="text-sm text-texte-secondaire mb-2">Total sorties</p>
          <p className="text-2xl font-bold text-burgundy">{Number(caisse.totalSorties).toLocaleString('fr-FR')} FCFA</p>
        </div>
      </div>

      {/* Mouvements */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Derniers mouvements</h2>
        {caisse.mouvements.length === 0 ? (
          <p className="text-texte-secondaire text-sm text-center py-8">Aucun mouvement pour l'instant</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark text-left text-sm text-texte-secondaire">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {caisse.mouvements.map((m: any) => (
                <tr key={m.id} className="border-b border-beige-dark last:border-0">
                  <td className="py-3 px-2 text-sm">{new Date(m.dateMouvement).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-2">
                    {m.typeMouvement === 'ENTREE' 
                      ? <span className="flex items-center gap-1 text-vert text-sm"><ArrowDownCircle size={14}/> Entrée</span>
                      : <span className="flex items-center gap-1 text-burgundy text-sm"><ArrowUpCircle size={14}/> Sortie</span>}
                  </td>
                  <td className="py-3 px-2 text-sm">{m.description}</td>
                  <td className={`py-3 px-2 text-right font-mono ${m.typeMouvement === 'ENTREE' ? 'text-vert' : 'text-burgundy'}`}>
                    {m.typeMouvement === 'ENTREE' ? '+' : '−'} {Number(m.montant).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dépense */}
      {afficherForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-beige-dark flex justify-between items-center">
              <h2 className="text-xl font-bold">Nouvelle dépense</h2>
              <button onClick={() => setAfficherForm(false)} className="text-texte-secondaire hover:text-texte">✕</button>
            </div>
            <form onSubmit={ajouterDepense} className="p-6 space-y-4">
              <div>
                <label className="label-field">Description *</label>
                <input required value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" placeholder="Achat de craies" />
              </div>
              <div>
                <label className="label-field">Catégorie</label>
                <input value={form.categorie} onChange={(e) => setForm({...form, categorie: e.target.value})} className="input-field" placeholder="Fournitures, salaires…" />
              </div>
              <div>
                <label className="label-field">Montant (FCFA) *</label>
                <input type="number" required min="1" value={form.montantTotal || ''} onChange={(e) => setForm({...form, montantTotal: Number(e.target.value)})} className="input-field" />
              </div>
              {erreur && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{erreur}</div>}
              <button type="submit" className="btn-primary w-full">Enregistrer la dépense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Annees() {
  const [annees, setAnnees] = useState<any[]>([]);
  const [afficherForm, setAfficherForm] = useState(false);
  const [form, setForm] = useState({ libelle: '', dateDebut: '', dateFin: '' });
  const [erreur, setErreur] = useState('');

  async function charger() {
    try {
      const { data } = await apiClient.get('/annees');
      setAnnees(data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { charger(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await apiClient.post('/annees', form);
      setForm({ libelle: '', dateDebut: '', dateFin: '' });
      setAfficherForm(false);
      charger();
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-texte">Années scolaires</h1>
          <p className="text-texte-secondaire mt-1">Gérez les périodes scolaires de l'établissement</p>
        </div>
        <button onClick={() => setAfficherForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nouvelle année
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {annees.map((a) => (
          <div key={a.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-texte">{a.libelle}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.statut === 'ACTIVE' ? 'bg-vert/10 text-vert' : 'bg-texte-secondaire/10 text-texte-secondaire'}`}>
                  {a.statut}
                </span>
              </div>
              <Calendar className="text-burgundy" size={24} />
            </div>
            <p className="text-sm text-texte-secondaire">Du {new Date(a.dateDebut).toLocaleDateString('fr-FR')} au {new Date(a.dateFin).toLocaleDateString('fr-FR')}</p>
          </div>
        ))}
      </div>

      {afficherForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-beige-dark flex justify-between items-center">
              <h2 className="text-xl font-bold">Nouvelle année scolaire</h2>
              <button onClick={() => setAfficherForm(false)} className="text-texte-secondaire hover:text-texte">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label-field">Libellé (ex: 2026-2027) *</label>
                <input required value={form.libelle} onChange={(e) => setForm({...form, libelle: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="label-field">Date de début *</label>
                <input type="date" required value={form.dateDebut} onChange={(e) => setForm({...form, dateDebut: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="label-field">Date de fin *</label>
                <input type="date" required value={form.dateFin} onChange={(e) => setForm({...form, dateFin: e.target.value})} className="input-field" />
              </div>
              {erreur && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{erreur}</div>}
              <button type="submit" className="btn-primary w-full">Créer l'année</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
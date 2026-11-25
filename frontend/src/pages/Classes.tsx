import { useEffect, useState } from 'react';
import { Plus, Users, BookOpen } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Classes() {
  const [classes, setClasses] = useState<any[]>([]);
  const [annees, setAnnees] = useState<any[]>([]);
  const [afficherForm, setAfficherForm] = useState(false);
  const [form, setForm] = useState({
    nom: '', niveau: '', idAnnee: '', capaciteMax: '', nombreMatieres: '', professeurPrincipal: '', description: ''
  });
  const [erreur, setErreur] = useState('');

  async function charger() {
    try {
      const [classesRes, anneesRes] = await Promise.all([
        apiClient.get('/classes'),
        apiClient.get('/annees')
      ]);
      setClasses(classesRes.data);
      setAnnees(anneesRes.data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { charger(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await apiClient.post('/classes', form);
      setForm({ nom: '', niveau: '', idAnnee: '', capaciteMax: '', nombreMatieres: '', professeurPrincipal: '', description: '' });
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
          <h1 className="text-3xl font-bold text-texte">Classes</h1>
          <p className="text-texte-secondaire mt-1">Gérez les salles de classe par année</p>
        </div>
        <button onClick={() => setAfficherForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nouvelle classe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div key={c.id} className="card hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-texte">{c.nom}</h3>
                <p className="text-sm text-texte-secondaire">{c.niveau || '—'} · {c.annee?.libelle}</p>
              </div>
              <span className="bg-beige text-burgundy text-xs font-bold px-2 py-1 rounded">
                {c.niveau || '—'}
              </span>
            </div>
            <div className="space-y-1 text-sm text-texte-secondaire mb-4">
              <p><strong>Capacité :</strong> {c.capaciteMax ? `${c.capaciteMax} élèves` : 'Non définie'}</p>
              <p><strong>Prof. principal :</strong> {c.professeurPrincipal || '—'}</p>
              {c.nombreMatieres && <p><strong>Matières :</strong> {c.nombreMatieres}</p>}
            </div>
            <div className="flex items-center gap-2 text-sm text-burgundy font-medium pt-4 border-t border-beige-dark">
              <Users size={16} />
              <span>{c._count?.eleves || 0} élève(s) inscrit(s)</span>
            </div>
          </div>
        ))}
      </div>

      {afficherForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-beige-dark flex justify-between items-center">
              <h2 className="text-xl font-bold">Nouvelle classe</h2>
              <button onClick={() => setAfficherForm(false)} className="text-texte-secondaire hover:text-texte">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nom de la classe *</label>
                  <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="input-field" placeholder="6e A" />
                </div>
                <div>
                  <label className="label-field">Année scolaire *</label>
                  <select required value={form.idAnnee} onChange={(e) => setForm({...form, idAnnee: e.target.value})} className="input-field">
                    <option value="">— Choisir —</option>
                    {annees.map((a) => <option key={a.id} value={a.id}>{a.libelle}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Niveau</label>
                  <select value={form.niveau} onChange={(e) => setForm({...form, niveau: e.target.value})} className="input-field">
                    <option value="">— Choisir —</option>
                    <option value="6e">6e</option>
                    <option value="5e">5e</option>
                    <option value="4e">4e</option>
                    <option value="3e">3e</option>
                    <option value="CP">CP</option>
                    <option value="CE1">CE1</option>
                    <option value="CE2">CE2</option>
                    <option value="CM1">CM1</option>
                    <option value="CM2">CM2</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Capacité maximale</label>
                  <input type="number" min="1" value={form.capaciteMax} onChange={(e) => setForm({...form, capaciteMax: e.target.value})} className="input-field" placeholder="Ex: 40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Professeur principal</label>
                  <input value={form.professeurPrincipal} onChange={(e) => setForm({...form, professeurPrincipal: e.target.value})} className="input-field" placeholder="Nom du professeur" />
                </div>
                <div>
                  <label className="label-field">Nombre de matières (optionnel)</label>
                  <input type="number" min="1" value={form.nombreMatieres} onChange={(e) => setForm({...form, nombreMatieres: e.target.value})} className="input-field" placeholder="Ex: 8" />
                </div>
              </div>

              <div>
                <label className="label-field">Description</label>
                <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" placeholder="Optionnel" />
              </div>

              {erreur && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{erreur}</div>}
              <button type="submit" className="btn-primary w-full">Créer la classe</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
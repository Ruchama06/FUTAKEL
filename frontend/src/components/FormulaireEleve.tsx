import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../api/client';
import type { Classe } from '../types';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormulaireEleve({ onClose, onSuccess }: Props) {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', matricule: '', dateNaissance: '', sexe: '', adresse: '', idClasse: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    apiClient.get<Classe[]>('/classes').then((r) => setClasses(r.data)).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await apiClient.post('/eleves', {
        ...form,
        idClasse: form.idClasse || null,
      });
      onSuccess();
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-beige-dark">
          <h2 className="text-xl font-bold text-texte">Nouvel élève</h2>
          <button onClick={onClose} className="text-texte-secondaire hover:text-texte"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Nom *</label>
              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="input-field" />
            </div>
            <div><label className="label-field">Prénom *</label>
              <input required value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Matricule *</label>
              <input required value={form.matricule} onChange={(e) => setForm({...form, matricule: e.target.value})} placeholder="SB-2025-002" className="input-field" />
            </div>
            <div><label className="label-field">Date de naissance</label>
              <input type="date" value={form.dateNaissance} onChange={(e) => setForm({...form, dateNaissance: e.target.value})} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Sexe</label>
              <select value={form.sexe} onChange={(e) => setForm({...form, sexe: e.target.value})} className="input-field">
                <option value="">—</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div><label className="label-field">Classe</label>
              <select value={form.idClasse} onChange={(e) => setForm({...form, idClasse: e.target.value})} className="input-field">
                <option value="">— Aucune —</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
          </div>

          <div><label className="label-field">Adresse</label>
            <input value={form.adresse} onChange={(e) => setForm({...form, adresse: e.target.value})} className="input-field" />
          </div>

          {erreur && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{erreur}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t border-beige-dark">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-beige-dark text-texte hover:bg-beige transition">Annuler</button>
            <button type="submit" disabled={chargement} className="btn-primary">{chargement ? 'Création…' : 'Créer l\'élève'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import { getEleves } from '../api/eleves';
import type { Eleve } from '../types';
import FormulaireEleve from '../components/FormulaireEleve';

export default function Eleves() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [recherche, setRecherche] = useState('');
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(true);

  async function charger() {
    setChargement(true);
    try {
      const data = await getEleves();
      setEleves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => { charger(); }, []);

  const filtres = eleves.filter((e) => {
    const q = recherche.toLowerCase();
    return e.nom.toLowerCase().includes(q) || e.prenom.toLowerCase().includes(q) || e.matricule.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-texte">Élèves</h1>
          <p className="text-texte-secondaire mt-1">{eleves.length} élève{eleves.length > 1 ? 's' : ''} inscrit{eleves.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setAfficherFormulaire(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nouvel élève
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-texte-secondaire" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou matricule…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {chargement ? (
        <p className="text-texte-secondaire">Chargement…</p>
      ) : filtres.length === 0 ? (
        <div className="card text-center py-12">
          <User size={48} className="mx-auto text-texte-secondaire mb-4" />
          <p className="text-texte-secondaire">Aucun élève trouvé</p>
        </div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark text-left text-sm text-texte-secondaire">
                <th className="py-3 px-2">Matricule</th>
                <th className="py-3 px-2">Nom complet</th>
                <th className="py-3 px-2">Classe</th>
                <th className="py-3 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtres.map((e) => (
                <tr key={e.id} className="border-b border-beige-dark last:border-0 hover:bg-beige/50">
                  <td className="py-3 px-2 font-mono text-sm">{e.matricule}</td>
                  <td className="py-3 px-2 font-medium">{e.prenom} {e.nom}</td>
                  <td className="py-3 px-2 text-sm">{e.classe?.nom || '—'}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${e.statut === 'ACTIF' ? 'bg-vert/10 text-vert' : 'bg-texte-secondaire/10 text-texte-secondaire'}`}>
                      {e.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {afficherFormulaire && (
        <FormulaireEleve
          onClose={() => setAfficherFormulaire(false)}
          onSuccess={() => { setAfficherFormulaire(false); charger(); }}
        />
      )}
    </div>
  );
}
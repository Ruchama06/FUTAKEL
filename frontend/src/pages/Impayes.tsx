import { useEffect, useState } from 'react';
import { AlertCircle, Download } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Impayes() {
  const [impayes, setImpayes] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    apiClient.get('/eleves/impayes')
      .then((r) => setImpayes(r.data))
      .catch(console.error)
      .finally(() => setChargement(false));
  }, []);

  const totalImpaye = impayes.reduce((s, e) => s + e.reste, 0);

  if (chargement) return <p className="text-texte-secondaire">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-texte">Impayés</h1>
          <p className="text-texte-secondaire mt-1">Élèves avec un solde restant dû</p>
        </div>
      </div>

      <div className="card mb-8 bg-burgundy text-white border-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total des impayés</p>
            <p className="text-3xl font-bold mt-2">{totalImpaye.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <AlertCircle size={48} className="opacity-30" />
        </div>
      </div>

      <div className="card">
        {impayes.length === 0 ? (
          <p className="text-center text-texte-secondaire py-8">Tous les élèves sont à jour ! 🎉</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark text-left text-sm text-texte-secondaire">
                <th className="py-3 px-2">Matricule</th>
                <th className="py-3 px-2">Élève</th>
                <th className="py-3 px-2">Classe</th>
                <th className="py-3 px-2 text-right">Total dû</th>
                <th className="py-3 px-2 text-right">Payé</th>
                <th className="py-3 px-2 text-right text-burgundy">Reste</th>
              </tr>
            </thead>
            <tbody>
              {impayes.map((e) => (
                <tr key={e.id} className="border-b border-beige-dark last:border-0">
                  <td className="py-3 px-2 font-mono text-sm">{e.matricule}</td>
                  <td className="py-3 px-2 font-medium">{e.prenom} {e.nom}</td>
                  <td className="py-3 px-2 text-sm">{e.classe}</td>
                  <td className="py-3 px-2 text-right font-mono text-sm">{e.totalDu.toLocaleString('fr-FR')}</td>
                  <td className="py-3 px-2 text-right font-mono text-sm text-vert">{e.totalPaye.toLocaleString('fr-FR')}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-burgundy">{e.reste.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
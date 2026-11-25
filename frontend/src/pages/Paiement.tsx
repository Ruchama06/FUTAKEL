import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { getEleves } from '../api/eleves';
import { apiClient } from '../api/client';
import type { Eleve } from '../types';

export default function Paiement() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [idEleve, setIdEleve] = useState('');
  const [fraisEleve, setFraisEleve] = useState<any>(null);
  const [montant, setMontant] = useState<number>(0);
  const [modePaiement, setModePaiement] = useState('ESPECES');
  const [recu, setRecu] = useState<any>(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => { getEleves().then(setEleves).catch(() => {}); }, []);

  useEffect(() => {
    if (!idEleve) { setFraisEleve(null); return; }
    const e = eleves.find((x) => x.id === idEleve);
    const fe = (e as any)?.fraisEleves?.[0];
    if (fe) {
      const totalPaye = (fe.affectations || []).reduce((s: number, a: any) => s + Number(a.montantAffecte), 0);
      const reste = Number(fe.montantNet) - totalPaye;
      setFraisEleve({ ...fe, reste });
      setMontant(reste);
    } else {
      setFraisEleve(null);
    }
  }, [idEleve, eleves]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const { data } = await apiClient.post('/paiements', {
        idEleve, idFraisEleve: fraisEleve.id, montant, modePaiement,
      });
      setRecu({ ...data, eleve: eleves.find((x) => x.id === idEleve) });
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Erreur');
    } finally {
      setChargement(false);
    }
  }

  if (recu) {
    return (
      <div className="max-w-2xl mx-auto py-8 print:py-0">
        {/* La classe print:shadow-none enlève l'ombre à l'impression */}
        <div className="bg-white border-2 border-burgundy rounded-xl p-8 print:border-none print:shadow-none">
          
          {/* En-tête du reçu */}
          <div className="text-center border-b-2 border-beige-dark pb-6 mb-6">
            <h1 className="text-3xl font-bold text-burgundy uppercase tracking-wider">Saint Basile</h1>
            <p className="text-sm text-texte-secondaire mt-2">Établissement scolaire</p>
            <p className="text-sm text-texte-secondaire">Ouagadougou, Burkina Faso</p>
          </div>

          {/* Titre */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-texte">REÇU DE PAIEMENT</h2>
            <p className="text-burgundy font-mono mt-1">N° {recu.recu.numeroRecu}</p>
          </div>

          {/* Détails */}
          <div className="space-y-3 mb-8 text-sm">
            <div className="flex justify-between border-b border-beige-dark pb-2">
              <span className="text-texte-secondaire">Date d'émission</span>
              <span className="font-medium">{new Date(recu.paiement.datePaiement).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between border-b border-beige-dark pb-2">
              <span className="text-texte-secondaire">Élève</span>
              <span className="font-medium">{recu.eleve.prenom} {recu.eleve.nom}</span>
            </div>
            <div className="flex justify-between border-b border-beige-dark pb-2">
              <span className="text-texte-secondaire">Matricule</span>
              <span className="font-medium">{recu.eleve.matricule}</span>
            </div>
            <div className="flex justify-between border-b border-beige-dark pb-2">
              <span className="text-texte-secondaire">Mode de paiement</span>
              <span className="font-medium">{recu.paiement.modePaiement}</span>
            </div>
            <div className="flex justify-between border-b border-beige-dark pb-2">
              <span className="text-texte-secondaire">Référence transaction</span>
              <span className="font-mono text-xs">{recu.paiement.reference}</span>
            </div>
          </div>

          {/* Montant total */}
          <div className="bg-beige rounded-lg p-4 flex justify-between items-center mb-8">
            <span className="font-bold text-texte">Montant total</span>
            <span className="text-2xl font-bold text-burgundy">
              {Number(recu.paiement.montant).toLocaleString('fr-FR')} FCFA
            </span>
          </div>

                   {/* Signature (uniquement gestionnaire) */}
          <div className="flex justify-center mb-8 text-sm">
            <div className="text-center">
              <p className="text-texte-secondaire mb-12">Le Gestionnaire</p>
              <div className="border-t border-texte-secondaire pt-2 px-12">
                Signature et cachet
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-texte-secondaire italic">
            Ce reçu est généré par FUTAKEL. Conservez-le précieusement.
          </p>
        </div>

        {/* Boutons (cachés à l'impression) */}
        <div className="flex gap-3 justify-center mt-6 print:hidden">
          <button onClick={() => window.print()} className="btn-primary">Imprimer le reçu</button>
          <button onClick={() => { setRecu(null); setIdEleve(''); setMontant(0); }} className="px-6 py-2 rounded-lg border border-beige-dark hover:bg-beige">Nouveau paiement</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-texte">Encaisser un paiement</h1>
        <p className="text-texte-secondaire mt-1">Enregistrer un paiement pour un élève</p>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Élève</label>
              <select required value={idEleve} onChange={(e) => setIdEleve(e.target.value)} className="input-field">
                <option value="">— Choisir —</option>
                {eleves.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom} ({e.matricule})</option>)}
              </select>
            </div>

            {fraisEleve && (
              <div className="bg-beige rounded-lg p-4">
                <p className="text-sm text-texte-secondaire">Frais : <strong>{fraisEleve.frais?.libelle || 'Scolarité'}</strong></p>
                <p className="text-sm text-texte-secondaire">Reste dû : <strong className="text-burgundy">{fraisEleve.reste.toLocaleString('fr-FR')} FCFA</strong></p>
              </div>
            )}

            <div>
              <label className="label-field">Montant (FCFA)</label>
              <input type="number" required min="1" value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="input-field" />
            </div>

            <div>
              <label className="label-field">Mode de paiement</label>
              <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)} className="input-field">
                <option value="ESPECES">Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="VIREMENT">Virement</option>
                <option value="CHEQUE">Chèque</option>
              </select>
            </div>

            {erreur && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{erreur}</div>}

            <button type="submit" disabled={chargement || !fraisEleve} className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard size={18} /> {chargement ? 'Enregistrement…' : 'Encaisser'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Wallet, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { getCaisse } from '../api/caisse';
import { getEleves } from '../api/eleves';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { utilisateur } = useAuth();
  const [soldeCaisse, setSoldeCaisse] = useState<number>(0);
  const [nbEleves, setNbEleves] = useState<number>(0);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      try {
        const [caisse, eleves] = await Promise.all([
          getCaisse().catch(() => ({ soldeCourant: 0 } as any)),
          getEleves().catch(() => []),
        ]);
        setSoldeCaisse(caisse.soldeCourant || 0);
        setNbEleves(eleves.length);
      } catch (err) {
        console.error(err);
      } finally {
        setChargement(false);
      }
    }
    charger();
  }, []);

  const kpis = [
    {
      label: 'Solde de caisse',
      value: `${soldeCaisse.toLocaleString('fr-FR')} FCFA`,
      icon: Wallet,
      couleur: 'text-vert',
    },
    {
      label: 'Élèves inscrits',
      value: nbEleves.toString(),
      icon: Users,
      couleur: 'text-burgundy',
    },
    {
      label: 'Impayés',
      value: '—',
      icon: AlertCircle,
      couleur: 'text-burgundy',
    },
    {
      label: 'Encaissements du mois',
      value: '0 FCFA',
      icon: TrendingUp,
      couleur: 'text-vert',
    },
  ];

  if (chargement) {
    return <p className="text-texte-secondaire">Chargement...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-texte">Tableau de bord</h1>
        <p className="text-texte-secondaire mt-1">
          Bonjour {utilisateur?.prenom}, voici un aperçu de Saint Basile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="card">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm text-texte-secondaire">{kpi.label}</span>
                <Icon size={22} className={kpi.couleur} />
              </div>
              <p className="text-2xl font-bold text-texte">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Évolution de la caisse</h2>
          <p className="text-texte-secondaire text-sm">Graphique à venir (étape 10)</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Derniers paiements</h2>
          <p className="text-texte-secondaire text-sm">Liste à venir (étape 10)</p>
        </div>
      </div>
    </div>
  );
}
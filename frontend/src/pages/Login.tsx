import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('gloire@saintbasile.bf');
  const [motDePasse, setMotDePasse] = useState('demo1234');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await login(email, motDePasse);
      navigate('/dashboard');
    } catch (err: any) {
      setErreur(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-burgundy mb-2">Saint Basile</h1>
          <p className="text-texte-secondaire">FUTAKEL — Gestion financière scolaire</p>
        </div>

        {/* Carte formulaire */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-texte mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-texte-secondaire" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="vous@ecole.bf"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-field">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-texte-secondaire" size={18} />
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {erreur}
              </div>
            )}

            <button type="submit" disabled={chargement} className="btn-primary w-full flex items-center justify-center gap-2">
              <LogIn size={18} />
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-texte-secondaire">
            Comptes démo : <br />
            <strong>gloire@saintbasile.bf</strong> / demo1234 (Gestionnaire)<br />
            <strong>olivier@saintbasile.bf</strong> / demo1234 (Responsable)
          </p>
        </div>
      </div>
    </div>
  );
}
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Wallet, AlertCircle, LogOut, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { utilisateur, logout } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/annees', label: 'Années', icon: Calendar },
    { to: '/eleves', label: 'Élèves', icon: Users },
    { to: '/paiement', label: 'Encaisser', icon: CreditCard },
    { to: '/caisse', label: 'Caisse', icon: Wallet },
    { to: '/impayes', label: 'Impayés', icon: AlertCircle },
    { to: '/classes', label: 'Classes', icon: BookOpen },
    
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
   <aside className="w-64 min-h-screen bg-burgundy text-white flex flex-col print:hidden">
      <div className="p-6 border-b border-burgundy-dark">
        <h1 className="text-2xl font-bold">Saint Basile</h1>
        <p className="text-sm text-white/70 mt-1">FUTAKEL</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const actif = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                actif ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bas : utilisateur + déconnexion */}
      <div className="p-4 border-t border-burgundy-dark">
        <div className="mb-3 text-sm">
          <p className="font-semibold">{utilisateur?.prenom} {utilisateur?.nom}</p>
          <p className="text-white/70 text-xs">{utilisateur?.rolePlateforme}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
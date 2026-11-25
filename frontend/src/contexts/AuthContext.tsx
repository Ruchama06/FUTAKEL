import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Utilisateur } from '../types';
import { login as apiLogin, logout as apiLogout, getToken, getUtilisateur } from '../api/auth';

interface AuthContextType {
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  // Au démarrage, récupère l'utilisateur depuis localStorage
  useEffect(() => {
    const token = getToken();
    const user = getUtilisateur();
    if (token && user) {
      setUtilisateur(user);
    }
    setChargement(false);
  }, []);

  async function login(email: string, motDePasse: string) {
    const response = await apiLogin(email, motDePasse);
    localStorage.setItem('futakel_token', response.token);
    localStorage.setItem('futakel_user', JSON.stringify(response.utilisateur));
    setUtilisateur(response.utilisateur);
  }

  function logout() {
    apiLogout();
    setUtilisateur(null);
  }

  if (chargement) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        isAuthenticated: !!utilisateur,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
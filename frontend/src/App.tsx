import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Eleves from './pages/Eleves';
import Paiement from './pages/Paiement';
import Caisse from './pages/Caisse';
import Impayes from './pages/Impayes';
import Classes from './pages/Classes';
import Annees from './pages/Annees';

function RouteProtegee({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Pages placeholder pour les étapes suivantes
function Placeholder({ nom }: { nom: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-texte mb-2">{nom}</h1>
      <p className="text-texte-secondaire">Cette page sera construite à l'étape suivante.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RouteProtegee>
                <Layout />
              </RouteProtegee>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="eleves" element={<Eleves />} />
            <Route path="annees" element={<Annees />} />
            <Route path="paiement" element={<Paiement/>} />
            <Route path="caisse" element={<Caisse />} />
            <Route path="impayes" element={<Impayes />} />
            <Route path="classes" element={<Classes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
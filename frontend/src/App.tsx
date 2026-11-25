import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

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
            <Route path="eleves" element={<Placeholder nom="Élèves" />} />
            <Route path="paiement" element={<Placeholder nom="Encaisser un paiement" />} />
            <Route path="caisse" element={<Placeholder nom="Caisse" />} />
            <Route path="impayes" element={<Placeholder nom="Impayés" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
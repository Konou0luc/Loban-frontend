import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Bloque l’app tant que le transporteur n’a pas complété la fiche (photo + infos). */
export function RequireTransporterProfile() {
  const { user } = useAuth();

  if (user?.role === 'TRANSPORTER' && user.transporterProfileComplete === false) {
    return <Navigate to="/onboarding/transporter" replace />;
  }

  return <Outlet />;
}

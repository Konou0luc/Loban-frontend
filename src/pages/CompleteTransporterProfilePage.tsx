import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { TransporterProfileSection } from '../components/TransporterProfileSection';
import { useAuth } from '../context/AuthContext';

const ease = [0.32, 0.72, 0, 1] as const;

export function CompleteTransporterProfilePage() {
  const { user } = useAuth();

  if (!user) return null;
  if (user.role !== 'TRANSPORTER') {
    return <Navigate to="/dashboard" replace />;
  }
  if (user.transporterProfileComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Activation du compte</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Complétez votre profil transporteur
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Une fiche complète rassure les expéditeurs : présentation, véhicule, zones desservies et disponibilité. Sans cette
          étape, les demandes ouvertes et les offres restent inaccessibles.
        </p>
      </motion.div>

      <TransporterProfileSection variant="onboarding" />
    </div>
  );
}

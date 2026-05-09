import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordInput } from '../components/PasswordInput';

const ease = [0.32, 0.72, 0, 1] as const;

const field =
  'w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-zinc-400 focus:border-emerald-500/55 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-white/[0.1] dark:bg-black/40 dark:text-white dark:placeholder:text-zinc-600 dark:focus:bg-black/50';

export function RegisterPage() {
  const { register, user, error, clearError } = useAuth();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'TRANSPORTER'>('CLIENT');
  const [pending, setPending] = useState(false);

  if (user) {
    if (user.role === 'TRANSPORTER' && user.transporterProfileComplete === false) {
      return <Navigate to="/onboarding/transporter" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setPending(true);
    try {
      await register({ fullname, email, password, role });
      toast.success('Compte créé avec succès', {
        description: 'Bienvenue sur Loban. Vous pouvez commencer tout de suite.',
      });
    } finally {
      setPending(false);
    }
  }

  const roleIdle =
    'border-zinc-200/90 bg-zinc-100/90 text-zinc-700 hover:border-zinc-300 dark:border-white/[0.1] dark:bg-black/35 dark:text-zinc-400 dark:hover:border-white/20';
  const roleActive =
    'border-emerald-500/60 bg-emerald-500/12 text-emerald-900 shadow-sm dark:border-emerald-500/45 dark:bg-emerald-500/15 dark:text-white';

  return (
    <AuthSplitLayout
      imageSrc="/landing/auth-register.jpg"
      imageAlt="Poids lourds sur route : convois et transport de marchandises."
      kicker="Rejoindre le réseau"
      title="Créez votre profil et entrez dans les corridors où les prix se comparent."
      description="Indiquez si vous expédiez ou si vous transportez — l’essentiel est d’avoir des offres lisibles pour tout le monde."
    >
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, ease }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500">
          Inscription
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Créer un compte Loban
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
          Quelques champs, puis vous accédez à l’espace connecté.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Vous êtes</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('CLIENT')}
                className={`rounded-2xl border py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                  role === 'CLIENT' ? roleActive : roleIdle
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('TRANSPORTER')}
                className={`rounded-2xl border py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                  role === 'TRANSPORTER' ? roleActive : roleIdle
                }`}
              >
                Transporteur
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="fullname" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Nom complet
            </label>
            <input
              id="fullname"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className={field}
              placeholder="Prénom Nom"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="vous@entreprise.com"
              autoComplete="email"
            />
          </div>
          <PasswordInput
            id="password"
            label="Mot de passe (min. 8 caractères)"
            value={password}
            onChange={setPassword}
            inputClassName={field}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(5,150,105,0.22)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98] dark:shadow-[0_12px_40px_rgba(5,150,105,0.15)]"
          >
            {pending ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-500">
          Déjà inscrit ?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-600 underline-offset-4 hover:text-emerald-500 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Connexion
          </Link>
        </p>
      </motion.div>
    </AuthSplitLayout>
  );
}

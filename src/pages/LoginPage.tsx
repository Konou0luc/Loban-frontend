import { motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { AuthSplitLayout } from '../components/auth/AuthSplitLayout';
import { PasswordInput } from '../components/PasswordInput';

const ease = [0.32, 0.72, 0, 1] as const;

const field =
  'w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-zinc-400 focus:border-emerald-500/55 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-white/[0.1] dark:bg-black/40 dark:text-white dark:placeholder:text-zinc-600 dark:focus:bg-black/50';

export function LoginPage() {
  const { login, user, error, clearError } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  if (user) {
    const dest =
      user.role === 'TRANSPORTER' && user.transporterProfileComplete === false
        ? '/onboarding/transporter'
        : from;
    return <Navigate to={dest} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setPending(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie', { description: 'Redirection vers votre espace…' });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthSplitLayout
      imageSrc="/landing/hero-side.jpg"
      imageAlt="Entrepôt : préparation de commandes et flux marchandises."
      kicker="Espace professionnel"
      title="Retrouvez vos livraisons et vos offres au même endroit."
      description="Clients et transporteurs : une connexion, des rôles distincts, la même exigence de clarté sur chaque trajet."
    >
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, ease }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500">
          Connexion
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Retour sur Loban
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
          Accédez à votre espace client ou transporteur.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="vous@entreprise.com"
            />
          </div>
          <PasswordInput
            id="password"
            label="Mot de passe"
            value={password}
            onChange={setPassword}
            inputClassName={field}
            required
            autoComplete="current-password"
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
            {pending ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-500">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="font-medium text-emerald-600 underline-offset-4 hover:text-emerald-500 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            S&apos;inscrire
          </Link>
        </p>
      </motion.div>
    </AuthSplitLayout>
  );
}

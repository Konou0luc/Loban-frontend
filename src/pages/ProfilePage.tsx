import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { SpeakerHigh } from '@phosphor-icons/react';
import { api, problemDetailMessage } from '../api/client';
import { TransporterProfileSection } from '../components/TransporterProfileSection';
import { useAuth } from '../context/AuthContext';
import {
  getNotificationRingDurationSec,
  NOTIFICATION_RING_DEFAULT_SEC,
  NOTIFICATION_RING_MAX_SEC,
  NOTIFICATION_RING_MIN_SEC,
  playNotificationRing,
  setNotificationRingDurationSec,
} from '../lib/notificationSound';

const ease = [0.32, 0.72, 0, 1] as const;

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullname, setFullname] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ringDurationSec, setRingDurationSec] = useState(() => getNotificationRingDurationSec());

  useEffect(() => {
    if (user) setFullname(user.fullname);
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await api.patch('/api/users/me', { fullname });
      await refreshUser();
      setSaved(true);
    } catch (err) {
      setError(problemDetailMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Profil</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-white">
          Paramètres
        </h1>
      </motion.div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2 xl:items-start">
        <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-8 shadow-sm dark:border-white/[0.06] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Nom affiché</label>
                <input
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                />
              </div>
              <div className="space-y-1 text-sm text-zinc-500">
                <p>E-mail : {user.email}</p>
                <p>Rôle : {user.role === 'CLIENT' ? 'Client' : 'Transporteur'}</p>
              </div>
              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
              {saved && <p className="text-sm text-emerald-400">Modifications enregistrées.</p>}
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {busy ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-8 shadow-sm dark:border-white/[0.06] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-start gap-3">
              <SpeakerHigh weight="light" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
              <div className="min-w-0 flex-1 space-y-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                    Sonnerie des notifications
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Durée du signal lorsqu&apos;une nouvelle notification arrive (ce navigateur uniquement). Entre{' '}
                    {NOTIFICATION_RING_MIN_SEC}&nbsp;s et {NOTIFICATION_RING_MAX_SEC}&nbsp;s — défaut&nbsp;{' '}
                    {NOTIFICATION_RING_DEFAULT_SEC}&nbsp;s.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="ring-duration" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Durée de la sonnerie
                    </label>
                    <span className="tabular-nums text-sm font-semibold text-zinc-900 dark:text-white">
                      {ringDurationSec}&nbsp;s
                    </span>
                  </div>
                  <input
                    id="ring-duration"
                    type="range"
                    min={NOTIFICATION_RING_MIN_SEC}
                    max={NOTIFICATION_RING_MAX_SEC}
                    step={1}
                    value={ringDurationSec}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setRingDurationSec(v);
                      setNotificationRingDurationSec(v);
                    }}
                    className="h-2 w-full cursor-pointer accent-emerald-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => playNotificationRing(ringDurationSec)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/12 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                >
                  Tester la sonnerie
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user.role === 'TRANSPORTER' && <TransporterProfileSection variant="profile" />}
    </div>
  );
}

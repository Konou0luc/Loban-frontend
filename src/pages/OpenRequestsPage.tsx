import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from '@phosphor-icons/react';
import axios from 'axios';
import { api, problemDetailMessage } from '../api/client';
import { formatDesiredSlotRange } from '../lib/formatDesiredSlot';
import { BACKGROUND_LIST_POLL_MS } from '../lib/polling';
import type { TransportRequest } from '../types/api';

const ease = [0.32, 0.72, 0, 1] as const;

export function OpenRequestsPage() {
  const [rows, setRows] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(initial: boolean) {
      if (initial) setLoading(true);
      try {
        const { data } = await api.get<TransportRequest[]>('/api/requests/open');
        if (!cancelled) {
          setRows(data);
          setBlockedMsg(null);
        }
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          if (!cancelled) {
            setRows([]);
            setBlockedMsg(problemDetailMessage(e));
          }
        } else if (!cancelled && initial) {
          setRows([]);
        }
      } finally {
        if (!cancelled && initial) setLoading(false);
      }
    }

    void load(true);

    const interval = setInterval(() => {
      if (cancelled || document.visibilityState !== 'visible') return;
      void load(false);
    }, BACKGROUND_LIST_POLL_MS);

    const onVis = () => {
      if (!cancelled && document.visibilityState === 'visible') void load(false);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Marketplace
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Demandes ouvertes
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
          Envois en attente d&apos;offre — vous ne voyez que les demandes compatibles avec vos créneaux lorsque le client a
          précisé une fenêtre horaire. La liste se met à jour automatiquement.
        </p>
      </motion.div>

      <div className="mt-12 space-y-4">
        {blockedMsg && (
          <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            {blockedMsg}{' '}
            <Link to="/onboarding/transporter" className="font-medium underline underline-offset-2">
              Compléter mon profil
            </Link>
          </p>
        )}
        {loading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/[0.04]" />
          ))}
        {!loading && rows.length === 0 && !blockedMsg && (
          <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-zinc-500">
            Aucune demande ouverte pour le moment.
          </p>
        )}
        {!loading &&
          rows.length > 0 &&
          rows.map((r, idx) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.55, ease }}
              className="rounded-[1.5rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
            >
              <div className="rounded-[calc(1.5rem-0.35rem)] border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-white/[0.05] dark:bg-[#0a0a0a] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-300">
                      <MapPin weight="light" className="h-4 w-4 text-emerald-500/80" />
                      {r.pickupLocation}
                      <span className="text-zinc-500 dark:text-zinc-600">→</span>
                      {r.destination}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                      {r.parcelDescription}
                    </p>
                    {formatDesiredSlotRange(r.desiredSlotStart, r.desiredSlotEnd) ? (
                      <p className="mt-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[11px] leading-snug text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                        Fenêtre client : {formatDesiredSlotRange(r.desiredSlotStart, r.desiredSlotEnd)}
                      </p>
                    ) : null}
                    <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-600">
                      Client : {r.clientName}
                    </p>
                  </div>
                  <Link
                    to={`/requests/${r.id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-emerald-600/90 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 active:scale-[0.98] sm:self-center"
                  >
                    Détails / Offrir
                    <ArrowRight weight="light" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
      </div>
    </div>
  );
}

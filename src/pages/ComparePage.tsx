import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, problemDetailMessage } from '../api/client';
import { formatFcfa } from '../lib/currency';
import type { Offer } from '../types/api';

const ease = [0.32, 0.72, 0, 1] as const;

export function ComparePage() {
  const { id } = useParams<{ id: string }>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<Offer[]>(`/api/requests/${id}/compare`);
        if (!c) setOffers(data);
      } catch (e) {
        if (!c) setError(problemDetailMessage(e));
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <Link
          to={id ? `/requests/${id}` : '/dashboard'}
          className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Retour à la demande
        </Link>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Comparer les offres
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-500">
          Classement par prix croissant. Sélectionnez un transporteur depuis la fiche demande.
        </p>
      </motion.div>

      <div className="mt-12 space-y-4">
        {loading && (
          <div className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/[0.04]" />
        )}
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        {!loading && !error && offers.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-500">Aucune offre pour cette demande.</p>
        )}
        {offers.map((o, idx) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.55, ease }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white px-5 py-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-none"
          >
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                {o.transporterName}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Soumis le {new Date(o.createdAt).toLocaleString('fr-FR')}
              </p>
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl tabular-nums text-emerald-400">
              {formatFcfa(o.price)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

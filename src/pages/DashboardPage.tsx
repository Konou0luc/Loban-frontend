import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Package, Plus, Truck } from '@phosphor-icons/react';
import { api, problemDetailMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { datetimeLocalToIso } from '../lib/availabilityDatetime';
import { formatDesiredSlotRange } from '../lib/formatDesiredSlot';
import { BACKGROUND_LIST_POLL_MS } from '../lib/polling';
import type { TransportRequest } from '../types/api';

const ease = [0.32, 0.72, 0, 1] as const;

function statusLabel(s: string) {
  switch (s) {
    case 'PENDING':
      return 'En attente d’offres';
    case 'ACCEPTED':
      return 'Acceptée';
    case 'IN_PROGRESS':
      return 'En cours';
    case 'DELIVERED':
      return 'Livrée';
    default:
      return s;
  }
}

export function DashboardPage() {
  const { user } = useAuth();
  const [mine, setMine] = useState<TransportRequest[]>([]);
  const [deliveries, setDeliveries] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [parcel, setParcel] = useState('');
  const [desiredStartLocal, setDesiredStartLocal] = useState('');
  const [desiredEndLocal, setDesiredEndLocal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const role = user.role;
    let cancelled = false;

    async function loadLists(initial: boolean) {
      if (initial) setLoading(true);
      try {
        if (role === 'CLIENT') {
          const { data } = await api.get<TransportRequest[]>('/api/requests/mine');
          if (!cancelled) setMine(data);
        } else if (role === 'TRANSPORTER') {
          const { data } = await api.get<TransportRequest[]>('/api/requests/my-deliveries');
          if (!cancelled) setDeliveries(data);
        }
      } finally {
        if (!cancelled && initial) setLoading(false);
      }
    }

    void loadLists(true);
    const interval = setInterval(() => {
      if (cancelled || document.visibilityState !== 'visible') return;
      void loadLists(false);
    }, BACKGROUND_LIST_POLL_MS);
    const onVis = () => {
      if (!cancelled && document.visibilityState === 'visible') void loadLists(false);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [user]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!user || user.role !== 'CLIENT') return;
    setFormError(null);
    const hasStart = Boolean(desiredStartLocal.trim());
    const hasEnd = Boolean(desiredEndLocal.trim());
    if (hasStart !== hasEnd) {
      setFormError('Renseignez le début et la fin de la fenêtre souhaitée, ou laissez les deux vides.');
      return;
    }
    if (hasStart && hasEnd) {
      const s = datetimeLocalToIso(desiredStartLocal);
      const e = datetimeLocalToIso(desiredEndLocal);
      if (!s || !e || new Date(e) <= new Date(s)) {
        setFormError('La fenêtre souhaitée : vérifiez les dates (fin après début).');
        return;
      }
      const diffMs = new Date(e).getTime() - new Date(s).getTime();
      if (diffMs < 15 * 60 * 1000) {
        setFormError('La fenêtre doit durer au moins 15 minutes.');
        return;
      }
      if (diffMs > 14 * 24 * 60 * 60 * 1000) {
        setFormError('La fenêtre ne peut pas dépasser 14 jours.');
        return;
      }
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        pickupLocation: pickup,
        destination: destination,
        parcelDescription: parcel,
      };
      if (hasStart && hasEnd) {
        body.desiredSlotStart = datetimeLocalToIso(desiredStartLocal);
        body.desiredSlotEnd = datetimeLocalToIso(desiredEndLocal);
      }
      await api.post('/api/requests', body);
      setPickup('');
      setDestination('');
      setParcel('');
      setDesiredStartLocal('');
      setDesiredEndLocal('');
      const { data } = await api.get<TransportRequest[]>('/api/requests/mine');
      setMine(data);
      toast.success('Demande publiée', {
        description: hasStart
          ? 'Seuls les transporteurs disponibles sur cette fenêtre verront la demande.'
          : 'Les transporteurs peuvent maintenant vous faire une offre.',
      });
    } catch (err) {
      setFormError(problemDetailMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  const firstName = user.fullname?.trim().split(/\s+/)[0] ?? '';

  if (user.role === 'CLIENT') {
    return (
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.75, ease }}
          className="overflow-hidden rounded-[2rem] border border-zinc-200/90 bg-gradient-to-br from-white via-white to-emerald-50/40 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)] md:p-10 dark:border-white/[0.07] dark:from-[#101010] dark:via-[#0c0c0c] dark:to-emerald-950/20 dark:shadow-none"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400/90">
            Espace client
          </p>
          {firstName ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Bonjour, {firstName}</p>
          ) : null}
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
            Vos envois
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
            Créez une demande de transport et comparez les offres des transporteurs partenaires.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease }}
            className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <Plus weight="light" className="h-5 w-5 text-emerald-400" />
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                  Nouvelle demande
                </h2>
              </div>
              <form onSubmit={onCreate} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Prise en charge</label>
                  <input
                    required
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                    placeholder="Ville, zone, entrepôt…"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Destination</label>
                  <input
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Colis</label>
                  <textarea
                    required
                    rows={4}
                    value={parcel}
                    onChange={(e) => setParcel(e.target.value)}
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                    placeholder="Dimensions, poids, fragilité…"
                  />
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    Fenêtre souhaitée pour le transport (optionnel)
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                    Si vous la renseignez, seuls les transporteurs dont un créneau chevauche cette période verront la
                    demande dans « Demandes ouvertes ».
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="desired-start" className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                        Début souhaité
                      </label>
                      <input
                        id="desired-start"
                        type="datetime-local"
                        value={desiredStartLocal}
                        onChange={(e) => setDesiredStartLocal(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="desired-end" className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                        Fin souhaitée
                      </label>
                      <input
                        id="desired-end"
                        type="datetime-local"
                        value={desiredEndLocal}
                        onChange={(e) => setDesiredEndLocal(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                {formError && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
                >
                  Publier la demande
                  <ArrowRight weight="light" className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>

          <div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
              Mes demandes
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl bg-zinc-200/90 dark:bg-white/[0.06]"
                  />
                ))}
              </div>
            ) : mine.length === 0 ? (
              <div className="rounded-[2rem] border border-zinc-200/90 bg-white p-8 text-center shadow-sm dark:border-white/[0.06] dark:bg-[#0c0c0c]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                  <Package weight="light" className="h-7 w-7" />
                </div>
                <p className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                  Aucune demande pour le moment
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                  Utilisez le formulaire à gauche pour publier votre premier besoin de transport.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {mine.map((r, idx) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.55, ease }}
                  >
                    <Link
                      to={`/requests/${r.id}`}
                      className="group flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white px-5 py-4 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-emerald-500/35 hover:bg-emerald-50/80 dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:border-emerald-500/25 dark:hover:bg-emerald-500/[0.04]"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                          {r.pickupLocation} → {r.destination}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{r.parcelDescription}</p>
                        {formatDesiredSlotRange(r.desiredSlotStart, r.desiredSlotEnd) ? (
                          <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                            Fenêtre : {formatDesiredSlotRange(r.desiredSlotStart, r.desiredSlotEnd)}
                          </p>
                        ) : null}
                        <p className="mt-3 text-[11px] text-zinc-600">
                          {statusLabel(r.status)} · {r.offerCount} offre(s)
                        </p>
                      </div>
                      <Package
                        weight="light"
                        className="mt-1 h-6 w-6 shrink-0 text-zinc-600 transition-colors group-hover:text-emerald-400"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease }}
        className="overflow-hidden rounded-[2rem] border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50/80 to-emerald-50/35 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.05)] md:p-10 dark:border-white/[0.07] dark:from-[#101010] dark:via-[#0c0c0c] dark:to-emerald-950/25 dark:shadow-none"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0 max-w-2xl flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400/95">
              Espace transporteur
            </p>
            {firstName ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Bonjour, {firstName}</p>
            ) : null}
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
              Opérations
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
              Consultez les demandes ouvertes et suivez vos livraisons confirmées au même endroit.
            </p>
          </div>
          <Link
            to="/requests/open"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(5,150,105,0.22)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 active:scale-[0.98] dark:shadow-[0_12px_40px_rgba(5,150,105,0.12)]"
          >
            Parcourir les demandes
            <ArrowRight weight="light" className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <section className="mt-12 md:mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-zinc-900 dark:text-white">
              Mes livraisons
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-600">
              Livraisons où votre offre a été retenue ou qui vous sont assignées.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200/90 bg-white p-2 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-none">
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-100 bg-zinc-50/30 dark:border-white/[0.05] dark:bg-[#080808]">
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-200/90 dark:bg-white/[0.06]" />
                ))}
              </div>
            ) : deliveries.length === 0 ? (
              <div className="px-6 py-16 text-center sm:px-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                  <Truck weight="light" className="h-9 w-9" />
                </div>
                <h3 className="mt-8 font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                  Aucune livraison pour l’instant
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                  Répondez à une demande ouverte avec votre tarif : dès qu’un client retient votre offre, la livraison
                  apparaît ici.
                </p>
                <Link
                  to="/requests/open"
                  className="mt-10 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:border-emerald-500/35"
                >
                  Voir les demandes ouvertes
                  <ArrowRight weight="light" className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200/80 p-2 dark:divide-white/[0.06]">
                {deliveries.map((r) => (
                  <li key={r.id} className="p-2">
                    <Link
                      to={`/requests/${r.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-white dark:hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {r.pickupLocation}{' '}
                          <span className="font-normal text-zinc-400 dark:text-zinc-600">→</span>{' '}
                          {r.destination}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">{statusLabel(r.status)}</p>
                      </div>
                      <Truck weight="light" className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400/90" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

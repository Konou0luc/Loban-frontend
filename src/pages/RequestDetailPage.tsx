import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { api, problemDetailMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatFcfa } from '../lib/currency';
import { datetimeLocalToIso, isoToDatetimeLocal } from '../lib/availabilityDatetime';
import { formatDesiredSlotRange } from '../lib/formatDesiredSlot';
import {
  availabilityLabel,
  deliveryCategoryLabel,
  vehicleLabel,
} from '../lib/transporterProfileConstants';
import { StarRatingDisplay } from '../components/StarRatingDisplay';
import { Certificate, CheckCircle, PencilSimple, ShieldCheck } from '@phosphor-icons/react';
import type { Offer, RequestStatus, TransportRequest } from '../types/api';

const ease = [0.32, 0.72, 0, 1] as const;

function statusFr(s: RequestStatus) {
  switch (s) {
    case 'PENDING':
      return 'En attente d’offres';
    case 'ACCEPTED':
      return 'Acceptée';
    case 'IN_PROGRESS':
      return 'En cours de livraison';
    case 'DELIVERED':
      return 'Livrée';
    default:
      return s;
  }
}

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [req, setReq] = useState<TransportRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [price, setPrice] = useState('');
  const [offerBusy, setOfferBusy] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [rateBusy, setRateBusy] = useState(false);

  const [actionBusy, setActionBusy] = useState(false);

  const [editing, setEditing] = useState(false);
  const [ePickup, setEPickup] = useState('');
  const [eDest, setEDest] = useState('');
  const [eParcel, setEParcel] = useState('');
  const [eStartLocal, setEStartLocal] = useState('');
  const [eEndLocal, setEEndLocal] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  async function reload() {
    if (!id) return;
    const [r1, r2] = await Promise.all([
      api.get<TransportRequest>(`/api/requests/${id}`),
      api.get<Offer[]>(`/api/requests/${id}/offers`),
    ]);
    setReq(r1.data);
    setOffers(r2.data);
  }

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await reload();
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

  async function submitOffer(e: FormEvent) {
    e.preventDefault();
    if (!id || !user) return;
    setOfferBusy(true);
    setError(null);
    try {
      await api.post(`/api/requests/${id}/offers`, { price: Number(price) });
      setPrice('');
      await reload();
    } catch (e) {
      setError(problemDetailMessage(e));
    } finally {
      setOfferBusy(false);
    }
  }

  async function selectOffer(offerId: number) {
    if (!id) return;
    setActionBusy(true);
    setError(null);
    try {
      await api.post(`/api/requests/${id}/select-offer/${offerId}`);
      await reload();
    } catch (e) {
      setError(problemDetailMessage(e));
    } finally {
      setActionBusy(false);
    }
  }

  async function advance() {
    if (!id) return;
    setActionBusy(true);
    setError(null);
    try {
      await api.post(`/api/requests/${id}/advance-delivery`);
      await reload();
    } catch (e) {
      setError(problemDetailMessage(e));
    } finally {
      setActionBusy(false);
    }
  }

  async function submitRating(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setRateBusy(true);
    setError(null);
    try {
      await api.post(`/api/requests/${id}/ratings`, { rating, comment: comment || null });
      await reload();
      toast.success('Merci, votre avis a été enregistré.');
    } catch (e) {
      setError(problemDetailMessage(e));
    } finally {
      setRateBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-10 w-1/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-white/[0.06]" />
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/[0.04]" />
      </div>
    );
  }

  if (error && !req) {
    return (
      <p className="text-center text-sm text-red-300">
        {error}{' '}
        <Link to="/dashboard" className="text-emerald-400 underline">
          Retour
        </Link>
      </p>
    );
  }

  if (!req) return null;

  const isClient = user.role === 'CLIENT' && user.id === req.clientId;
  const isTp = user.role === 'TRANSPORTER';
  const canOffer = isTp && req.status === 'PENDING';
  const myOffer = offers[0];
  const isAssignedTransporter =
    isTp &&
    req.acceptedOfferId != null &&
    offers.some((o) => o.id === req.acceptedOfferId);
  const showAdvance =
    isAssignedTransporter &&
    (req.status === 'ACCEPTED' || req.status === 'IN_PROGRESS');

  const canEditAsClient = isClient && req.status === 'PENDING' && offers.length === 0;

  function startEdit() {
    if (!req) return;
    setEPickup(req.pickupLocation);
    setEDest(req.destination);
    setEParcel(req.parcelDescription);
    setEStartLocal(req.desiredSlotStart ? isoToDatetimeLocal(req.desiredSlotStart) : '');
    setEEndLocal(req.desiredSlotEnd ? isoToDatetimeLocal(req.desiredSlotEnd) : '');
    setEditError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditError(null);
  }

  async function submitEdit(e: FormEvent) {
    e.preventDefault();
    if (!id || !req || !user) return;
    setEditError(null);
    const hasStart = Boolean(eStartLocal.trim());
    const hasEnd = Boolean(eEndLocal.trim());
    if (hasStart !== hasEnd) {
      setEditError('Renseignez le début et la fin de la fenêtre souhaitée, ou laissez les deux vides.');
      return;
    }
    if (hasStart && hasEnd) {
      const s = datetimeLocalToIso(eStartLocal);
      const t = datetimeLocalToIso(eEndLocal);
      if (!s || !t || new Date(t) <= new Date(s)) {
        setEditError('Vérifiez la fenêtre horaire (fin après début).');
        return;
      }
      const diffMs = new Date(t).getTime() - new Date(s).getTime();
      if (diffMs < 15 * 60 * 1000) {
        setEditError('La fenêtre doit durer au moins 15 minutes.');
        return;
      }
      if (diffMs > 14 * 24 * 60 * 60 * 1000) {
        setEditError('La fenêtre ne peut pas dépasser 14 jours.');
        return;
      }
    }
    setEditBusy(true);
    try {
      const body: Record<string, unknown> = {
        pickupLocation: ePickup.trim(),
        destination: eDest.trim(),
        parcelDescription: eParcel.trim(),
      };
      if (hasStart && hasEnd) {
        body.desiredSlotStart = datetimeLocalToIso(eStartLocal);
        body.desiredSlotEnd = datetimeLocalToIso(eEndLocal);
      } else {
        body.desiredSlotStart = null;
        body.desiredSlotEnd = null;
      }
      await api.patch(`/api/requests/${id}`, body);
      await reload();
      setEditing(false);
      toast.success('Demande mise à jour');
    } catch (err) {
      setEditError(problemDetailMessage(err));
    } finally {
      setEditBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <Link
          to="/dashboard"
          className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Retour au tableau de bord
        </Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              {statusFr(req.status)}
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-zinc-900 md:text-3xl dark:text-white">
              {editing ? 'Modifier la demande' : `${req.pickupLocation} → ${req.destination}`}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canEditAsClient && !editing && (
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-emerald-500/40 dark:border-white/10 dark:text-zinc-300"
              >
                <PencilSimple weight="light" className="h-4 w-4" aria-hidden />
                Modifier
              </button>
            )}
            {isClient && req.status === 'PENDING' && offers.length > 0 && !editing && (
              <Link
                to={`/requests/${req.id}/compare`}
                className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 hover:border-emerald-500/40 dark:border-white/10 dark:text-zinc-300"
              >
                Comparer
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {editing ? (
        <form
          onSubmit={submitEdit}
          className="mt-10 rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
        >
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Prise en charge</label>
                <input
                  required
                  value={ePickup}
                  onChange={(e) => setEPickup(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Destination</label>
                <input
                  required
                  value={eDest}
                  onChange={(e) => setEDest(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Colis</label>
                <textarea
                  required
                  rows={4}
                  value={eParcel}
                  onChange={(e) => setEParcel(e.target.value)}
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                />
              </div>
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Fenêtre souhaitée (optionnel)</p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Vide = visible par tous les transporteurs ; sinon filtrage par créneaux.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-slot-start" className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                      Début
                    </label>
                    <input
                      id="edit-slot-start"
                      type="datetime-local"
                      value={eStartLocal}
                      onChange={(e) => setEStartLocal(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="edit-slot-end" className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                      Fin
                    </label>
                    <input
                      id="edit-slot-end"
                      type="datetime-local"
                      value={eEndLocal}
                      onChange={(e) => setEEndLocal(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              {editError ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                  {editError}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={editBusy}
                  className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-white/12 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editBusy}
                  className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {editBusy ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="mt-10 rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Colis</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {req.parcelDescription}
              </p>
            </div>
          </div>

          {formatDesiredSlotRange(req.desiredSlotStart, req.desiredSlotEnd) ? (
            <div className="mt-6 rounded-[2rem] border border-emerald-500/25 bg-emerald-500/[0.06] p-2 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
              <div className="rounded-[calc(2rem-0.5rem)] border border-emerald-500/20 bg-white/90 px-6 py-5 shadow-sm dark:border-emerald-500/15 dark:bg-[#0a120f]">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-300">
                  Fenêtre souhaitée (client)
                </h2>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                  {formatDesiredSlotRange(req.desiredSlotStart, req.desiredSlotEnd)}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Les transporteurs sans créneau qui chevauche cette période ne voient pas la demande dans la liste ouverte.
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}

      {isClient && req.assignedTransporter && (
        <div className="mt-10 rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Transporteur assigné</h2>
            {(() => {
              const t = req.assignedTransporter;
              return (
                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
                  {t.profilePhotoDataUrl ? (
                    <img
                      src={t.profilePhotoDataUrl}
                      alt=""
                      className="h-28 w-28 shrink-0 rounded-2xl border border-zinc-200 object-cover dark:border-white/10"
                    />
                  ) : (
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-500 dark:border-white/15 dark:bg-white/[0.04]">
                      Photo
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-zinc-900 dark:text-white">
                          {t.fullname}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {t.vehicleType ? (
                            <span className="rounded-full border border-zinc-200/90 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                              {vehicleLabel(t.vehicleType)}
                            </span>
                          ) : null}
                          {t.coverageArea ? (
                            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                              {t.coverageArea}
                            </span>
                          ) : null}
                          {t.yearsExperience != null && t.yearsExperience > 0 ? (
                            <span className="rounded-full border border-zinc-200/90 px-3 py-1 text-[11px] font-medium text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                              {t.yearsExperience} ans d&apos;expérience
                            </span>
                          ) : null}
                          {(!t.availabilitySlots || t.availabilitySlots.length === 0) && t.availability ? (
                            <span className="rounded-full border border-zinc-200/90 px-3 py-1 text-[11px] font-medium text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                              {availabilityLabel(t.availability)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 sm:items-start">
                        <StarRatingDisplay value={t.averageRating ?? 0} />
                        <p className="font-mono text-xs tabular-nums text-zinc-500">
                          {t.totalDeliveriesCompleted ?? 0} livraisons terminées
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 border-y border-zinc-100 py-3 dark:border-white/[0.06]">
                      <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle
                          weight={t.identityVerified ? 'fill' : 'light'}
                          className={`h-4 w-4 ${t.identityVerified ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                          aria-hidden
                        />
                        Identité vérifiée
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <Certificate
                          weight={t.licenseVerified ? 'fill' : 'light'}
                          className={`h-4 w-4 ${t.licenseVerified ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                          aria-hidden
                        />
                        Permis validé
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <ShieldCheck
                          weight={t.transporterConfirmed ? 'fill' : 'light'}
                          className={`h-4 w-4 ${t.transporterConfirmed ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                          aria-hidden
                        />
                        Transporteur confirmé
                      </span>
                    </div>

                    {t.deliveryCategories && t.deliveryCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {t.deliveryCategories.map((c) => (
                          <span
                            key={c}
                            className="rounded-lg border border-zinc-200/80 px-2.5 py-1 text-[11px] text-zinc-600 dark:border-white/10 dark:text-zinc-400"
                          >
                            {deliveryCategoryLabel(c)}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {t.availabilitySlots && t.availabilitySlots.length > 0 ? (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.08]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-200">
                          Disponibilités annoncées
                        </p>
                        <ul className="mt-3 space-y-2">
                          {t.availabilitySlots.map((slot) => (
                            <li
                              key={slot.id}
                              className="flex flex-wrap gap-x-2 text-sm text-zinc-800 dark:text-zinc-200"
                            >
                              <time dateTime={slot.startAt}>
                                {new Intl.DateTimeFormat('fr-FR', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }).format(new Date(slot.startAt))}
                              </time>
                              <span className="text-zinc-400">→</span>
                              <time dateTime={slot.endAt}>
                                {new Intl.DateTimeFormat('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: 'numeric',
                                  month: 'short',
                                }).format(new Date(slot.endAt))}
                              </time>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {t.transporterSecurityInfo ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {t.transporterSecurityInfo}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {isClient && req.status === 'PENDING' && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
            Offres reçues
          </h2>
          {offers.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-500">Aucune offre pour l’instant.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {offers.map((o, idx) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease }}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white px-4 py-3 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-none"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{o.transporterName}</p>
                    <p className="text-xs text-zinc-500">{formatFcfa(o.price)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={() => selectOffer(o.id)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98]"
                  >
                    Choisir
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      )}

      {canOffer && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
            Votre offre
          </h2>
          {myOffer ? (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Vous avez proposé {formatFcfa(myOffer.price)} — en attente du client.
            </p>
          ) : (
            <form onSubmit={submitOffer} className="mt-6 flex flex-wrap items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs text-zinc-600 dark:text-zinc-400">Prix (FCFA)</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={offerBusy}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      )}

      {showAdvance && (
        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4">
          <p className="text-sm text-zinc-800 dark:text-zinc-300">
            {req.status === 'ACCEPTED'
              ? 'Démarrez la livraison ou passez à l’étape suivante.'
              : 'Finalisez lorsque le colis est livré.'}
          </p>
          <button
            type="button"
            disabled={actionBusy}
            onClick={advance}
            className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
          >
            {req.status === 'ACCEPTED' ? 'Marquer en cours' : 'Marquer livré'}
          </button>
        </div>
      )}

      {isClient && req.status === 'DELIVERED' && !req.clientHasRated && (
        <div className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
            Noter le transporteur
          </h2>
          <form onSubmit={submitRating} className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-xs text-zinc-600 dark:text-zinc-400">Note</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="accent-emerald-500"
                />
                <span className="font-mono text-sm tabular-nums text-zinc-900 dark:text-white">{rating}/5</span>
              </div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Commentaire (optionnel)"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
              />
              <button
                type="submit"
                disabled={rateBusy}
                className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
              >
                Envoyer l’avis
              </button>
            </form>
        </div>
      )}
    </div>
  );
}

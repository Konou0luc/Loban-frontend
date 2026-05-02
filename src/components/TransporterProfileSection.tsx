import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Certificate,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Truck,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { api, problemDetailMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  DEFAULT_BIO_PLACEHOLDER,
  DELIVERY_CATEGORY_OPTIONS,
  VEHICLE_OPTIONS,
} from '../lib/transporterProfileConstants';
import type { AvailabilitySlot } from '../types/api';
import { StarRatingDisplay } from './StarRatingDisplay';
import { TransporterAvailabilityCalendar } from './TransporterAvailabilityCalendar';

const ease = [0.32, 0.72, 0, 1] as const;

const field =
  'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white';

type Props = {
  variant: 'profile' | 'onboarding';
};

export function TransporterProfileSection({ variant }: Props) {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tpPhoto, setTpPhoto] = useState('');
  const [bio, setBio] = useState('');
  const [vehicleType, setVehicleType] = useState<string>('VOITURE');
  const [coverageArea, setCoverageArea] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [license, setLicense] = useState('');
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'TRANSPORTER') return;
    setTpPhoto(user.profilePhotoDataUrl ?? '');
    setBio(user.transporterSecurityInfo ?? '');
    setVehicleType(user.vehicleType ?? 'VOITURE');
    setCoverageArea(user.coverageArea ?? '');
    setYearsExperience(user.yearsExperience ?? 0);
    setSlots(user.availabilitySlots ?? []);
    setLicense(user.drivingLicenseNumber ?? '');
    setCategories(new Set(user.deliveryCategories ?? []));
  }, [user]);

  function onTpFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setErr('Choisissez une image.');
      return;
    }
    if (f.size > 1.8 * 1024 * 1024) {
      setErr('Image trop volumineuse (max. ~1,8 Mo).');
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      setTpPhoto(r.result as string);
      setErr(null);
    };
    r.readAsDataURL(f);
  }

  function toggleCategory(key: string) {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || user.role !== 'TRANSPORTER') return;
    if (!tpPhoto || tpPhoto.length < 30) {
      setErr('La photo de profil est requise.');
      return;
    }
    if (bio.trim().length < 20) {
      setErr('La présentation professionnelle doit faire au moins 20 caractères.');
      return;
    }
    if (!coverageArea.trim()) {
      setErr('Indiquez une zone de couverture.');
      return;
    }
    if (categories.size === 0) {
      setErr('Sélectionnez au moins une catégorie de livraison.');
      return;
    }
    if (license.trim().length < 4) {
      setErr('Numéro de permis invalide.');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const availabilityKind = slots.length > 0 ? 'SUR_RESERVATION' : 'TEMPS_PLEIN';
      await api.post('/api/users/me/transporter-profile', {
        profilePhotoDataUrl: tpPhoto,
        transporterSecurityInfo: bio.trim(),
        vehicleType,
        coverageArea: coverageArea.trim(),
        yearsExperience,
        deliveryCategories: Array.from(categories),
        availability: availabilityKind,
        drivingLicenseNumber: license.trim(),
      });
      await api.put('/api/users/me/availability-slots', {
        slots: slots.map(({ startAt, endAt }) => ({ startAt, endAt })),
      });
      await refreshUser();
      if (variant === 'onboarding') {
        toast.success('Profil activé', {
          description: 'Vous pouvez répondre aux demandes et envoyer des offres.',
        });
        navigate('/dashboard', { replace: true });
      } else {
        toast.success('Fiche transporteur enregistrée');
      }
    } catch (error) {
      setErr(problemDetailMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (!user || user.role !== 'TRANSPORTER') return null;

  const deliveries = user.totalDeliveriesCompleted ?? 0;
  const avg = user.averageRating ?? 0;
  const idOk = user.identityVerified ?? false;
  const licOk = user.licenseVerified ?? false;
  const confirmed = user.transporterConfirmed ?? false;

  const shellOuter =
    'rounded-[2rem] border border-zinc-200/80 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]';
  const shellInner =
    'rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm sm:p-8 dark:border-white/[0.06] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease }}
      className={variant === 'profile' ? 'mt-8' : 'mt-10'}
    >
      <div className={shellOuter}>
        <div className={shellInner}>
          {variant === 'profile' && (
            <div className="mb-8 flex flex-col gap-6 border-b border-zinc-100 pb-8 dark:border-white/[0.06] lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <Truck weight="light" className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" aria-hidden />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Visibilité marketplace
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Fiche transporteur
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Informations présentées aux expéditeurs : expertise, couverture et signaux de confiance pour faciliter
                    leur choix.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-5 lg:col-span-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Confiance</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Livraisons</p>
                  <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white">
                    {deliveries}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Note moyenne</p>
                  <div className="mt-2">
                    <StarRatingDisplay value={avg} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-zinc-200/70 bg-white px-4 py-4 dark:border-white/[0.06] dark:bg-[#0a0a0a]">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Badges</p>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2.5 text-sm">
                    <CheckCircle
                      weight={idOk ? 'fill' : 'light'}
                      className={`h-5 w-5 shrink-0 ${idOk ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                      aria-hidden
                    />
                    <span className={idOk ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                      Identité vérifiée
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <Certificate
                      weight={licOk ? 'fill' : 'light'}
                      className={`h-5 w-5 shrink-0 ${licOk ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                      aria-hidden
                    />
                    <span className={licOk ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>Permis validé</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <ShieldCheck
                      weight={confirmed ? 'fill' : 'light'}
                      className={`h-5 w-5 shrink-0 ${confirmed ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                      aria-hidden
                    />
                    <span className={confirmed ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                      Transporteur confirmé
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Photo de profil</p>
                <div className="mt-4 flex aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/5">
                  {tpPhoto ? (
                    <img src={tpPhoto} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                      <Camera weight="light" className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <label className="mt-4 inline-flex cursor-pointer rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-800 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-50 active:scale-[0.98] dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5">
                  {variant === 'onboarding' ? 'Choisir une image' : 'Changer la photo'}
                  <input type="file" accept="image/*" className="sr-only" onChange={onTpFile} />
                </label>
              </div>
            </div>

            <form className="space-y-8 lg:col-span-7" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label htmlFor="tp-bio" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Présentation professionnelle
                </label>
                <textarea
                  id="tp-bio"
                  rows={variant === 'onboarding' ? 7 : 9}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={DEFAULT_BIO_PLACEHOLDER}
                  className={`${field} min-h-[180px] resize-y leading-relaxed`}
                />
                <p className="text-[11px] text-zinc-500">{bio.trim().length} caractères — minimum 20</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="tp-vehicle" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Type de véhicule
                  </label>
                  <select
                    id="tp-vehicle"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className={field}
                  >
                    {VEHICLE_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tp-years" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Années d&apos;expérience
                  </label>
                  <input
                    id="tp-years"
                    type="number"
                    min={0}
                    max={80}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className={field}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tp-coverage" className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <MapPin weight="light" className="h-4 w-4 text-emerald-500/90" aria-hidden />
                  Zone couverte
                </label>
                <input
                  id="tp-coverage"
                  value={coverageArea}
                  onChange={(e) => setCoverageArea(e.target.value)}
                  placeholder="Ex. Lomé, Sud Togo, National…"
                  className={field}
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Catégories de livraison</span>
                <div className="flex flex-wrap gap-2">
                  {DELIVERY_CATEGORY_OPTIONS.map((c) => {
                    const on = categories.has(c.key);
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => toggleCategory(c.key)}
                        className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
                          on
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-white/10 dark:text-zinc-400'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/30 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <TransporterAvailabilityCalendar slots={slots} onChange={setSlots} />
              </div>

              <div className="space-y-2">
                <label htmlFor="tp-license" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Numéro de permis de conduire
                </label>
                <input
                  id="tp-license"
                  type="password"
                  autoComplete="off"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Saisie sécurisée"
                  className={field}
                />
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  Stocké et transmis de façon sécurisée (HTTPS). Visible uniquement sur votre compte.
                </p>
              </div>

              {err && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  {err}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 disabled:opacity-50 active:scale-[0.98] sm:w-auto"
              >
                {busy
                  ? 'Enregistrement…'
                  : variant === 'onboarding'
                    ? 'Activer mon profil'
                    : 'Enregistrer la fiche transporteur'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChartLineUp,
  ClockCounterClockwise,
  GlobeHemisphereWest,
  Handshake,
  Lightning,
  MapPinLine,
  ShieldCheck,
  Truck,
  UsersThree,
} from '@phosphor-icons/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { landingImageAlts, landingImages } from '../data/landingMedia';

const ease = [0.32, 0.72, 0, 1] as const;

function StoryCard({
  src,
  alt,
  kicker,
  title,
  body,
  accentClass,
}: {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  body: string;
  accentClass: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease }}
      className="group overflow-hidden rounded-[2rem] border border-zinc-200/75 bg-white/90 dark:border-white/[0.06] dark:bg-white/[0.03]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white ${accentClass}`}
        >
          {kicker}
        </span>
      </div>
      <div className="border-t border-zinc-200/70 p-6 dark:border-white/[0.06]">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">{body}</p>
      </div>
    </motion.article>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 28, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease },
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-500">
      {children}
    </p>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [headerSolid, setHeaderSolid] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setHeaderSolid(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const navLinkBase =
    'rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]';
  const navLinkOnHero = `${navLinkBase} text-white/90 hover:text-white`;
  const navLinkSolid = `${navLinkBase} text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white`;

  const registerBase =
    'rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]';
  const registerOnHero = `${registerBase} border-white/35 bg-white/10 text-white shadow-none backdrop-blur-sm hover:border-white/50 hover:bg-white/18`;
  const registerSolid = `${registerBase} border-zinc-200 bg-white text-zinc-900 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/[0.08]`;

  const themeToggleHero =
    '!border-white/25 !bg-white/10 !text-white hover:!border-white/40 [&_span]:!text-white/95';

  return (
    <div className="relative overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-[#050505] dark:text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18] dark:opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 10%, rgba(5,150,105,0.18), transparent), radial-gradient(ellipse 60% 40% at 85% 30%, rgba(212,165,116,0.12), transparent)',
        }}
      />

      {/* Nav — fixe, style dynamique selon scroll */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          headerSolid
            ? 'border-zinc-200/90 bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0a0a0a]/92'
            : 'border-white/10 bg-black/35 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span
            className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight ${
              headerSolid ? 'text-zinc-900 dark:text-white' : 'text-white'
            }`}
          >
            Loban
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle className={headerSolid ? '' : themeToggleHero} />
            <Link to="/login" className={headerSolid ? navLinkSolid : navLinkOnHero}>
              Connexion
            </Link>
            <Link to="/register" className={headerSolid ? registerSolid : registerOnHero}>
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — vidéo plein cadre + overlay */}
      <section
        ref={heroRef}
        className="relative isolate min-h-[min(100dvh,960px)] overflow-hidden"
      >
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/landing/hero-side.jpg"
          aria-hidden
        >
          <source src="/landing/hero-bg.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/45 to-emerald-950/40"
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-28 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-12 md:pb-32 md:pt-36">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease }}
            >
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <GlobeHemisphereWest weight="light" className="h-4 w-4 text-emerald-300" />
                Marketplace logistique
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tighter text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                Transporteurs et clients,
                <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-[#d4a574] bg-clip-text text-transparent">
                  reliés par Loban
                </span>
              </h1>
              <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-white/80">
                Publiez vos besoins, comparez les offres en temps réel et suivez chaque livraison dans une interface sobre,
                rapide et pensée pour le terrain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(5,150,105,0.45)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 active:scale-[0.98]"
              >
                Démarrer
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <ArrowRight weight="light" className="h-4 w-4" />
                </span>
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/95 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/50 hover:bg-white/12"
              >
                Voir l&apos;espace connecté
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease }}
            className="relative max-md:mt-4"
          >
            <figure className="m-0">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/30 shadow-[0_28px_70px_rgba(0,0,0,0.5)] sm:rounded-[1.75rem]">
                <img
                  src="/landing/hero-side.jpg"
                  alt="Équipe au travail dans un entrepôt : préparation de commandes et flux marchandises."
                  width={900}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] max-h-[min(520px,70vh)] w-full object-cover sm:max-h-[min(560px,74vh)]"
                />
              </div>
              <figcaption className="mt-8 space-y-5">
                <p className="font-[family-name:var(--font-display)] text-[clamp(1.125rem,2.6vw,1.4rem)] font-medium leading-snug tracking-tight text-white">
                  « Un prix qu&apos;on comprend tout de suite — avant même de charger le camion. »
                </p>
                <p className="max-w-md text-sm leading-relaxed text-white/72">
                  Sur le terrain, la confiance se joue sur des offres lisibles par tout le monde. Loban est pensé pour ça :
                  moins de flou commercial, plus de clarté partagée.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-white/20 pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  <span>Expéditeurs</span>
                  <span>Transporteurs</span>
                  <span>Ouest africain</span>
                </div>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* Corridor régional */}
      <motion.section
        {...fadeUp}
        className="relative z-10 border-y border-zinc-200/70 bg-zinc-100/70 py-14 dark:border-white/[0.05] dark:bg-black/30"
      >
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow>Réseau régional</SectionEyebrow>
          <p className="max-w-2xl font-[family-name:var(--font-display)] text-xl font-medium tracking-tight text-zinc-900 md:text-2xl dark:text-white">
            Des corridors urbains aux liaisons inter-capitales — une plateforme taillée pour la logistique en Afrique de
            l&apos;Ouest.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {['Dakar', 'Abidjan', 'Bamako', 'Ouagadougou', 'Lomé', 'Cotonou'].map((city) => (
              <span
                key={city}
                className="rounded-full border border-zinc-200/90 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ambiance terrain — fondus croisés + texte */}
      <section className="relative z-10 overflow-hidden border-y border-zinc-200/70 bg-zinc-900 dark:border-white/[0.06]">
        <div className="relative aspect-[21/9] min-h-[220px] w-full max-md:aspect-[16/11]">
          <img
            src={landingImages.beltA}
            alt={landingImageAlts.beltA}
            width={1600}
            height={686}
            loading="lazy"
            decoding="async"
            className="loban-xfade-a absolute inset-0 h-full w-full object-cover"
          />
          <img
            src={landingImages.beltB}
            alt={landingImageAlts.beltB}
            width={1600}
            height={686}
            loading="lazy"
            decoding="async"
            className="loban-xfade-b absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/30" />
          <div className="relative z-[1] flex h-full flex-col justify-center px-6 py-12 md:px-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl"
            >
              La logistique, ce n’est pas que des chiffres : ce sont des routes, des quais, des équipes qui avancent
              ensemble.
            </motion.p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
              Loban s’inspire du terrain : des visages réels, des flux réels — pour une marketplace qui parle le même
              langage que vous.
            </p>
          </div>
        </div>
      </section>

      {/* Visages & récits courts (illustratif) */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28">
        <motion.div {...fadeUp}>
          <SectionEyebrow>Au quotidien</SectionEyebrow>
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
            Des personnes derrière chaque envoi
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-500">
            Clients qui cadencent leurs opérations, partenaires qui s’engagent sur un prix, professionnels qui assurent
            le dernier kilomètre : Loban met ces mondes en lien.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          <StoryCard
            src={landingImages.faceClient}
            alt={landingImageAlts.faceClient}
            kicker="Pilotage"
            title="Clarté côté expéditeur"
            body="Priorités, délais et budget visibles : vous décidez sur des offres comparables, sans perdre le fil."
            accentClass="bg-emerald-600/90"
          />
          <StoryCard
            src={landingImages.faceOps}
            alt={landingImageAlts.faceOps}
            kicker="Confiance"
            title="Accord puis exécution"
            body="Une fois l’offre choisie, tout le monde sait quoi faire — moins de friction, plus de traçabilité."
            accentClass="bg-[#8b6914]/90"
          />
          <StoryCard
            src={landingImages.faceDriver}
            alt={landingImageAlts.faceDriver}
            kicker="Route"
            title="Le dernier kilomètre"
            body="Indépendants ou équipes : le trajet se vit sur le terrain ; Loban garde la vue d’ensemble pour vous."
            accentClass="bg-zinc-800/90"
          />
        </div>
      </section>

      {/* Valeur */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div {...fadeUp}>
          <SectionEyebrow>Pourquoi Loban</SectionEyebrow>
          <h2 className="max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
            Transparence des prix, exécution sans friction
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-500">
            Une couche logicielle au-dessus de vos opérations : de la demande à la livraison, chaque étape est visible et
            actionnable.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-12 md:gap-6">
          {[
            {
              title: 'Offres comparables',
              body: 'Les transporteurs répondent avec un prix clair. Vous comparez sans allers-retours interminables.',
              icon: ChartLineUp,
              span: 'md:col-span-5 md:row-span-2',
            },
            {
              title: 'Sécurité & rôles',
              body: 'Espaces distincts pour les clients et les transporteurs, connexion sécurisée et données visibles uniquement sur votre compte.',
              icon: ShieldCheck,
              span: 'md:col-span-7',
            },
            {
              title: 'Du suivi à la notation',
              body: 'Vous voyez où en est la demande, de la publication jusqu’à la livraison confirmée, puis vous laissez un avis pour sécuriser la confiance.',
              icon: Lightning,
              span: 'md:col-span-7',
            },
            {
              title: 'Notifications utiles',
              body: 'Alertes utiles : nouvelles offres, offre retenue et étapes de livraison — sans notifications inutiles.',
              icon: ClockCounterClockwise,
              span: 'md:col-span-5',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.65, ease }}
              className={`rounded-[2rem] border border-zinc-200/75 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03] ${card.span}`}
            >
              <div className="h-full rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white p-6 shadow-sm md:p-8 dark:border-white/[0.05] dark:bg-[#080808] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <Icon weight="light" className="h-7 w-7 text-emerald-400/90" />
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">{card.body}</p>
              </div>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* Parcours */}
      <section className="relative z-10 border-t border-zinc-200/70 bg-zinc-100/50 py-24 dark:border-white/[0.05] dark:bg-[#060606] md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <SectionEyebrow>Parcours</SectionEyebrow>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
              Deux espaces, une même fluidité
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14">
            <motion.div
              {...fadeUp}
              className="rounded-[2rem] border border-zinc-200/75 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white dark:border-white/[0.06] dark:bg-[#0a0a0a]">
                <div className="relative aspect-[2/1] w-full max-md:aspect-[16/10]">
                  <img
                    src={landingImages.parcoursClient}
                    alt={landingImageAlts.parcoursClient}
                    width={900}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white from-30% to-transparent dark:from-[#0a0a0a]" />
                </div>
                <div className="px-8 pb-8 pt-2">
                <div className="flex items-center gap-3">
                  <UsersThree weight="light" className="h-6 w-6 text-emerald-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Client</span>
                </div>
                <ol className="mt-8 space-y-6 border-l border-zinc-300 pl-6 dark:border-white/[0.08]">
                  {[
                    'Créez une demande : enlèvement, destination, description du colis.',
                    'Recevez les offres des transporteurs et comparez les prix.',
                    'Choisissez une offre et suivez l’envoi jusqu’à la réception du colis.',
                    'Notez le transporteur une fois le colis livré.',
                  ].map((step, i) => (
                    <li key={step} className="relative text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <span className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#0a0a0a]" />
                      <span className="font-medium text-zinc-800 dark:text-zinc-300">{i + 1}. </span>
                      {step}
                    </li>
                  ))}
                </ol>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={fadeUp.initial}
              whileInView={fadeUp.whileInView}
              viewport={fadeUp.viewport}
              transition={{ duration: 0.75, ease, delay: 0.1 }}
              className="rounded-[2rem] border border-zinc-200/75 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white dark:border-white/[0.06] dark:bg-[#0a0a0a]">
                <div className="relative aspect-[2/1] w-full max-md:aspect-[16/10]">
                  <img
                    src={landingImages.parcoursTransporter}
                    alt={landingImageAlts.parcoursTransporter}
                    width={900}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white from-30% to-transparent dark:from-[#0a0a0a]" />
                </div>
                <div className="px-8 pb-8 pt-2">
                <div className="flex items-center gap-3">
                  <Truck weight="light" className="h-6 w-6 text-[#d4a574]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Transporteur
                  </span>
                </div>
                <ol className="mt-8 space-y-6 border-l border-zinc-300 pl-6 dark:border-white/[0.08]">
                  {[
                    'Parcourez les demandes ouvertes et proposez votre tarif.',
                    'Une fois votre offre choisie par le client, vous indiquez le démarrage du trajet puis la livraison effectuée.',
                    'Coordonnez avec le client depuis la fiche livraison.',
                    'Capitalisez sur vos évaluations pour votre réputation.',
                  ].map((step, i) => (
                    <li key={step} className="relative text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <span className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full bg-[#d4a574] ring-4 ring-white dark:ring-[#0a0a0a]" />
                      <span className="font-medium text-zinc-800 dark:text-zinc-300">{i + 1}. </span>
                      {step}
                    </li>
                  ))}
                </ol>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Confiance */}
      <motion.section {...fadeUp} className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="rounded-[2rem] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.07] via-transparent to-amber-500/[0.06] p-2 dark:border-emerald-500/20 dark:from-emerald-500/[0.09] dark:to-[#d4a574]/[0.06]">
          <div className="rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white px-8 py-12 shadow-sm md:flex md:items-center md:justify-between md:gap-12 md:px-14 md:py-16 dark:border-white/[0.06] dark:bg-[#070707] dark:shadow-none">
            <div className="max-w-xl">
              <Handshake weight="light" className="h-8 w-8 text-emerald-400" />
              <h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
                Une marketplace qui aligne intérêts clients et transporteurs
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                Loban réduit les frictions commerciales : moins d’incertitude sur le prix, plus de visibilité sur
                l’exécution. Idéal pour les équipes qui veulent scaler sans sacrifier la qualité de service.
              </p>
            </div>
            <div className="mt-10 grid shrink-0 grid-cols-2 gap-8 md:mt-0 md:gap-12">
              <div>
                <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tabular-nums text-zinc-900 md:text-5xl dark:text-white">
                  24h
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-500">fenêtre type</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tabular-nums text-zinc-900 md:text-5xl dark:text-white">
                  100%
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-500">parcours traçable</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Carte conceptuelle */}
      <section className="relative z-10 border-t border-zinc-200/70 py-24 dark:border-white/[0.05] md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="md:flex md:items-end md:justify-between md:gap-12">
            <div>
              <SectionEyebrow>Couverture</SectionEyebrow>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
                Routage & zones
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                Décrivez enlèvement et destination avec précision : Loban structure la demande pour que les transporteurs
                répondent avec des offres comparables.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300 md:mt-0"
            >
              Configurer mon profil
              <ArrowRight weight="light" className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-14 rounded-[2rem] border border-zinc-200/75 bg-white/90 p-2 dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <div className="grid overflow-hidden rounded-[calc(2rem-0.5rem)] border border-zinc-200/70 bg-white shadow-sm dark:border-white/[0.05] dark:bg-[#080808] dark:shadow-none md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="relative min-h-[220px]">
                <img
                  src={landingImages.coverage}
                  alt={landingImageAlts.coverage}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="h-full min-h-[220px] w-full object-cover md:min-h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:from-black/30" />
              </div>
              <div className="relative p-10 md:p-12">
                <MapPinLine weight="light" className="h-10 w-10 text-emerald-500/80" />
                <p className="mt-6 max-w-md font-[family-name:var(--font-display)] text-xl font-medium text-zinc-900 dark:text-white">
                  Du premier mile au dernier kilomètre
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
                  Centralisez les demandes, évitez les devis flous et gardez une trace claire de chaque envoi — sans
                  tableurs ni fils de mails perdus.
                </p>
                <div className="pointer-events-none absolute -bottom-12 -right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <motion.section {...fadeUp} className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8 md:pb-32">
        <div className="rounded-[2rem] border border-zinc-200/80 bg-gradient-to-r from-white to-emerald-50 p-10 text-center shadow-sm md:p-14 dark:border-white/[0.08] dark:from-white/[0.06] dark:to-emerald-500/[0.08] dark:shadow-none">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl dark:text-white">
            Prêt à orchestrer vos transports ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
            Créez un compte en quelques secondes — client ou transporteur — et entrez dans l&apos;espace Loban.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(5,150,105,0.35)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 active:scale-[0.98]"
            >
              S&apos;inscrire
              <ArrowRight weight="light" className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-zinc-300 px-8 py-3.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-900 dark:border-white/15 dark:text-zinc-300 dark:hover:border-white/25 dark:hover:text-white"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 bg-zinc-100/90 py-12 dark:border-white/[0.06] dark:bg-black/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-6 md:flex-row md:items-center">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
              Loban
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-600 dark:text-zinc-600">
              Marketplace logistique — mise en relation clients et transporteurs avec offres comparables et suivi de
              livraison.
            </p>
            <p className="mt-3 max-w-xs text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-600">
              Photographies illustratives — crédits aux contributeurs Unsplash.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-xs uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-500">
            <Link to="/login" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Connexion
            </Link>
            <Link to="/register" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
              Inscription
            </Link>
          </div>
          <p className="text-[11px] text-zinc-600">© {new Date().getFullYear()} Loban</p>
        </div>
      </footer>
    </div>
  );
}

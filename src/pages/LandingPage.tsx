import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChartLineUp,
  ClockCounterClockwise,
  Handshake,
  Lightning,
  MapPinLine,
  ShieldCheck,
  Truck,
  UsersThree,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
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
      className="group overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/[0.07] dark:bg-zinc-950/50 dark:shadow-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm ${accentClass}`}
        >
          {kicker}
        </span>
      </div>
      <div className="border-t border-zinc-100 p-6 dark:border-white/[0.06]">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
      </div>
    </motion.article>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, ease },
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
      {children}
    </p>
  );
}

export function LandingPage() {
  const { user, logout } = useAuth();
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
  const dashboardPath =
    user?.role === 'TRANSPORTER' && user.transporterProfileComplete === false
      ? '/onboarding/transporter'
      : '/dashboard';

  return (
    <div className="relative overflow-hidden bg-[#fafafa] text-zinc-900 dark:bg-[#030303] dark:text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.09] dark:opacity-[0.2]"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 15% 0%, rgba(5,150,105,0.14), transparent), radial-gradient(ellipse 55% 35% at 90% 20%, rgba(100,116,139,0.08), transparent)',
        }}
      />

      {/* Nav — fixe, style dynamique selon scroll */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300 ${
          headerSolid
            ? 'border-zinc-200/80 bg-white/[0.92] shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0a0a0a]/95 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'border-white/[0.08] bg-black/40 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          <span
            className={`font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight ${
              headerSolid ? 'text-zinc-900 dark:text-white' : 'text-white'
            }`}
          >
            Loban
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle className={headerSolid ? '' : themeToggleHero} />
            {user ? (
              <>
                <Link to={dashboardPath} className={headerSolid ? navLinkSolid : navLinkOnHero}>
                  Mon espace
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className={headerSolid ? registerSolid : registerOnHero}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={headerSolid ? navLinkSolid : navLinkOnHero}>
                  Connexion
                </Link>
                <Link to="/register" className={headerSolid ? registerSolid : registerOnHero}>
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — split éditorial + carte « double bézel » (vidéo conservée, lisibilité à gauche, air à droite) */}
      <section
        ref={heroRef}
        className="relative isolate min-h-[min(100dvh,920px)] overflow-hidden bg-[#050505]"
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
        {/* Lumière ambiante emerald + lecture gauche → droite plus claire */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_55%_45%_at_15%_85%,rgba(5,150,105,0.14),transparent_62%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0a0a0a]/[0.94] via-[#050505]/72 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/35"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid min-h-[min(100dvh,920px)] w-full max-w-[1400px] grid-cols-1 gap-y-14 px-6 pb-20 pt-28 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-x-10 lg:gap-y-0 lg:px-10 lg:pb-28 lg:pt-24 xl:px-14">
          {/* Colonne typographique — alignée début, pas centrée */}
          <div className="flex max-w-xl flex-col lg:max-w-none xl:pr-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-400/90">
                Loban · mise en relation
              </p>
              <h1 className="mt-7 max-w-[17ch] text-balance font-[family-name:var(--font-display)] text-[clamp(2.125rem,5.8vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                Un trajet, un prix affiché, zéro approximation.
              </h1>
              <p className="mt-8 max-w-[40ch] text-[15px] leading-[1.75] text-white/68">
                Vous posez votre besoin ou votre tarif : votre interlocuteur voit exactement la même chose. Vous comparez,
                vous choisissez, vous suivez la livraison sans reconstruire l’historique dans vos messages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
              className="mt-11 flex flex-wrap items-center gap-4"
            >
              <Link
                to={user ? dashboardPath : '/register'}
                className="group inline-flex items-center gap-3 rounded-full bg-emerald-600 py-3 pl-7 pr-2 text-sm font-semibold text-white shadow-[0_12px_40px_-8px_rgba(5,150,105,0.45)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-500 active:scale-[0.98]"
              >
                {user ? 'Aller à mon espace' : 'Ouvrir mon espace'}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <ArrowRight weight="light" className="h-4 w-4" />
                </span>
              </Link>
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/30 hover:bg-white/[0.07]"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/30 hover:bg-white/[0.07]"
                >
                  J’ai déjà un compte
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/[0.09] pt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-white/38"
            >
              <span>
                <span className="text-white/55">01</span> Offres comparables
              </span>
              <span>
                <span className="text-white/55">02</span> Rôles séparés, données à vous
              </span>
              <span>
                <span className="text-white/55">03</span> Ouest africain
              </span>
            </motion.div>
          </div>

          {/* Panneau « double bézel » — profondeur, léger décalage (desktop uniquement) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.14, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="pointer-events-none absolute -right-6 -top-10 h-44 w-44 rounded-full bg-emerald-500/[0.12] blur-3xl lg:right-0" aria-hidden />
            <div className="relative w-full max-w-md rounded-[2rem] p-2 ring-1 ring-white/[0.09] max-lg:translate-y-0 max-lg:rotate-0 lg:-translate-y-3 lg:rotate-[-0.6deg]">
              <div className="rounded-[calc(2rem-10px)] border border-white/[0.07] bg-[#0a0a0a]/[0.92] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:p-9">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500/85">
                  Ce qui change pour vous
                </p>
                <ul className="mt-7 space-y-5 border-l border-emerald-500/35 pl-5 text-[14px] leading-snug text-white/78">
                  <li className="relative">
                    <span className="absolute -left-5 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
                    Même écran pour celui qui envoie et celui qui roule : le prix n’est pas interprété deux fois.
                  </li>
                  <li className="relative">
                    <span className="absolute -left-5 top-2 h-1.5 w-1.5 rounded-full bg-white/25" />
                    Le trajet avance dans l’app : vous savez où ça en est sans relancer au téléphone.
                  </li>
                  <li className="relative">
                    <span className="absolute -left-5 top-2 h-1.5 w-1.5 rounded-full bg-white/25" />
                    La notation après livraison : une trace pour la prochaine mission.
                  </li>
                </ul>
                <div className="mt-9 flex items-center gap-4 border-t border-white/[0.07] pt-7">
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" aria-hidden />
                  <p className="shrink-0 max-w-[14rem] text-right font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                    Terrain réel — pas un tableau Excel partagé
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Corridor régional */}
      <motion.section
        {...fadeUp}
        className="relative z-10 border-y border-zinc-200/60 bg-white py-16 dark:border-white/[0.05] dark:bg-[#060606] md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <SectionEyebrow>Réseau régional</SectionEyebrow>
          <p className="max-w-2xl font-[family-name:var(--font-display)] text-xl font-semibold leading-snug tracking-tight text-zinc-900 md:text-[1.35rem] dark:text-white">
            Des corridors urbains aux liaisons inter-capitales — une plateforme pensée pour la logistique en Afrique de
            l&apos;Ouest.
          </p>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {['Dakar', 'Abidjan', 'Bamako', 'Ouagadougou', 'Lomé', 'Cotonou'].map((city) => (
              <span
                key={city}
                className="rounded-md border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ambiance terrain — fondus croisés + texte */}
      <section className="relative z-10 overflow-hidden border-y border-zinc-200/50 bg-zinc-950 dark:border-white/[0.05]">
        <div className="relative aspect-[21/9] min-h-[240px] w-full max-md:aspect-[16/11]">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/35" />
          <div className="relative z-[1] flex h-full flex-col justify-center px-6 py-14 md:px-14 md:py-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
              className="max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-[1.25] tracking-tight text-white md:text-[1.75rem]"
            >
              La logistique, ce n’est pas que des chiffres : ce sont des routes, des quais, des équipes qui avancent
              ensemble.
            </motion.p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70">
              Loban s’inspire du terrain : des visages réels, des flux réels — pour une marketplace qui parle le même
              langage que vous.
            </p>
          </div>
        </div>
      </section>

      {/* Visages & récits courts (illustratif) */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div {...fadeUp}>
          <SectionEyebrow>Au quotidien</SectionEyebrow>
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-zinc-900 dark:text-white">
            Des personnes derrière chaque envoi
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Clients qui cadencent leurs opérations, partenaires qui s’engagent sur un prix, professionnels qui assurent
            le dernier kilomètre : Loban met ces mondes en lien.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
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
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div {...fadeUp}>
          <SectionEyebrow>Pourquoi Loban</SectionEyebrow>
          <h2 className="max-w-xl font-[family-name:var(--font-display)] text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-zinc-900 dark:text-white">
            Transparence des prix, exécution sans friction
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Une couche logicielle au-dessus de vos opérations : de la demande à la livraison, chaque étape est visible et
            actionnable.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-5">
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.6, ease }}
              className={`rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:p-8 dark:border-white/[0.07] dark:bg-zinc-950/60 dark:shadow-none ${card.span}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/[0.09] dark:bg-emerald-500/[0.12]">
                <Icon weight="light" className="h-5 w-5 text-emerald-600 dark:text-emerald-400/95" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{card.body}</p>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* Parcours */}
      <section className="relative z-10 border-t border-zinc-200/60 bg-[#f4f4f5] py-20 dark:border-white/[0.05] dark:bg-[#050505] md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp}>
            <SectionEyebrow>Parcours</SectionEyebrow>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-zinc-900 dark:text-white">
              Deux espaces, une même fluidité
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14">
            <motion.div
              {...fadeUp}
              className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/[0.07] dark:bg-zinc-950/40 dark:shadow-none"
            >
              <div className="overflow-hidden bg-white dark:bg-[#0a0a0a]">
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
              transition={{ duration: 0.65, ease, delay: 0.08 }}
              className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/[0.07] dark:bg-zinc-950/40 dark:shadow-none"
            >
              <div className="overflow-hidden bg-white dark:bg-[#0a0a0a]">
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
      <motion.section {...fadeUp} className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] md:flex md:items-stretch dark:border-white/[0.07] dark:bg-zinc-950/50 dark:shadow-none">
          <div className="flex-1 border-b border-zinc-100 px-8 py-12 md:border-b-0 md:border-r md:px-14 md:py-16 dark:border-white/[0.06]">
            <div className="max-w-xl md:max-w-[28rem]">
              <Handshake weight="light" className="h-7 w-7 text-emerald-600 dark:text-emerald-400/90" />
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white">
                Une marketplace qui aligne intérêts clients et transporteurs
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Loban réduit les frictions commerciales : moins d’incertitude sur le prix, plus de visibilité sur
                l’exécution. Idéal pour les équipes qui veulent scaler sans sacrifier la qualité de service.
              </p>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 content-center gap-8 border-t border-zinc-100 bg-zinc-50/90 px-8 py-10 sm:min-w-[280px] md:border-t-0 md:border-l md:px-12 md:py-16 dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 md:text-4xl dark:text-white">
                24h
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-500">
                fenêtre type
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums tracking-tight text-zinc-900 md:text-4xl dark:text-white">
                100%
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-500">
                parcours traçable
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Carte conceptuelle */}
      <section className="relative z-10 border-t border-zinc-200/60 py-20 dark:border-white/[0.05] md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="md:flex md:items-end md:justify-between md:gap-12">
            <div>
              <SectionEyebrow>Couverture</SectionEyebrow>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-tight text-zinc-900 dark:text-white">
                Routage & zones
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Décrivez enlèvement et destination avec précision : Loban structure la demande pour que les transporteurs
                répondent avec des offres comparables.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 md:mt-0"
            >
              Configurer mon profil
              <ArrowRight weight="light" className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-12 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:border-white/[0.07] dark:bg-zinc-950/50 dark:shadow-none"
          >
            <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
              <div className="relative border-t border-zinc-100 p-10 md:border-t-0 md:border-l md:p-12 dark:border-white/[0.06]">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/[0.09] dark:bg-emerald-500/[0.12]">
                  <MapPinLine weight="light" className="h-6 w-6 text-emerald-600 dark:text-emerald-400/90" />
                </div>
                <p className="mt-6 max-w-md font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                  Du premier mile au dernier kilomètre
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
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
      <motion.section {...fadeUp} className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-6 md:pb-28">
        <div className="rounded-2xl border border-zinc-200/70 bg-white px-8 py-12 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)] md:px-14 md:py-16 dark:border-white/[0.08] dark:bg-zinc-950/60 dark:shadow-none">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.375rem,2.8vw,1.875rem)] font-semibold tracking-tight text-zinc-900 dark:text-white">
            Prêt à orchestrer vos transports ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Créez un compte en quelques secondes — client ou transporteur — et entrez dans l&apos;espace Loban.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(5,150,105,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_12px_36px_rgba(5,150,105,0.35)] active:scale-[0.98]"
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
      <footer className="relative z-10 border-t border-zinc-200/70 bg-zinc-100 py-14 dark:border-white/[0.06] dark:bg-[#080808]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-12 px-6 md:flex-row md:items-start md:gap-16">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-zinc-900 dark:text-white">
              Loban
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-600 dark:text-zinc-600">
              La mise en relation entre expéditeurs et transporteurs : offres comparables et livraisons suivies, sans
              perdre le fil.
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

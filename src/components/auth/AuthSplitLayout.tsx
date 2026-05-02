import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { ThemeToggle } from '../ThemeToggle';

type AuthSplitLayoutProps = {
  imageSrc: string;
  imageAlt: string;
  /** Accroche au-dessus du titre du panneau gauche */
  kicker: string;
  /** Titre principal du panneau visuel */
  title: string;
  /** Sous-texte du panneau visuel */
  description: string;
  children: React.ReactNode;
};

/**
 * Layout auth : image réaliste à gauche (desktop), formulaire à droite.
 * Mobile : bandeau photo puis formulaire.
 */
export function AuthSplitLayout({
  imageSrc,
  imageAlt,
  kicker,
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-[100dvh] bg-zinc-100 dark:bg-zinc-950">
      <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
        <div className="relative order-1 aspect-[5/3] w-full overflow-hidden sm:aspect-[2/1] lg:order-none lg:aspect-auto lg:min-h-[100dvh]">
          <img
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-900/55 to-zinc-900/25 lg:bg-gradient-to-br lg:from-black/80 lg:via-zinc-950/45 lg:to-emerald-950/35"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:inset-0 lg:flex lg:flex-col lg:justify-end lg:p-10 xl:p-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300/95">{kicker}</p>
            <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-[1.15] tracking-tight text-white sm:text-3xl xl:text-[2rem] xl:leading-tight">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/78">{description}</p>
            <p className="mt-8 hidden font-[family-name:var(--font-display)] text-lg tracking-tight text-white/90 lg:block">
              Loban
            </p>
          </div>
        </div>

        <div className="relative order-2 flex min-h-0 flex-col bg-white dark:bg-[#0a0a0a] lg:min-h-[100dvh]">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200/90 px-5 py-4 dark:border-white/[0.06] sm:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <ArrowLeft weight="light" className="h-4 w-4 shrink-0" />
              Accueil
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
            <div className="mx-auto w-full max-w-[440px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

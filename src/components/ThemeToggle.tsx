import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '../context/ThemeContext';

type Props = {
  className?: string;
  /** Style nav flottante (icône seule) */
  variant?: 'icon' | 'pill';
};

export function ThemeToggle({ className = '', variant = 'pill' }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white ${className}`}
        aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {isDark ? <Sun weight="light" className="h-5 w-5" /> : <Moon weight="light" className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-300 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-white/20 ${className}`}
      aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      {isDark ? <Sun weight="light" className="h-4 w-4 text-amber-300" /> : <Moon weight="light" className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? 'Clair' : 'Sombre'}</span>
    </button>
  );
}

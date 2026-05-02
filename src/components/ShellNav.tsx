import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Package, SignOut, Truck, UserCircle } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  getNotificationRingDurationSec,
  playNotificationRing,
  stopNotificationRing,
} from '../lib/notificationSound';
import { BACKGROUND_LIST_POLL_MS } from '../lib/polling';
import { ThemeToggle } from './ThemeToggle';

const linkEase = [0.32, 0.72, 0, 1] as const;

export function ShellNav() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [unread, setUnread] = useState(0);
  const prevUnreadRef = useRef<number | null>(null);

  const transporterIncomplete =
    user?.role === 'TRANSPORTER' && user.transporterProfileComplete === false;

  useEffect(() => {
    if (!user) {
      stopNotificationRing();
      prevUnreadRef.current = null;
      setUnread(0);
      return;
    }
    const skipNotifs =
      user.role === 'TRANSPORTER' && user.transporterProfileComplete === false;
    if (skipNotifs) {
      prevUnreadRef.current = null;
      setUnread(0);
      return;
    }
    let cancelled = false;

    async function fetchUnread() {
      if (document.visibilityState !== 'visible') return;
      try {
        const { data } = await api.get<{ count: number }>('/api/notifications/unread-count');
        if (cancelled) return;
        const next = data.count;
        const prev = prevUnreadRef.current;
        if (prev !== null && next > prev) {
          toast.info('Nouvelle notification', {
            description: next - prev > 1 ? `${next - prev} nouvelles notifications` : undefined,
          });
          playNotificationRing(getNotificationRingDurationSec());
        }
        prevUnreadRef.current = next;
        setUnread(next);
      } catch {
        /* ignore */
      }
    }

    void fetchUnread();
    const interval = setInterval(fetchUnread, BACKGROUND_LIST_POLL_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') void fetchUnread();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [user, loc.pathname]);

  if (!user) return null;

  const clientLinks = [
    { to: '/dashboard', label: 'Espace client' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/profile', label: 'Profil' },
  ];
  const transporterLinks = [
    { to: '/dashboard', label: 'Tableau de bord' },
    { to: '/requests/open', label: 'Demandes ouvertes' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/profile', label: 'Profil' },
  ];
  const links =
    user.role === 'CLIENT' ? clientLinks : transporterIncomplete ? [] : transporterLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/90 bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0a0a0a]/92">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: linkEase }}
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-6 py-3.5 md:gap-x-4 md:py-4"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-zinc-900 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] dark:text-white"
        >
          {user.role === 'CLIENT' ? (
            <Package weight="light" className="h-5 w-5 text-emerald-500" />
          ) : (
            <Truck weight="light" className="h-5 w-5 text-emerald-500" />
          )}
          Loban
        </Link>
        <span
          className={`hidden h-6 w-px shrink-0 bg-zinc-200 md:block dark:bg-white/10 ${transporterIncomplete ? 'md:hidden' : ''}`}
          aria-hidden
        />
        <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-1 md:justify-center md:gap-1.5 lg:gap-2">
          {links.map((l) => {
            const active = loc.pathname === l.to || loc.pathname.startsWith(l.to + '/');
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:text-xs ${
                  active
                    ? 'bg-emerald-600/12 text-emerald-900 dark:bg-white/10 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <ThemeToggle variant="icon" />
          {!transporterIncomplete && (
            <Link
              to="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Notifications"
            >
              <Bell weight="light" className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0a0a0a]" />
              )}
            </Link>
          )}
          {!transporterIncomplete && (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Profil"
            >
              <UserCircle weight="light" className="h-5 w-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={logout}
            className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white py-2 pl-3.5 pr-2 text-xs font-medium text-zinc-700 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-zinc-300 hover:text-zinc-900 active:scale-[0.98] dark:border-white/12 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-white/20 dark:hover:text-white"
          >
            Déconnexion
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px dark:bg-white/10">
              <SignOut weight="light" className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </motion.div>
    </header>
  );
}

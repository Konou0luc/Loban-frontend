import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { BACKGROUND_LIST_POLL_MS } from '../lib/polling';
import { humanizeStatusCodesInText } from '../lib/userFacingStatus';
import type { Notification } from '../types/api';

const ease = [0.32, 0.72, 0, 1] as const;

export function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get<Notification[]>('/api/notifications');
    setItems(data);
  }, []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        await load();
      } finally {
        if (!c) setLoading(false);
      }
    })();
    const interval = setInterval(() => {
      if (c || document.visibilityState !== 'visible') return;
      void load();
    }, BACKGROUND_LIST_POLL_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      c = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [load]);

  async function markRead(id: number) {
    await api.patch(`/api/notifications/${id}/read`);
    await load();
  }

  async function markAll() {
    await api.post('/api/notifications/read-all');
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Centre
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-zinc-900 dark:text-white">
            Notifications
          </h1>
        </div>
        {items.some((n) => !n.read) && (
          <button
            type="button"
            onClick={markAll}
            className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white"
          >
            Tout marquer lu
          </button>
        )}
      </motion.div>

      <div className="mt-10 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-white/[0.04]" />
          ))
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-500">Aucune notification.</p>
        ) : (
          items.map((n, idx) => (
            <motion.button
              key={n.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.5, ease }}
              onClick={() => !n.read && markRead(n.id)}
              className={`w-full rounded-2xl border px-5 py-4 text-left transition-colors ${
                n.read
                  ? 'border-zinc-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02] dark:shadow-none'
                  : 'border-emerald-500/30 bg-emerald-50/90 dark:border-emerald-500/25 dark:bg-emerald-500/[0.06]'
              }`}
            >
              <p className="font-medium text-zinc-900 dark:text-white">{n.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {humanizeStatusCodesInText(n.message)}
              </p>
              <p className="mt-3 text-[11px] text-zinc-600">
                {new Date(n.createdAt).toLocaleString('fr-FR')}
              </p>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

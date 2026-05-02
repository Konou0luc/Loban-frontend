import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, CaretLeft, CaretRight, Trash } from '@phosphor-icons/react';
import type { AvailabilitySlot } from '../types/api';
import { datetimeLocalToIso, isoToDatetimeLocal } from '../lib/availabilityDatetime';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const ease = [0.32, 0.72, 0, 1] as const;

function buildCalendarCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

function countSlotsOnDay(slots: AvailabilitySlot[], year: number, monthIndex: number, day: number): number {
  return slots.filter((s) => {
    const a = new Date(s.startAt);
    return a.getFullYear() === year && a.getMonth() === monthIndex && a.getDate() === day;
  }).length;
}

type Props = {
  slots: AvailabilitySlot[];
  onChange: (next: AvailabilitySlot[]) => void;
};

export function TransporterAvailabilityCalendar({ slots, onChange }: Props) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [startLocal, setStartLocal] = useState('');
  const [endLocal, setEndLocal] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const cells = useMemo(() => buildCalendarCells(year, monthIndex), [year, monthIndex]);

  const title = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(cursor);

  function prevMonth() {
    setCursor(new Date(year, monthIndex - 1, 1));
  }

  function nextMonth() {
    setCursor(new Date(year, monthIndex + 1, 1));
  }

  function addSlotFromForm() {
    setFormErr(null);
    if (!startLocal || !endLocal) {
      setFormErr('Indiquez le début et la fin du créneau.');
      return;
    }
    const startIso = datetimeLocalToIso(startLocal);
    const endIso = datetimeLocalToIso(endLocal);
    if (!startIso || !endIso) {
      setFormErr('Dates invalides.');
      return;
    }
    if (new Date(endIso) <= new Date(startIso)) {
      setFormErr('La fin doit être après le début.');
      return;
    }
    const minMs = 15 * 60 * 1000;
    if (new Date(endIso).getTime() - new Date(startIso).getTime() < minMs) {
      setFormErr('Créneau trop court (minimum 15 minutes).');
      return;
    }
    const maxMs = 24 * 60 * 60 * 1000;
    if (new Date(endIso).getTime() - new Date(startIso).getTime() > maxMs) {
      setFormErr('Créneau trop long (maximum 24 heures).');
      return;
    }
    onChange([...slots, { startAt: startIso, endAt: endIso }]);
    setStartLocal('');
    setEndLocal('');
  }

  function quickAddDay(day: number) {
    const start = new Date(year, monthIndex, day, 9, 0, 0);
    const end = new Date(year, monthIndex, day, 18, 0, 0);
    setStartLocal(isoToDatetimeLocal(start.toISOString()));
    setEndLocal(isoToDatetimeLocal(end.toISOString()));
    setFormErr(null);
  }

  function removeSlot(toRemove: AvailabilitySlot) {
    onChange(slots.filter((x) => x.startAt !== toRemove.startAt || x.endAt !== toRemove.endAt));
  }

  const sorted = useMemo(() => {
    return [...slots].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [slots]);

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <CalendarIcon weight="light" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
        <div>
          <p className="text-xs font-medium text-zinc-900 dark:text-white">Calendrier de disponibilité</p>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            Indiquez les dates et heures où vous pouvez prendre en charge des livraisons. Les clients verront vos prochains
            créneaux sur la fiche commande.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
            aria-label="Mois précédent"
          >
            <CaretLeft weight="bold" className="h-4 w-4" />
          </button>
          <p className="text-center font-[family-name:var(--font-display)] text-sm font-semibold capitalize text-zinc-900 dark:text-white">
            {title}
          </p>
          <button
            type="button"
            onClick={nextMonth}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
            aria-label="Mois suivant"
          >
            <CaretRight weight="bold" className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`e-${i}`} className="aspect-square min-h-[2.25rem]" />;
            }
            const n = countSlotsOnDay(slots, year, monthIndex, day);
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === monthIndex &&
              new Date().getDate() === day;
            return (
              <button
                key={`${year}-${monthIndex}-${day}`}
                type="button"
                onClick={() => quickAddDay(day)}
                className={`relative flex aspect-square min-h-[2.25rem] flex-col items-center justify-center rounded-xl border text-xs transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96] ${
                  isToday
                    ? 'border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-900 dark:text-emerald-100'
                    : 'border-transparent bg-white/80 text-zinc-800 hover:border-zinc-200 dark:bg-white/[0.05] dark:text-zinc-100 dark:hover:border-white/10'
                }`}
              >
                <span>{day}</span>
                {n > 0 ? (
                  <span className="mt-0.5 font-mono text-[9px] tabular-nums text-emerald-600 dark:text-emerald-400">
                    {n} cr.
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          Astuce : cliquer un jour préremplit une plage 9h–18h (modifiable ci-dessous).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="slot-start" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Début du créneau
          </label>
          <input
            id="slot-start"
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="slot-end" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Fin du créneau
          </label>
          <input
            id="slot-end"
            type="datetime-local"
            value={endLocal}
            onChange={(e) => setEndLocal(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-emerald-500/40 dark:border-white/[0.08] dark:bg-black/40 dark:text-white"
          />
        </div>
      </div>

      {formErr ? (
        <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {formErr}
        </p>
      ) : null}

      <button
        type="button"
        onClick={addSlotFromForm}
        className="rounded-full border border-zinc-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-800 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-50 active:scale-[0.98] dark:border-white/12 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
      >
        Ajouter le créneau
      </button>

      {sorted.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Créneaux enregistrés ({sorted.length})
          </p>
          <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 dark:divide-white/[0.06] dark:border-white/[0.06]">
            {sorted.map((s, idx) => (
                <li
                  key={`${s.startAt}-${s.endAt}-${s.id ?? idx}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                  style={{ transition: `opacity 0.35s cubic-bezier(${ease.join(',')})` }}
                >
                  <div className="min-w-0 text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium text-zinc-900 dark:text-white">{fmt.format(new Date(s.startAt))}</span>
                    <span className="mx-2 text-zinc-400">→</span>
                    <span>{fmt.format(new Date(s.endAt))}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlot(s)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    <Trash weight="light" className="h-4 w-4" aria-hidden />
                    Retirer
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Aucun créneau pour l’instant — ajoutez-en au moins un pour plus de clarté.</p>
      )}
    </div>
  );
}

/** Durée totale de la sonnerie lors d'une nouvelle notification (navigateur). */

export const NOTIFICATION_RING_MIN_SEC = 20;
export const NOTIFICATION_RING_MAX_SEC = 60;
export const NOTIFICATION_RING_DEFAULT_SEC = 20;

const STORAGE_KEY = 'loban_notification_ring_duration_sec';

function clampSec(sec: number): number {
  const n = Math.round(Number(sec));
  if (Number.isNaN(n)) return NOTIFICATION_RING_DEFAULT_SEC;
  return Math.min(NOTIFICATION_RING_MAX_SEC, Math.max(NOTIFICATION_RING_MIN_SEC, n));
}

export function getNotificationRingDurationSec(): number {
  if (typeof window === 'undefined') return NOTIFICATION_RING_DEFAULT_SEC;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return NOTIFICATION_RING_DEFAULT_SEC;
    return clampSec(parseInt(raw, 10));
  } catch {
    return NOTIFICATION_RING_DEFAULT_SEC;
  }
}

export function setNotificationRingDurationSec(sec: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(clampSec(sec)));
  } catch {
    /* ignore */
  }
}

let ringCleanup: (() => void) | null = null;

export function stopNotificationRing(): void {
  ringCleanup?.();
  ringCleanup = null;
}

/**
 * Joue une séquence de signaux discrets jusqu'à la fin de la durée choisie.
 * Peut échouer silencieusement si le navigateur bloque l'audio sans interaction utilisateur.
 */
export function playNotificationRing(durationSec?: number): void {
  stopNotificationRing();

  const totalMs = clampSec(durationSec ?? getNotificationRingDurationSec()) * 1000;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();

  function playOneDing(): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    osc.start(t);
    osc.stop(t + 0.33);

    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.frequency.setValueAtTime(1320, t + 0.12);
    g2.gain.setValueAtTime(0.0001, t + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.06, t + 0.15);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    osc2.start(t + 0.12);
    osc2.stop(t + 0.39);
  }

  const endAt = Date.now() + totalMs;

  let intervalId = 0;
  let timeoutId = 0;
  let finished = false;

  const cleanup = (): void => {
    if (finished) return;
    finished = true;
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    void ctx.close().catch(() => {
      /* déjà fermé */
    });
    ringCleanup = null;
  };

  ringCleanup = cleanup;

  void ctx.resume().then(() => {
    playOneDing();
  });

  intervalId = window.setInterval(() => {
    if (Date.now() >= endAt) {
      cleanup();
      return;
    }
    playOneDing();
  }, 1700);

  timeoutId = window.setTimeout(() => {
    cleanup();
  }, totalMs);
}

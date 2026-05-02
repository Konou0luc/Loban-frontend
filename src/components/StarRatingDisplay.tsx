import { Star } from '@phosphor-icons/react';

type Props = {
  value: number;
  showNumber?: boolean;
  className?: string;
};

export function StarRatingDisplay({ value, showNumber = true, className = '' }: Props) {
  const clamped = Math.min(5, Math.max(0, value));
  const filledCount = Math.round(clamped);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            weight={i < filledCount ? 'fill' : 'light'}
            className={`h-4 w-4 shrink-0 ${i < filledCount ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'}`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="font-mono text-sm tabular-nums text-zinc-700 dark:text-zinc-300">
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  );
}

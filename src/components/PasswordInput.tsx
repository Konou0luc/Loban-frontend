import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Classes Tailwind du champ (ex. constante `field` des pages auth) */
  inputClassName: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
};

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  inputClassName,
  required,
  minLength,
  autoComplete,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClassName} pr-12`}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeSlash weight="light" className="h-5 w-5" aria-hidden />
          ) : (
            <Eye weight="light" className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

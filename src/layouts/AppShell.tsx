import { ShellNav } from '../components/ShellNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#050505]">
      <ShellNav />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pt-28">{children}</div>
    </div>
  );
}

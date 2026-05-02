import { Toaster } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export function LobanToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-center"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  );
}

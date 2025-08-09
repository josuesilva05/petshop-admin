import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <BrowserRouter>
      <SidebarProvider>
        {children}
        <Toaster />
      </SidebarProvider>
    </BrowserRouter>
  );
}

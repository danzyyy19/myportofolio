import type { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-serif', // Keeping variable name as serif for tailwind config compatibility, but it's a display font
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Dani — Staff Administrasi & Developer',
  description: 'Staff Administrasi berpengalaman di Manufaktur & Pergudangan dengan keahlian IT & pemrograman. Spesialis otomasi data, pelaporan produksi, dan pengembangan web.',
  keywords: ['portfolio', 'staff administrasi', 'developer', 'manufaktur', 'pergudangan', 'Dani'],
  authors: [{ name: 'Dani' }],
  openGraph: {
    title: 'Dani — Staff Administrasi & Developer',
    description: 'Staff Administrasi berpengalaman di Manufaktur & Pergudangan dengan keahlian IT & pemrograman.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark">
          {children}
          <Toaster 
            position="top-center" 
            richColors 
            toastOptions={{
              className: 'font-mono text-sm border-border',
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))'
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

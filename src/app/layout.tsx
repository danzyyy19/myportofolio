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
  title: 'PortofolioBuilder — The Ultimate Developer Portfolio',
  description: 'Platform pembuatan portofolio khusus untuk developer dan desainer. Fokus pada karya, kami yang urus desain dan hostingnya.',
  keywords: ['portfolio', 'developer', 'designer', 'saas', 'builder', 'website'],
  authors: [{ name: 'PortofolioBuilder' }],
  openGraph: {
    title: 'PortofolioBuilder — The Ultimate Developer Portfolio',
    description: 'Platform pembuatan portofolio khusus untuk developer dan desainer.',
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

import { Toaster } from '@workspace/ui/components/sonner';
import '@workspace/ui/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { DM_Sans, Geist_Mono, Space_Grotesk } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Providers } from '@/components/providers';

const fontSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} overflow-hidden overscroll-none font-sans antialiased`}
      >
        <NextTopLoader showSpinner={false} color='var(--primary)' />
        <Toaster richColors />
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: 'var(--primary)'
            }
          }}
        >
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}

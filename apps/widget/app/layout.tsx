import { Toaster } from '@workspace/ui/components/sonner';
import '@workspace/ui/globals.css';
import { DM_Sans, Geist_Mono, Space_Grotesk } from 'next/font/google';
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
        <Toaster richColors />
        <Providers>
          <div className='h-screen w-screen'>{children}</div>
        </Providers>
      </body>
    </html>
  );
}

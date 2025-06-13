import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/provider/convexProviderWithClerk'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boost Health Initiative',
  description: 'Empowering communities through health and education in rural Uganda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[#fcfaf8] relative flex min-h-screen flex-col font-['Lexend','Noto Sans',sans-serif] overflow-x-hidden"}>
        <ClerkProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

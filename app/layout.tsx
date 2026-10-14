import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ConvexClientProvider from '@/provider/convexProviderWithClerk'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Boost Health Initiative',
    template: '%s | Boost Health Initiative',
  },
  description: 'Boost Health Initiative (BHI) is a non-profit in Kayunga, Uganda, providing vital health programs like immunization, antenatal care, and adolescent health. Supporting rural communities through Suubi Medical Centre.',
  metadataBase: new URL('https://www.boosthealthinitiative.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Boost Health Initiative',
    locale: 'en_UG',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Ensure we have the required environment variables
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    console.error('❌ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
              <p className="text-gray-600">Missing Clerk configuration. Please check environment variables.</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className + " bg-[#fcfaf8] flex min-h-screen flex-col font-['Lexend','Noto Sans',sans-serif]"}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>  
        </ClerkProvider>
      </body>
    </html>
  );
}

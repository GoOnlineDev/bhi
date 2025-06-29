import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/provider/convexProviderWithClerk'
import ClerkDebugger from '@/components/ClerkDebugger'
import AuthTester from '@/components/AuthTester'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Boost Health Initiative',
  description: 'Empowering communities through health and education in rural Uganda.',
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

  console.log('🔧 Clerk Key Type:', clerkPublishableKey.startsWith('pk_live_') ? 'PRODUCTION' : 'DEVELOPMENT');

  return (
    <html lang="en">
      <body className={inter.className + " bg-[#fcfaf8] relative flex min-h-screen flex-col font-['Lexend','Noto Sans',sans-serif] overflow-x-hidden"}>
        <ClerkProvider
          publishableKey={clerkPublishableKey}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#f37c1b] hover:bg-orange-500',
              footerActionLink: 'text-[#f37c1b] hover:text-orange-500'
            }
          }}
        >
          <ConvexClientProvider>
            {children}
            <ClerkDebugger />
            <AuthTester />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

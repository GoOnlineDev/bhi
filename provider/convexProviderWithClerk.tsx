'use client'

import { ReactNode, useEffect } from 'react'
import { ConvexReactClient, useMutation } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth, useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

function UserInitializer() {
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // In production, we might need to wait for the token to be available
      const initializeUser = async () => {
        try {
          // Get the JWT token to ensure it's available
          const token = await getToken();
          if (token) {
            await createOrGetUser();
          }
        } catch (error) {
          console.error("Failed to create or get user:", error);
          
          // Log additional debug info in development
          if (process.env.NODE_ENV === 'development') {
            console.log('User object:', user);
            console.log('Auth state:', { isSignedIn });
          }
        }
      };

      initializeUser();
    }
  }, [isSignedIn, user, createOrGetUser, getToken]);

  return null;
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserInitializer />
      {children}
    </ConvexProviderWithClerk>
  )
}
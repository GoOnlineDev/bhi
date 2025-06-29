"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function ClerkDebugger() {
  const { isLoaded: authLoaded, userId, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Check for common environment variable issues
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    setDebugInfo({
      // Clerk Status
      authLoaded,
      userLoaded,
      userId,
      isSignedIn,
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses?.map(email => email.emailAddress),
      } : null,
      
      // Environment Variables
      clerkPublishableKey: clerkKey ? clerkKey.substring(0, 20) + '...' : 'MISSING',
      clerkKeyType: clerkKey?.startsWith('pk_live_') ? 'PRODUCTION' : clerkKey?.startsWith('pk_test_') ? 'DEVELOPMENT' : 'INVALID',
      convexUrl: convexUrl || 'MISSING',
      nodeEnv: process.env.NODE_ENV,
      
      // URLs and Paths
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'server',
      
      // Timing
      timestamp: new Date().toISOString(),
      
      // Potential Issues
      issues: [
        !clerkKey && '❌ CLERK_PUBLISHABLE_KEY missing',
        clerkKey && !clerkKey.startsWith('pk_') && '❌ Invalid Clerk key format',
        !convexUrl && '❌ CONVEX_URL missing',
        !authLoaded && '⚠️ Clerk not loading',
        authLoaded && !isSignedIn && '⚠️ User not signed in',
      ].filter(Boolean),
    });
  }, [authLoaded, userLoaded, userId, isSignedIn, user]);

  // Show in development or when there are issues
  const shouldShow = process.env.NODE_ENV === 'development' || !authLoaded || debugInfo.issues?.length > 0;
  
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-lg z-50 border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-300">🔍 Clerk Debug Info</h3>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-300 hover:text-blue-100 text-xs"
        >
          🔄 Reload
        </button>
      </div>
      
      {debugInfo.issues?.length > 0 && (
        <div className="mb-3 p-2 bg-red-900/50 rounded border border-red-500">
          <h4 className="font-bold text-red-300 mb-1">Issues Found:</h4>
          {debugInfo.issues.map((issue: string, index: number) => (
            <div key={index} className="text-red-200">{issue}</div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <strong className="text-green-300">Status:</strong>
          <div>Auth Loaded: {authLoaded ? '✅' : '❌'}</div>
          <div>User Loaded: {userLoaded ? '✅' : '❌'}</div>
          <div>Signed In: {isSignedIn ? '✅' : '❌'}</div>
        </div>
        <div>
          <strong className="text-blue-300">Environment:</strong>
          <div>Node: {debugInfo.nodeEnv}</div>
          <div>Clerk: {debugInfo.clerkKeyType}</div>
          <div>Convex: {debugInfo.convexUrl ? '✅' : '❌'}</div>
        </div>
      </div>
      
      <details className="mt-2">
        <summary className="cursor-pointer text-gray-300 hover:text-white">
          📋 Full Debug Data
        </summary>
        <pre className="whitespace-pre-wrap overflow-auto max-h-40 mt-2 text-xs bg-gray-900 p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
      
      <div className="mt-2 text-yellow-300 text-xs">
        <p>💡 <strong>Next Steps:</strong></p>
        <p>1. Check browser console for errors</p>
        <p>2. Verify environment variables in deployment</p>
        <p>3. Check Clerk Dashboard production settings</p>
        <p>4. Ensure domain is allowlisted in Clerk</p>
      </div>
    </div>
  );
} 
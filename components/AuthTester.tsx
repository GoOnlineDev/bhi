"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

export default function AuthTester() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [convexResult, setConvexResult] = useState<any>(null);
  const debugAuth = useMutation(api.users.debugAuth);
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  const testToken = async () => {
    try {
      // Get the JWT token with the correct template
      const token = await getToken({ template: "convex" });
      console.log("🔍 Raw token:", token);

      if (token) {
        // Decode JWT manually (just for debugging - don't do this in production)
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        
        setTokenInfo({
          hasToken: !!token,
          tokenLength: token.length,
          payload: payload,
          header: JSON.parse(atob(parts[0])),
        });

        console.log("🔍 Decoded JWT payload:", payload);
      } else {
        setTokenInfo({ hasToken: false, error: "No token received" });
      }
    } catch (error) {
      console.error("❌ Token test failed:", error);
      setTokenInfo({ error: error.message });
    }
  };

  const testConvexAuth = async () => {
    try {
      console.log("🔍 Testing Convex auth...");
      const result = await debugAuth();
      setConvexResult(result);
      console.log("✅ Convex auth result:", result);
    } catch (error) {
      console.error("❌ Convex auth failed:", error);
      setConvexResult({ error: error.message });
    }
  };

  const testCreateUser = async () => {
    try {
      console.log("🔍 Testing user creation...");
      const result = await createOrGetUser();
      setConvexResult({ ...convexResult, userCreation: result });
      console.log("✅ User creation result:", result);
    } catch (error) {
      console.error("❌ User creation failed:", error);
      setConvexResult({ ...convexResult, userCreationError: error.message });
    }
  };

  // Only show for signed-in users
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-3 text-gray-800">🔧 Auth Tester</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <strong>User:</strong> {user?.firstName} {user?.lastName}
        </div>
        <div className="text-sm">
          <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
        </div>
        <div className="text-sm">
          <strong>Signed In:</strong> {isSignedIn ? '✅' : '❌'}
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={testToken}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Test JWT Token
        </button>
        
        <button
          onClick={testConvexAuth}
          className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Test Convex Auth
        </button>
        
        <button
          onClick={testCreateUser}
          className="w-full bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
        >
          Test User Creation
        </button>
      </div>

      {tokenInfo && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium">JWT Token Info</summary>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </details>
      )}

      {convexResult && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium">Convex Result</summary>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(convexResult, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
} 
"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { Lock, Shield, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <Authenticated>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Image 
                src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
              <h1 className="text-2xl font-bold text-[#1c140d]">Dashboard</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
          <AuthenticatedContent />
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png" 
                  alt="Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1c140d] mb-4">
                Welcome to Boost Health Initiative Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Sign in to access the dashboard and manage content
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Secure Access</h3>
                  <p className="text-sm text-gray-600">Protected dashboard with secure authentication</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Role-Based Access</h3>
                  <p className="text-sm text-gray-600">Different permissions for different roles</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 bg-[#f37c1b]/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#f37c1b]" />
                  </div>
                  <h3 className="font-semibold text-[#1c140d] mb-2">Team Collaboration</h3>
                  <p className="text-sm text-gray-600">Work together to manage content</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignInButton mode="modal">
                    <button className="flex-1 bg-[#f37c1b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff9d4d] transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex-1 bg-white border-2 border-[#f37c1b] text-[#f37c1b] px-6 py-3 rounded-lg font-semibold hover:bg-[#f37c1b]/5 transition-colors">
                      Create Account
                    </button>
                  </SignUpButton>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Need help? Contact support at support@boosthealthinitiative.org</p>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}

function AuthenticatedContent() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1c140d] mb-2">Upload Images</h2>
          <p className="text-gray-600 mb-4">Upload images for news articles and programs</p>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
        
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}

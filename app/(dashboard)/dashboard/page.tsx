"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "@/utils/uploadthing";

export default function Dashboard() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <AuthenticatedContent />
      </Authenticated>
      <Unauthenticated>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          <h2>Please sign in or sign up to access the dashboard.</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

function AuthenticatedContent() {

  return (
    <div>
      <h1>Welcome to the app</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      
    </div>
  );
}

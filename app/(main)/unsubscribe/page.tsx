"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

function UnsubscribeInner() {
  const token = useSearchParams().get("token") ?? "";
  const unsubscribe = useMutation(api.subscribers.unsubscribe);
  const [state, setState] = useState<"idle" | "loading" | "done" | "notfound" | "error">("idle");

  async function confirm() {
    setState("loading");
    try {
      const res = await unsubscribe({ token });
      setState(res.status === "unsubscribed" ? "done" : "notfound");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Email updates</h1>
      {!token && <p className="text-muted-foreground">This unsubscribe link is incomplete. Please use the link from one of our emails.</p>}
      {token && state === "idle" && (
        <>
          <p className="text-muted-foreground mb-6">Stop receiving news and programme emails from Boost Health Initiative?</p>
          <Button onClick={confirm}>Unsubscribe</Button>
        </>
      )}
      {state === "loading" && <p>Working…</p>}
      {state === "done" && <p>You have been unsubscribed. You won&apos;t receive further update emails.</p>}
      {state === "notfound" && <p>This email is already unsubscribed or the link has expired.</p>}
      {state === "error" && <p className="text-red-600">Something went wrong. Please try again later.</p>}
      <Link href="/" className="inline-block mt-8 text-primary underline">Back to home</Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <UnsubscribeInner />
    </Suspense>
  );
}

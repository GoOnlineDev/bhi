'use client';

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EDITOR_ROLES } from "@/convex/roles";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock } from "lucide-react";

/** UI-only gate; Convex functions enforce the same roles server-side. */
export default function DashboardAccessGate({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!currentUser || !EDITOR_ROLES.includes(currentUser.role)) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">No dashboard access</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn&apos;t have editor or admin access. Ask an administrator to update your role.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to website</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

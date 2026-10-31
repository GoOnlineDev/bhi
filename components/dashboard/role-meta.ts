import type { LucideIcon } from "lucide-react";
import { Crown, PenSquare, ShieldCheck, Stethoscope, User } from "lucide-react";
import type { Role } from "@/convex/roles";

export const ROLE_META: Record<Role, { label: string; description: string; icon: LucideIcon; badgeClass: string }> = {
  superadmin: {
    label: "Super admin",
    description: "Full access, including managing admins.",
    icon: Crown,
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  admin: {
    label: "Admin",
    description: "Publishes content and manages editors and members.",
    icon: ShieldCheck,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  editor: {
    label: "Editor",
    description: "Creates and edits content; publishing needs approval.",
    icon: PenSquare,
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
  },
  doctor: {
    label: "Doctor",
    description: "Clinical staff account. No dashboard access.",
    icon: Stethoscope,
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  patient: {
    label: "Member",
    description: "Public website account. No dashboard access.",
    icon: User,
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

import { v } from "convex/values";

export const ROLES = ["superadmin", "admin", "editor", "doctor", "patient"] as const;
export type Role = (typeof ROLES)[number];

export const ADMIN_ROLES: readonly Role[] = ["admin", "superadmin"];
export const EDITOR_ROLES: readonly Role[] = ["editor", "admin", "superadmin"];

export const roleValidator = v.union(
  v.literal("admin"),
  v.literal("patient"),
  v.literal("doctor"),
  v.literal("superadmin"),
  v.literal("editor")
);

/** Admins manage non-admin roles; only superadmins can touch admin-level roles. */
export function canManageRole(actor: Role, role: Role): boolean {
  return actor === "superadmin" || (actor === "admin" && !ADMIN_ROLES.includes(role));
}

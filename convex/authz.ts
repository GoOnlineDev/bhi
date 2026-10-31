import type { QueryCtx } from "./_generated/server";
import { ADMIN_ROLES, EDITOR_ROLES } from "./roles";

export async function getSignedInUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

/** Returns true when the caller is a signed-in editor/admin/superadmin. */
export async function isContentEditor(ctx: QueryCtx): Promise<boolean> {
  const user = await getSignedInUser(ctx);
  return !!user && EDITOR_ROLES.includes(user.role);
}

/** The signed-in admin/superadmin, or null for anyone else. */
export async function getAdmin(ctx: QueryCtx) {
  const user = await getSignedInUser(ctx);
  return user && ADMIN_ROLES.includes(user.role) ? user : null;
}

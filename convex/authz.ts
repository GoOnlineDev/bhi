import type { QueryCtx } from "./_generated/server";

const EDITOR_ROLES = ["editor", "admin", "superadmin"];

/** Returns true when the caller is a signed-in editor/admin/superadmin. */
export async function isContentEditor(ctx: QueryCtx): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return false;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  return !!user && EDITOR_ROLES.includes(user.role);
}

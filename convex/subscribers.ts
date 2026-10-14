import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { isContentEditor } from "./authz";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Internal: used by the email actions only. Never exposed to the browser. */
export const listForMailing = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("subscribers").collect();
    return rows.map((r) => ({ _id: r._id, email: r.email, unsubscribeToken: r.unsubscribeToken }));
  },
});

/** Internal: give legacy subscribers (created before tokens existed) a token. */
export const ensureToken = internalMutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, { id }) => {
    const row = await ctx.db.get(id);
    if (!row) return null;
    if (row.unsubscribeToken) return row.unsubscribeToken;
    const token = newToken();
    await ctx.db.patch(id, { unsubscribeToken: token });
    return token;
  },
});

/** Dashboard: editors/admins only. Previously this was a public query that leaked every subscriber email. */
export const getAllSubscribers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isContentEditor(ctx))) return [];
    const rows = await ctx.db.query("subscribers").order("desc").collect();
    return rows.map((r) => ({ _id: r._id, email: r.email, createdAt: r.createdAt }));
  },
});

export const addSubscriber = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      throw new Error("Please enter a valid email address.");
    }
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) return { status: "already_subscribed" as const };
    await ctx.db.insert("subscribers", {
      email,
      createdAt: Date.now(),
      unsubscribeToken: newToken(),
    });
    return { status: "subscribed" as const };
  },
});

/** One-click unsubscribe from the link in every newsletter email. */
export const unsubscribe = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (!token) return { status: "invalid" as const };
    const row = await ctx.db
      .query("subscribers")
      .withIndex("by_unsubscribeToken", (q) => q.eq("unsubscribeToken", token))
      .first();
    if (!row) return { status: "not_found" as const };
    await ctx.db.delete(row._id);
    return { status: "unsubscribed" as const };
  },
});

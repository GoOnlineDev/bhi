import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", identity.subject as string)
      )
      .unique();

    if (user) {
      // If the user exists, return their ID
      return user._id;
    }

    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject as string,
      email: identity.email!,
      firstName: identity.givenName ?? undefined,
      lastName: identity.familyName ?? undefined,
      imageUrl: typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined,
      role: "user"
    });

    return userId;
  },
}); 
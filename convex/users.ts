import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    // In production with JWT, the structure is different
    // Access claims directly from the identity object with proper type casting
    const clerkId = String(identity.subject || identity.id);
    const email = String(identity.email);
    const firstName = identity.firstName ? String(identity.firstName) : (identity.name ? String(identity.name) : undefined);
    const lastName = identity.lastName ? String(identity.lastName) : (identity.surname ? String(identity.surname) : undefined);
    const imageUrl = identity.imageUrl ? String(identity.imageUrl) : undefined;

    if (!clerkId || !email) {
      throw new Error("Missing required user data from JWT token");
    }

    // Check if the user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) =>
        q.eq("clerkId", clerkId)
      )
      .unique();

    if (user) {
      // If the user exists, update their info in case it changed
      await ctx.db.patch(user._id, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      });
      return user._id;
    }

    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: clerkId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
      role: "patient"
    });

    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    // Use the correct claim field for production JWT with proper type casting
    const clerkId = String(identity.subject || identity.id);
    if (!clerkId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
      .unique();
    return user;
  },
}); 
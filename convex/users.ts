import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Step 1: Debug authentication - as per Convex debugging guide
    console.log("🔍 DEBUG: Server identity", await ctx.auth.getUserIdentity());
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("❌ No identity found - user not authenticated");
      throw new Error("Called createOrGetUser without authentication");
    }

    console.log("✅ Identity found:", {
      subject: identity.subject,
      id: identity.id,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      name: identity.name,
      surname: identity.surname,
      imageUrl: identity.imageUrl,
      allKeys: Object.keys(identity)
    });

    // In production with JWT, the structure is different
    // Access claims directly from the identity object with proper type casting
    const clerkId = String(identity.subject || identity.id);
    const email = String(identity.email);
    const firstName = identity.firstName ? String(identity.firstName) : (identity.name ? String(identity.name) : undefined);
    const lastName = identity.lastName ? String(identity.lastName) : (identity.surname ? String(identity.surname) : undefined);
    const imageUrl = identity.imageUrl ? String(identity.imageUrl) : undefined;

    console.log("🔧 Parsed user data:", { clerkId, email, firstName, lastName, imageUrl });

    if (!clerkId || !email) {
      console.log("❌ Missing required data:", { clerkId: !!clerkId, email: !!email });
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
      console.log("👤 User exists, updating:", user._id);
      // If the user exists, update their info in case it changed
      await ctx.db.patch(user._id, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      });
      return user._id;
    }

    console.log("🆕 Creating new user");
    // If the user doesn't exist, create a new one
    const userId = await ctx.db.insert("users", {
      clerkId: clerkId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
      role: "patient"
    });

    console.log("✅ User created successfully:", userId);
    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    console.log("🔍 DEBUG: Getting current user, identity:", await ctx.auth.getUserIdentity());
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    // Use the correct claim field for production JWT with proper type casting
    const clerkId = String(identity.subject || identity.id);
    if (!clerkId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", clerkId))
      .unique();
    
    console.log("👤 Found user:", user ? user._id : "null");
    return user;
  },
});

// Add a test mutation to debug JWT token structure
export const debugAuth = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("🐛 FULL DEBUG - Raw identity object:", JSON.stringify(identity, null, 2));
    return {
      hasIdentity: !!identity,
      identity: identity,
      timestamp: Date.now()
    };
  },
}); 
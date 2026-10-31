import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getAdmin } from "./authz";
import { canManageRole, roleValidator } from "./roles";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_ONLY = "Only a super admin can manage admin roles.";

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
    const email = normalizeEmail(String(identity.email));
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

    // Only honour an invite when Clerk reports the email as verified.
    const invite = identity.emailVerified === false
      ? null
      : await ctx.db.query("userInvites").withIndex("by_email", (q) => q.eq("email", email)).first();
    if (invite) await ctx.db.delete(invite._id);

    if (user) {
      // If the user exists, update their info in case it changed
      await ctx.db.patch(user._id, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
        ...(invite ? { role: invite.role } : {}),
      });
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: clerkId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
      role: invite?.role ?? "patient",
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

/** Users and pending invites for the admin Users page; null for non-admins. */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdmin(ctx);
    if (!admin) return null;
    const users = await ctx.db.query("users").order("desc").collect();
    const invites = await ctx.db.query("userInvites").order("desc").collect();
    return {
      me: { _id: admin._id, role: admin.role },
      users: users.map(({ _id, _creationTime, email, firstName, lastName, imageUrl, role }) => ({
        _id, _creationTime, email, firstName, lastName, imageUrl, role,
      })),
      invites: invites.map(({ _id, _creationTime, email, role }) => ({ _id, _creationTime, email, role })),
    };
  },
});

export const updateUserRole = mutation({
  args: { userId: v.id("users"), role: roleValidator },
  handler: async (ctx, { userId, role }) => {
    const admin = await getAdmin(ctx);
    if (!admin) throw new ConvexError("Only admins can change roles.");
    if (admin._id === userId) throw new ConvexError("You can't change your own role.");
    const target = await ctx.db.get(userId);
    if (!target) throw new ConvexError("User not found.");
    if (!canManageRole(admin.role, target.role) || !canManageRole(admin.role, role)) {
      throw new ConvexError(ADMIN_ONLY);
    }
    await ctx.db.patch(userId, { role });
  },
});

/** Gives an existing account a role, or records an invite applied when they first sign in. */
export const addUser = mutation({
  args: { email: v.string(), role: roleValidator },
  handler: async (ctx, args) => {
    const admin = await getAdmin(ctx);
    if (!admin) throw new ConvexError("Only admins can add users.");
    const email = normalizeEmail(args.email);
    if (!EMAIL_RE.test(email)) throw new ConvexError("Enter a valid email address.");
    if (!canManageRole(admin.role, args.role)) throw new ConvexError(ADMIN_ONLY);

    const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", email)).first();
    if (existing) {
      if (existing._id === admin._id) throw new ConvexError("You can't change your own role.");
      if (!canManageRole(admin.role, existing.role)) throw new ConvexError(ADMIN_ONLY);
      await ctx.db.patch(existing._id, { role: args.role });
      return { status: "updated" as const };
    }

    const invite = await ctx.db.query("userInvites").withIndex("by_email", (q) => q.eq("email", email)).first();
    if (invite) {
      if (!canManageRole(admin.role, invite.role)) throw new ConvexError(ADMIN_ONLY);
      await ctx.db.patch(invite._id, { role: args.role, invitedBy: admin._id });
    } else {
      await ctx.db.insert("userInvites", { email, role: args.role, invitedBy: admin._id });
    }
    return { status: "invited" as const };
  },
});

export const revokeInvite = mutation({
  args: { inviteId: v.id("userInvites") },
  handler: async (ctx, { inviteId }) => {
    const admin = await getAdmin(ctx);
    if (!admin) throw new ConvexError("Only admins can revoke invites.");
    const invite = await ctx.db.get(inviteId);
    if (!invite) return;
    if (!canManageRole(admin.role, invite.role)) throw new ConvexError(ADMIN_ONLY);
    await ctx.db.delete(inviteId);
  },
});

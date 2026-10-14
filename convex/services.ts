import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { isContentEditor } from "./authz";

// Get all published services
export const getPublishedServices = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .withIndex("by_isPublished", q => q.eq("isPublished", true))
      .order("desc")
      .collect();
  },
});

// Get a single service by its id
export const getServiceById = query({
  args: { id: v.id("services") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) return null;
    if (!item.isPublished && !(await isContentEditor(ctx))) return null;
    return item;
  },
});

// Get published services by category
export const getPublishedServicesByCategory = query({
  args: { category: v.string() },
  returns: v.array(v.any()),
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query("services")
      .withIndex("by_category", q => q.eq("category", category))
      .order("desc")
      .collect();
  },
});

// Get featured published services
export const getFeaturedServices = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .withIndex("by_isFeatured", q => q.eq("isFeatured", true))
      .order("desc")
      .collect();
  },
});

/**
 * Spotlight services for Home + About pillar sections.
 * Priority: published + showOnHome → published + featured → up to 6 published (newest).
 */
export const getSpotlightServices = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const homeMarked = await ctx.db
      .query("services")
      .withIndex("by_isPublished_showOnHome", (q) =>
        q.eq("isPublished", true).eq("showOnHome", true),
      )
      .collect();

    const sortByOrder = (a: Doc<"services">, b: Doc<"services">) => {
      const ao = a.order ?? 9999;
      const bo = b.order ?? 9999;
      if (ao !== bo) return ao - bo;
      return b._creationTime - a._creationTime;
    };

    if (homeMarked.length > 0) {
      return [...homeMarked].sort(sortByOrder);
    }

    const featured = await ctx.db
      .query("services")
      .withIndex("by_isFeatured", (q) => q.eq("isFeatured", true))
      .collect();

    const publishedFeatured = featured.filter((s) => s.isPublished);
    if (publishedFeatured.length > 0) {
      return [...publishedFeatured].sort(sortByOrder);
    }

    return await ctx.db
      .query("services")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(6);
  },
});

// Get all services (dashboard)
export const getAllServices = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    if (!(await isContentEditor(ctx))) return [];
    return await ctx.db.query("services").order("desc").collect();
  },
});

// Create service mutation
export const createService = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    shortTitle: v.optional(v.string()),
    description: v.string(),
    overview: v.optional(v.string()),
    category: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    images: v.array(v.string()),
    videos: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
    }))),
    benefits: v.optional(v.array(v.string())),
    process: v.optional(v.array(v.string())),
    stats: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    showOnHome: v.optional(v.boolean()),
    order: v.optional(v.number()),
    contactPerson: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  returns: v.id("services"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    if (!["editor", "admin", "superadmin"].includes(user.role)) {
      throw new Error("You do not have permission to create services");
    }

    // Only admin and superadmin can publish directly
    let isPublished = false;
    if (args.isPublished && ["admin", "superadmin"].includes(user.role)) {
      isPublished = true;
    }

    const serviceId = await ctx.db.insert("services", {
      title: args.title,
      slug: args.slug,
      shortTitle: args.shortTitle,
      description: args.description,
      overview: args.overview,
      category: args.category,
      heroImage: args.heroImage,
      images: args.images,
      videos: args.videos,
      features: args.features,
      benefits: args.benefits,
      process: args.process,
      stats: args.stats,
      tags: args.tags,
      isPublished,
      isFeatured: args.isFeatured ?? false,
      showOnHome: args.showOnHome ?? false,
      order: args.order,
      contactPerson: args.contactPerson,
      contactPhone: args.contactPhone,
      contactEmail: args.contactEmail,
      createdAt: Date.now(),
    });
    return serviceId;
  },
});

// Update service mutation
export const updateService = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    shortTitle: v.optional(v.string()),
    description: v.optional(v.string()),
    overview: v.optional(v.string()),
    category: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
    }))),
    benefits: v.optional(v.array(v.string())),
    process: v.optional(v.array(v.string())),
    stats: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    showOnHome: v.optional(v.boolean()),
    order: v.optional(v.number()),
    contactPerson: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    if (!["editor", "admin", "superadmin"].includes(user.role)) {
      throw new Error("You do not have permission to update services");
    }

    const service = await ctx.db.get(args.id);
    if (!service) throw new Error("Service not found");

    const patchData: Partial<Doc<"services">> = {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.slug !== undefined && { slug: args.slug }),
      ...(args.shortTitle !== undefined && { shortTitle: args.shortTitle }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.overview !== undefined && { overview: args.overview }),
      ...(args.category !== undefined && { category: args.category }),
      ...(args.heroImage !== undefined && { heroImage: args.heroImage }),
      ...(args.images !== undefined && { images: args.images }),
      ...(args.videos !== undefined && { videos: args.videos }),
      ...(args.features !== undefined && { features: args.features }),
      ...(args.benefits !== undefined && { benefits: args.benefits }),
      ...(args.process !== undefined && { process: args.process }),
      ...(args.stats !== undefined && { stats: args.stats }),
      ...(args.tags !== undefined && { tags: args.tags }),
      ...(args.isFeatured !== undefined && { isFeatured: args.isFeatured }),
      ...(args.showOnHome !== undefined && { showOnHome: args.showOnHome }),
      ...(args.order !== undefined && { order: args.order }),
      ...(args.contactPerson !== undefined && { contactPerson: args.contactPerson }),
      ...(args.contactPhone !== undefined && { contactPhone: args.contactPhone }),
      ...(args.contactEmail !== undefined && { contactEmail: args.contactEmail }),
      updatedAt: Date.now(),
    };

    // Publish rights
    if (args.isPublished !== undefined) {
      if (["admin", "superadmin"].includes(user.role)) {
        patchData.isPublished = args.isPublished;
      } else if (service.isPublished && !args.isPublished) {
        patchData.isPublished = false;
      }
    }

    await ctx.db.patch(args.id, patchData);
    return { success: true };
  },
});

// Delete service mutation
export const deleteService = mutation({
  args: { id: v.id("services") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", q => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const service = await ctx.db.get(id);
    if (!service) throw new Error("Service not found");

    if (service.isPublished) {
      if (!["admin", "superadmin"].includes(user.role)) {
        throw new Error("Only admin or superadmin can delete published services");
      }
    } else {
      if (!["editor", "admin", "superadmin"].includes(user.role)) {
        throw new Error("You do not have permission to delete this service");
      }
    }

    await ctx.db.delete(id);
    return { success: true };
  },
});

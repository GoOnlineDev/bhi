import { query, mutation, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";

/** Matches the original hard-coded home hero (used when DB row is missing or slides are empty). */
export const DEFAULT_HERO = {
  headline: "Bringing Healthcare Closer to Communities",
  subheadline:
    "Building healthier communities through accessible healthcare, health education and strengthened community health systems.",
  primaryCtaLabel: "Our Programs",
  secondaryCtaLabel: "Partner With Us",
  primaryCtaHref: "/programs",
  secondaryCtaHref: "/contact?type=partner",
  slides: [
    {
      url: "/img/dr7i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      url: "/img/dr5i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      url: "/img/dr8i.jpg",
      alt: "A healthcare worker smiling with a community member.",
    },
    {
      url: "/img/dr6i.jpg",
      alt: "Children in Kayunga village smiling.",
    },
  ],
} as const;

const slideValidator = v.object({
  url: v.string(),
  alt: v.string(),
});

async function requireContentEditor(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new Error("User not found");
  if (!["editor", "admin", "superadmin"].includes(user.role)) {
    throw new Error("You do not have permission to change hero settings");
  }
  return user;
}

function mergeHero(
  row: {
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaHref: string;
    slides: { url: string; alt: string }[];
  } | null
) {
  if (!row) {
    return {
      headline: DEFAULT_HERO.headline,
      subheadline: DEFAULT_HERO.subheadline,
      primaryCtaLabel: DEFAULT_HERO.primaryCtaLabel,
      secondaryCtaLabel: DEFAULT_HERO.secondaryCtaLabel,
      primaryCtaHref: DEFAULT_HERO.primaryCtaHref,
      secondaryCtaHref: DEFAULT_HERO.secondaryCtaHref,
      slides: [...DEFAULT_HERO.slides],
    };
  }
  return {
    headline: row.headline.trim() || DEFAULT_HERO.headline,
    subheadline: row.subheadline.trim() || DEFAULT_HERO.subheadline,
    primaryCtaLabel: row.primaryCtaLabel.trim() || DEFAULT_HERO.primaryCtaLabel,
    secondaryCtaLabel:
      row.secondaryCtaLabel.trim() || DEFAULT_HERO.secondaryCtaLabel,
    primaryCtaHref: row.primaryCtaHref.trim() || DEFAULT_HERO.primaryCtaHref,
    secondaryCtaHref:
      row.secondaryCtaHref.trim() || DEFAULT_HERO.secondaryCtaHref,
    slides:
      row.slides.length > 0
        ? row.slides
        : [...DEFAULT_HERO.slides],
  };
}

/** Public home page — always returns a full hero payload. */
export const getPublicHero = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("heroSettings")
      .withIndex("by_singletonKey", (q) => q.eq("singletonKey", "home"))
      .unique();
    return mergeHero(row);
  },
});

/** Dashboard editor — same merged values the public site uses. */
export const getHeroForDashboard = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("heroSettings")
      .withIndex("by_singletonKey", (q) => q.eq("singletonKey", "home"))
      .unique();
    return {
      ...mergeHero(row),
      hasStoredConfig: row !== null,
    };
  },
});

export const updateHeroSettings = mutation({
  args: {
    headline: v.string(),
    subheadline: v.string(),
    primaryCtaLabel: v.string(),
    secondaryCtaLabel: v.string(),
    primaryCtaHref: v.string(),
    secondaryCtaHref: v.string(),
    slides: v.array(slideValidator),
  },
  handler: async (ctx, args) => {
    await requireContentEditor(ctx);

    if (args.slides.length === 0) {
      throw new Error("Add at least one background image.");
    }
    for (const s of args.slides) {
      if (!s.url.trim()) throw new Error("Each slide needs a valid image URL.");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("heroSettings")
      .withIndex("by_singletonKey", (q) => q.eq("singletonKey", "home"))
      .unique();

    const payload = {
      singletonKey: "home" as const,
      headline: args.headline.trim(),
      subheadline: args.subheadline.trim(),
      primaryCtaLabel: args.primaryCtaLabel.trim(),
      secondaryCtaLabel: args.secondaryCtaLabel.trim(),
      primaryCtaHref: args.primaryCtaHref.trim() || DEFAULT_HERO.primaryCtaHref,
      secondaryCtaHref:
        args.secondaryCtaHref.trim() || DEFAULT_HERO.secondaryCtaHref,
      slides: args.slides.map((s) => ({
        url: s.url.trim(),
        alt: s.alt.trim() || "Hero background",
      })),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return await ctx.db.insert("heroSettings", payload);
  },
});

import { cronJobs } from "convex/server";
import { internalAction, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

const crons = cronJobs();

crons.interval(
  "email subscribers about newly published news and programs",
  { minutes: 120 },
  internal.crons.processNewContent,
  {}
);

export default crons;

/**
 * Previous logic compared row COUNTS and only emailed the single newest row. That
 * broke when anything was deleted (counts drop, new items never trigger), emailed
 * drafts/unapproved programs, skipped all but one item per run, and re-sent nothing
 * on failure. Now each published news item / approved program is emailed exactly
 * once and stamped with `emailedAt`. Items that existed before this logic was first
 * deployed are ignored (watermark stored in cron_state) so nobody gets a backlog blast.
 */
export const processNewContent = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    const since: number = await ctx.runMutation(internal.crons.getOrInitWatermark, {});
    const pending: { news: Id<"news">[]; programs: Id<"programs">[] } = await ctx.runQuery(internal.crons.getPendingContent, { since });

    for (const n of pending.news) {
      await ctx.runAction(internal.newsemail.sendNewsEmail, { newsId: n });
      await ctx.runMutation(internal.crons.markNewsEmailed, { id: n });
    }
    for (const p of pending.programs) {
      await ctx.runAction(internal.programemail.sendProgramEmail, { programId: p });
      await ctx.runMutation(internal.crons.markProgramEmailed, { id: p });
    }
  },
});

export const getOrInitWatermark = internalMutation({
  args: {},
  handler: async (ctx) => {
    const state = await ctx.db
      .query("cron_state")
      .withIndex("by_key", (q) => q.eq("key", "emailWatermark"))
      .unique();
    if (state) return state.value as number;
    const now = Date.now();
    await ctx.db.insert("cron_state", { key: "emailWatermark", value: now });
    return now;
  },
});

export const getPendingContent = internalQuery({
  args: { since: v.number() },
  handler: async (ctx, { since }) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .filter((q) => q.and(q.eq(q.field("emailedAt"), undefined), q.gte(q.field("_creationTime"), since)))
      .collect();
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .filter((q) => q.and(q.eq(q.field("emailedAt"), undefined), q.gte(q.field("_creationTime"), since)))
      .collect();
    return { news: news.map((n) => n._id), programs: programs.map((p) => p._id) };
  },
});

export const getNewsForEmail = internalQuery({
  args: { id: v.id("news") },
  handler: async (ctx, { id }): Promise<Doc<"news"> | null> => ctx.db.get(id),
});

export const getProgramForEmail = internalQuery({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }): Promise<Doc<"programs"> | null> => ctx.db.get(id),
});

export const markNewsEmailed = internalMutation({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => {
    if (await ctx.db.get(id)) await ctx.db.patch(id, { emailedAt: Date.now() });
  },
});

export const markProgramEmailed = internalMutation({
  args: { id: v.id("programs") },
  handler: async (ctx, { id }) => {
    if (await ctx.db.get(id)) await ctx.db.patch(id, { emailedAt: Date.now() });
  },
});

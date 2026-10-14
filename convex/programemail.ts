"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { escapeHtml, sendToSubscribers, siteUrl, BATCH_SIZE, type Recipient } from "./mailer";

export const sendProgramEmail = internalAction({
  args: { programId: v.id("programs"), offset: v.optional(v.number()) },
  handler: async (ctx, { programId, offset = 0 }): Promise<{ sent: number; failed: number }> => {
    const program = await ctx.runQuery(internal.crons.getProgramForEmail, { id: programId });
    if (!program || !program.approved) return { sent: 0, failed: 0 };

    const all = await ctx.runQuery(internal.subscribers.listForMailing, {});
    const recipients = all.slice(offset, offset + BATCH_SIZE);
    if (!recipients.length) return { sent: 0, failed: 0 };
    // Large lists are sent in batches, each in its own action run, to stay inside time limits.
    if (offset + BATCH_SIZE < all.length) {
      await ctx.scheduler.runAfter(60_000, internal.programemail.sendProgramEmail, { programId, offset: offset + BATCH_SIZE });
    }
    const withTokens: Recipient[] = [];
    for (const r of recipients) {
      const token: string | null = r.unsubscribeToken ?? (await ctx.runMutation(internal.subscribers.ensureToken, { id: r._id }));
      if (token) withTokens.push({ _id: r._id, email: r.email, unsubscribeToken: token });
    }

    const fmt = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Kampala" });
    const url = `${siteUrl()}/programs/${program._id}`;
    const subject = `New Program: ${program.name}`;
    const body = `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d; max-width: 600px;">
        ${program.images?.length ? `<img src="${escapeHtml(program.images[0])}" alt="" style="max-width:100%;border-radius:8px;margin-bottom:16px;" />` : ""}
        <h2>${escapeHtml(program.name)}</h2>
        <p>${escapeHtml(program.description)}</p>
        ${program.goal ? `<p><strong>Goal:</strong> ${escapeHtml(program.goal)}</p>` : ""}
        <p><strong>Starts:</strong> ${program.startDate ? fmt(program.startDate) : "TBA"}${program.endDate ? ` &middot; <strong>Ends:</strong> ${fmt(program.endDate)}` : ""}</p>
        ${program.location ? `<p><strong>Location:</strong> ${escapeHtml(program.location)}</p>` : ""}
        <a href="${url}" style="display:inline-block;margin-top:16px;background:#f37c1b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;">Learn more</a>`;

    const text = [
      program.name,
      "",
      program.description,
      program.goal ? `Goal: ${program.goal}` : "",
      `Starts: ${program.startDate ? fmt(program.startDate) : "TBA"}${program.endDate ? ` | Ends: ${fmt(program.endDate)}` : ""}`,
      program.location ? `Location: ${program.location}` : "",
      "",
      `Learn more: ${url}`,
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
    return await sendToSubscribers(withTokens, subject, body, text);
  },
});

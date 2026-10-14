"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { escapeHtml, sendToSubscribers, siteUrl } from "./mailer";

export const sendProgramEmail = internalAction({
  args: { programId: v.id("programs") },
  handler: async (ctx, { programId }): Promise<{ sent: number; failed: number }> => {
    const program = await ctx.runQuery(internal.crons.getProgramForEmail, { id: programId });
    if (!program || !program.approved) return { sent: 0, failed: 0 };

    const recipients = await ctx.runQuery(internal.subscribers.listForMailing, {});
    if (!recipients.length) return { sent: 0, failed: 0 };
    const withTokens = [];
    for (const r of recipients) {
      const token: string | null = r.unsubscribeToken ?? (await ctx.runMutation(internal.subscribers.ensureToken, { id: r._id }));
      if (token) withTokens.push({ ...r, unsubscribeToken: token });
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

    return await sendToSubscribers(withTokens, subject, body);
  },
});

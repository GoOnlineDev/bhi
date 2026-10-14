"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { escapeHtml, sendToSubscribers, siteUrl } from "./mailer";

export const sendNewsEmail = internalAction({
  args: { newsId: v.id("news") },
  handler: async (ctx, { newsId }): Promise<{ sent: number; failed: number }> => {
    const news = await ctx.runQuery(internal.crons.getNewsForEmail, { id: newsId });
    if (!news || !news.isPublished) return { sent: 0, failed: 0 };

    const recipients = await ctx.runQuery(internal.subscribers.listForMailing, {});
    if (!recipients.length) return { sent: 0, failed: 0 };
    const withTokens = [];
    for (const r of recipients) {
      const token: string | null = r.unsubscribeToken ?? (await ctx.runMutation(internal.subscribers.ensureToken, { id: r._id }));
      if (token) withTokens.push({ ...r, unsubscribeToken: token });
    }

    const url = `${siteUrl()}/news/${news._id}`;
    const subject = `New Update: ${news.title}`;
    const body = `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d; max-width: 600px;">
        ${news.images?.length ? `<img src="${escapeHtml(news.images[0])}" alt="" style="max-width:100%;border-radius:8px;margin-bottom:16px;" />` : ""}
        <h2>${escapeHtml(news.title)}</h2>
        <p style="color:#6b7280;">${escapeHtml(news.category)}</p>
        <p>${escapeHtml(news.summary)}</p>
        <a href="${url}" style="display:inline-block;margin-top:16px;background:#f37c1b;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;">Read more</a>`;

    return await sendToSubscribers(withTokens, subject, body);
  },
});

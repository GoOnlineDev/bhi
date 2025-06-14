"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import React from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { UploadButton } from "@/utils/uploadthing";

const canEdit = (role: string) => ["editor", "admin", "superadmin"].includes(role);
const canApprove = (role: string) => ["admin", "superadmin"].includes(role);

const CATEGORY_OPTIONS = [
  "Announcements",
  "Health Tips",
  "Community Programs",
  "Medical Updates",
  "Staff Highlights",
  "Success Stories",
  "Event Recaps",
  "Policy Changes",
  "Emergency Alerts",
  "Research & Innovation"
] as const;
const INSTITUTION_OPTIONS = [
  "Boost Health Initiative",
  "Suubi Medical Centre"
] as const;

export default function NewsDashboard() {
  const createNews = useMutation(api.news.createNews);
  const deleteNews = useMutation(api.news.deleteNews);
  const updateNews = useMutation(api.news.updateNews);
  const newsList = useQuery(api.news.getPublishedNews) || [];
  const unpublishedNews = useQuery(api.news.getUnpublishedNews) || [];
  const currentUser = useQuery(api.users.getCurrentUser) || undefined;

  // Form state
  const [form, setForm] = useState({
    title: "",
    content: "",
    summary: "",
    images: [] as string[],
    category: CATEGORY_OPTIONS[0],
    startDate: Date.now(),
    endDate: undefined as number | undefined,
    institution: INSTITUTION_OPTIONS[0],
    publishedAt: Date.now(),
  });
  const [editId, setEditId] = useState<Id<"news"> | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use fallback for role to avoid undefined errors
  const userRole = currentUser?.role ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createNews({
        ...form,
        startDate: Number(form.startDate),
        endDate: form.endDate ? Number(form.endDate) : undefined,
        publishedAt: Date.now(),
      });
      setForm({
        title: "",
        content: "",
        summary: "",
        images: [],
        category: CATEGORY_OPTIONS[0],
        startDate: Date.now(),
        endDate: undefined,
        institution: INSTITUTION_OPTIONS[0],
        publishedAt: Date.now(),
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: Id<"news">) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      await deleteNews({ id });
    }
  };

  const handleEdit = (news: any) => {
    setEditId(news._id as Id<"news">);
    setEditForm({
      title: news.title,
      content: news.content,
      summary: news.summary,
      images: news.images,
      category: news.category,
      startDate: news.startDate,
      endDate: news.endDate,
      institution: news.institution,
      isPublished: news.isPublished,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    setError("");
    try {
      await updateNews({
        id: editId,
        ...editForm,
        updatedAt: Date.now(),
        isPublished: canApprove(userRole) ? editForm.isPublished : false,
      });
      setEditId(null);
      setEditForm({});
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleImageUpload = (res: any) => {
    if (res && Array.isArray(res)) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...res.map((f: any) => f.url)] }));
    }
  };

  const borderColor = "#f37c1b";
  const bgColor = "#fff7f0";
  const accentColor = "#1c140d";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: bgColor, borderRadius: 16, boxShadow: `0 2px 16px #f37c1b22`, padding: 32, border: `2px solid ${borderColor}` }}>
      <h1 style={{ color: accentColor, fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Manage News</h1>
      {canEdit(userRole) && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", borderRadius: 12, padding: 24, border: `1.5px solid ${borderColor}` }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <label>Category
            <select name="category" value={form.category} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }}>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>Institution
            <select name="institution" value={form.institution} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }}>
              {INSTITUTION_OPTIONS.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </label>
          <label>Start Date & Time
            <input type="datetime-local" name="startDate" value={new Date(form.startDate).toISOString().slice(0,16)} onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
          </label>
          <label>End Date & Time
            <input type="datetime-local" name="endDate" value={form.endDate ? new Date(form.endDate).toISOString().slice(0,16) : ""} onChange={e => setForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
          </label>
          <div style={{ margin: '8px 0' }}>
            <UploadButton
              endpoint="newsImageUploader"
              appearance={{
                button: {
                  background: borderColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: `0 1px 8px #f37c1b33`,
                  marginBottom: 4,
                },
                container: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                },
              }}
              onClientUploadComplete={handleImageUpload}
              onUploadError={(error: Error) => {
                alert(`Upload error: ${error.message}`);
              }}
            />
          </div>
          {form.images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
              {form.images.map((img, idx) => (
                <img key={idx} src={img} alt="News" style={{ maxWidth: 100, borderRadius: 8, border: `1px solid ${borderColor}` }} />
              ))}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 10, fontWeight: 700 }}>{loading ? "Adding..." : "Add News"}</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      )}
      <hr style={{ margin: "32px 0", borderColor }} />
      {canEdit(userRole) && (
        <>
          <h2 style={{ color: accentColor, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Unpublished News (For Review)</h2>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
            {unpublishedNews.map((news) => (
              <li key={news._id} style={{ marginBottom: 18, border: `1.5px dashed #b14a1c`, background: "#fff7f0", padding: 16, borderRadius: 10 }}>
                {editId === news._id ? (
                  <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input name="title" value={editForm.title} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <textarea name="summary" value={editForm.summary} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <textarea name="content" value={editForm.content} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="images" value={JSON.stringify(editForm.images)} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="category" value={editForm.category} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="institution" value={editForm.institution} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <label>Start Date & Time
                      <input type="datetime-local" name="startDate" value={new Date(editForm.startDate).toISOString().slice(0,16)} onChange={e => setEditForm((f: any) => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
                    </label>
                    <label>End Date & Time
                      <input type="datetime-local" name="endDate" value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0,16) : ""} onChange={e => setEditForm((f: any) => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
                    </label>
                    {canApprove(userRole) && (
                      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" name="isPublished" checked={!!editForm.isPublished} onChange={e => setEditForm({ ...editForm, isPublished: e.target.checked })} />
                        Published
                      </label>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="submit" style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Update</button>
                      <button type="button" onClick={handleCancelEdit} style={{ background: "#eee", color: accentColor, border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Cancel</button>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </form>
                ) : (
                  <>
                    <strong style={{ color: borderColor }}>{news.title}</strong>
                    <div style={{ color: accentColor }}>{news.summary}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{news.category}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{news.institution}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{news.startDate ? new Date(news.startDate).toLocaleString() : ""}</div>
                    <div style={{ fontSize: 12, color: news.isPublished ? "#1c8c3b" : "#b14a1c", fontWeight: 700, margin: "8px 0" }}>
                      {news.isPublished ? "Published" : "Not Published"}
                    </div>
                    {news.images && news.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
                        {news.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="News" style={{ maxWidth: 60, borderRadius: 6, border: `1px solid ${borderColor}` }} />
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      {canEdit(userRole) && (
                        <button onClick={() => handleEdit(news)} style={{ background: "#fff7f0", color: borderColor, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Edit</button>
                      )}
                      {canEdit(userRole) && (
                        <button onClick={() => handleDelete(news._id as Id<"news">)} style={{ background: "#fff7f0", color: "#b14a1c", border: `1.5px solid #b14a1c`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Delete</button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <h2 style={{ color: accentColor, fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Published News</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {newsList.map((news) => (
          <li key={news._id} style={{ marginBottom: 24, border: `1.5px solid ${borderColor}`, background: "#fff", padding: 20, borderRadius: 12, boxShadow: `0 1px 8px #f37c1b11` }}>
            {editId === news._id ? (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input name="title" value={editForm.title} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <textarea name="summary" value={editForm.summary} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <textarea name="content" value={editForm.content} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="images" value={JSON.stringify(editForm.images)} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="category" value={editForm.category} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="institution" value={editForm.institution} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <label>Start Date & Time
                  <input type="datetime-local" name="startDate" value={new Date(editForm.startDate).toISOString().slice(0,16)} onChange={e => setEditForm((f: any) => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
                </label>
                <label>End Date & Time
                  <input type="datetime-local" name="endDate" value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0,16) : ""} onChange={e => setEditForm((f: any) => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
                </label>
                {canApprove(userRole) && (
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" name="isPublished" checked={!!editForm.isPublished} onChange={e => setEditForm({ ...editForm, isPublished: e.target.checked })} />
                    Published
                  </label>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit" style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Update</button>
                  <button type="button" onClick={handleCancelEdit} style={{ background: "#eee", color: accentColor, border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Cancel</button>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
              </form>
            ) : (
              <>
                <strong style={{ color: borderColor, fontSize: 20 }}>{news.title}</strong>
                <div style={{ color: accentColor, margin: "8px 0" }}>{news.summary}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{news.category}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{news.institution}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{news.startDate ? new Date(news.startDate).toLocaleString() : ""}</div>
                <div style={{ fontSize: 12, color: news.isPublished ? "#1c8c3b" : "#b14a1c", fontWeight: 700, margin: "8px 0" }}>
                  {news.isPublished ? "Published" : "Not Published"}
                </div>
                {news.images && news.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                    {news.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="News" style={{ maxWidth: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} />
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {canEdit(userRole) && (
                    <button onClick={() => handleEdit(news)} style={{ background: "#fff7f0", color: borderColor, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Edit</button>
                  )}
                  {canEdit(userRole) && (
                    <button onClick={() => handleDelete(news._id as Id<"news">)} style={{ background: "#fff7f0", color: "#b14a1c", border: `1.5px solid #b14a1c`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Delete</button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

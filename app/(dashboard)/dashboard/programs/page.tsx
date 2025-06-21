"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import React from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { UploadButton } from "@/utils/uploadthing";

const canEdit = (role: string) => ["editor", "admin", "superadmin"].includes(role);
const canApprove = (role: string) => ["admin", "superadmin"].includes(role);

const STATUS_OPTIONS = ["upcoming", "ongoing", "completed"] as const;

export default function ProgramsDashboard() {
  const createProgram = useMutation(api.programs.createProgram);
  const deleteProgram = useMutation(api.programs.deleteProgram);
  const updateProgram = useMutation(api.programs.updateProgram);
  const approvedPrograms = useQuery(api.programs.getApprovedPrograms) || [];
  const unapprovedPrograms = useQuery(api.programs.getUnapprovedPrograms) || [];
  const currentUser = useQuery(api.users.getCurrentUser) || undefined;

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    startDate: Date.now(),
    endDate: undefined as number | undefined,
    location: "",
    images: [] as string[],
    videos: [] as string[],
    status: STATUS_OPTIONS[0],
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    tags: [] as string[],
    relatedNewsIds: [] as Id<"news">[],
    isFeatured: false,
    approved: false,
    createdAt: Date.now(),
  });
  const [editId, setEditId] = useState<Id<"programs"> | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userRole = currentUser?.role ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createProgram({
        ...form,
        startDate: Number(form.startDate),
        endDate: form.endDate ? Number(form.endDate) : undefined,
        createdAt: Date.now(),
        approved: canApprove(userRole) ? form.approved : false,
      });
      setForm({
        name: "",
        description: "",
        goal: "",
        startDate: Date.now(),
        endDate: undefined,
        location: "",
        images: [],
        videos: [],
        status: STATUS_OPTIONS[0],
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        tags: [],
        relatedNewsIds: [],
        isFeatured: false,
        approved: false,
        createdAt: Date.now(),
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: Id<"programs">) => {
    if (confirm("Are you sure you want to delete this program?")) {
      await deleteProgram({ id });
    }
  };

  const handleEdit = (program: any) => {
    setEditId(program._id as Id<"programs">);
    setEditForm({
      name: program.name,
      description: program.description,
      goal: program.goal,
      startDate: program.startDate,
      endDate: program.endDate,
      location: program.location,
      images: program.images,
      videos: program.videos,
      status: program.status,
      contactPerson: program.contactPerson,
      contactPhone: program.contactPhone,
      contactEmail: program.contactEmail,
      tags: program.tags || [],
      relatedNewsIds: program.relatedNewsIds || [],
      isFeatured: program.isFeatured,
      approved: program.approved,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    setError("");
    try {
      await updateProgram({
        id: editId,
        ...editForm,
        updatedAt: Date.now(),
        approved: canApprove(userRole) ? editForm.approved : false,
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
      const images: string[] = [];
      const videos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type && file.type.startsWith('video/')) {
          videos.push(file.url);
        } else {
          images.push(file.url);
        }
      });
      
      setForm((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...images],
        videos: [...prev.videos, ...videos]
      }));
    }
  };

  const handleEditUpload = (res: any) => {
    if (res && Array.isArray(res)) {
      const images: string[] = [];
      const videos: string[] = [];
      
      res.forEach((file: any) => {
        if (file.type && file.type.startsWith('video/')) {
          videos.push(file.url);
        } else {
          images.push(file.url);
        }
      });
      
      setEditForm((prev: any) => ({ 
        ...prev, 
        images: [...(prev.images || []), ...images],
        videos: [...(prev.videos || []), ...videos]
      }));
    }
  };

  const borderColor = "#1b7cf3";
  const bgColor = "#f7faff";
  const accentColor = "#14201c";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", background: bgColor, borderRadius: 16, boxShadow: `0 2px 16px #1b7cf322`, padding: 32, border: `2px solid ${borderColor}` }}>
      <h1 style={{ color: accentColor, fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Manage Programs</h1>
      {canEdit(userRole) && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", borderRadius: 12, padding: 24, border: `1.5px solid ${borderColor}` }}>
          <input name="name" placeholder="Program Name" value={form.name} onChange={handleChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <input name="goal" placeholder="Goal (optional)" value={form.goal} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <label>Status
            <select name="status" value={form.status} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label>Start Date & Time
            <input type="datetime-local" name="startDate" value={new Date(form.startDate).toISOString().slice(0,16)} onChange={e => setForm(f => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
          </label>
          <label>End Date & Time
            <input type="datetime-local" name="endDate" value={form.endDate ? new Date(form.endDate).toISOString().slice(0,16) : ""} onChange={e => setForm(f => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
          </label>
          <input name="location" placeholder="Location (optional)" value={form.location} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <input name="contactPerson" placeholder="Contact Person (optional)" value={form.contactPerson} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <input name="contactPhone" placeholder="Contact Phone (optional)" value={form.contactPhone} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <input name="contactEmail" placeholder="Contact Email (optional)" value={form.contactEmail} onChange={handleChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Featured
          </label>
          {canApprove(userRole) && (
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" name="approved" checked={form.approved} onChange={handleChange} />
              Approved
            </label>
          )}
          <div style={{ margin: '8px 0' }}>
            <UploadButton
              endpoint="programMediaUploader"
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
                  boxShadow: `0 1px 8px #1b7cf333`,
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
                <img key={idx} src={img} alt="Program" style={{ maxWidth: 100, borderRadius: 8, border: `1px solid ${borderColor}` }} />
              ))}
            </div>
          )}
          {form.videos.length > 0 && (
            <div style={{ margin: '8px 0' }}>
              <strong style={{ color: borderColor, fontSize: 14 }}>Videos:</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {form.videos.map((video, idx) => (
                  <video key={idx} src={video} style={{ maxWidth: 150, maxHeight: 100, borderRadius: 8, border: `1px solid ${borderColor}` }} controls />
                ))}
              </div>
            </div>
          )}
          <button type="submit" disabled={loading} style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 10, fontWeight: 700 }}>{loading ? "Adding..." : "Add Program"}</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      )}
      <hr style={{ margin: "32px 0", borderColor }} />
      {canEdit(userRole) && (
        <>
          <h2 style={{ color: accentColor, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Unapproved Programs (For Review)</h2>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
            {unapprovedPrograms.map((program) => (
              <li key={program._id} style={{ marginBottom: 18, border: `1.5px dashed #1b4ab1`, background: "#f7faff", padding: 16, borderRadius: 10 }}>
                {editId === program._id ? (
                  <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input name="name" value={editForm.name} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <textarea name="description" value={editForm.description} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="goal" value={editForm.goal} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="status" value={editForm.status} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="location" value={editForm.location} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="contactPerson" value={editForm.contactPerson} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="contactPhone" value={editForm.contactPhone} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <input name="contactEmail" value={editForm.contactEmail} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                    <label>Start Date & Time
                      <input type="datetime-local" name="startDate" value={new Date(editForm.startDate).toISOString().slice(0,16)} onChange={e => setEditForm((f: any) => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
                    </label>
                    <label>End Date & Time
                      <input type="datetime-local" name="endDate" value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0,16) : ""} onChange={e => setEditForm((f: any) => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" name="isFeatured" checked={!!editForm.isFeatured} onChange={handleEditChange} />
                      Featured
                    </label>
                    {canApprove(userRole) && (
                      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" name="approved" checked={!!editForm.approved} onChange={handleEditChange} />
                        Approved
                      </label>
                    )}
                    <div style={{ margin: '8px 0' }}>
                      <UploadButton
                        endpoint="programMediaUploader"
                        appearance={{
                          button: {
                            background: borderColor,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 16px',
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: `0 1px 8px #1b7cf333`,
                            marginBottom: 4,
                          },
                          container: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          },
                        }}
                        onClientUploadComplete={handleEditUpload}
                        onUploadError={(error: Error) => {
                          alert(`Upload error: ${error.message}`);
                        }}
                      />
                    </div>
                    {editForm.images && editForm.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                        {editForm.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="Program" style={{ maxWidth: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} />
                        ))}
                      </div>
                    )}
                    {editForm.videos && editForm.videos.length > 0 && (
                      <div style={{ margin: '8px 0' }}>
                        <strong style={{ color: borderColor, fontSize: 14 }}>Videos:</strong>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                          {editForm.videos.map((video: string, idx: number) => (
                            <video key={idx} src={video} style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} controls />
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="submit" style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Update</button>
                      <button type="button" onClick={handleCancelEdit} style={{ background: "#eee", color: accentColor, border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Cancel</button>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </form>
                ) : (
                  <>
                    <strong style={{ color: borderColor }}>{program.name}</strong>
                    <div style={{ color: accentColor }}>{program.description}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{program.status}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{program.location}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{program.startDate ? new Date(program.startDate).toLocaleString() : ""}</div>
                    <div style={{ fontSize: 12, color: program.approved ? "#1c8c3b" : "#1b4ab1", fontWeight: 700, margin: "8px 0" }}>
                      {program.approved ? "Approved" : "Not Approved"}
                    </div>
                    {program.images && program.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
                        {program.images.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="Program" style={{ maxWidth: 60, borderRadius: 6, border: `1px solid ${borderColor}` }} />
                        ))}
                      </div>
                    )}
                    {program.videos && program.videos.length > 0 && (
                      <div style={{ margin: '8px 0' }}>
                        <strong style={{ color: borderColor, fontSize: 12 }}>Videos:</strong>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                          {program.videos.map((video: string, idx: number) => (
                            <video key={idx} src={video} style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, border: `1px solid ${borderColor}` }} controls />
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      {canEdit(userRole) && (
                        <button onClick={() => handleEdit(program)} style={{ background: "#f7faff", color: borderColor, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Edit</button>
                      )}
                      {canEdit(userRole) && (
                        <button onClick={() => handleDelete(program._id as Id<"programs">)} style={{ background: "#f7faff", color: "#1b4ab1", border: `1.5px solid #1b4ab1`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Delete</button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <h2 style={{ color: accentColor, fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Approved Programs</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {approvedPrograms.map((program) => (
          <li key={program._id} style={{ marginBottom: 24, border: `1.5px solid ${borderColor}`, background: "#fff", padding: 20, borderRadius: 12, boxShadow: `0 1px 8px #1b7cf311` }}>
            {editId === program._id ? (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input name="name" value={editForm.name} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} required style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="goal" value={editForm.goal} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="status" value={editForm.status} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="location" value={editForm.location} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="contactPerson" value={editForm.contactPerson} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="contactPhone" value={editForm.contactPhone} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <input name="contactEmail" value={editForm.contactEmail} onChange={handleEditChange} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8 }} />
                <label>Start Date & Time
                  <input type="datetime-local" name="startDate" value={new Date(editForm.startDate).toISOString().slice(0,16)} onChange={e => setEditForm((f: any) => ({ ...f, startDate: new Date(e.target.value).getTime() }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} required />
                </label>
                <label>End Date & Time
                  <input type="datetime-local" name="endDate" value={editForm.endDate ? new Date(editForm.endDate).toISOString().slice(0,16) : ""} onChange={e => setEditForm((f: any) => ({ ...f, endDate: e.target.value ? new Date(e.target.value).getTime() : undefined }))} style={{ borderRadius: 8, border: `1px solid ${borderColor}`, padding: 8, marginTop: 4 }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" name="isFeatured" checked={!!editForm.isFeatured} onChange={handleEditChange} />
                  Featured
                </label>
                {canApprove(userRole) && (
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" name="approved" checked={!!editForm.approved} onChange={handleEditChange} />
                    Approved
                  </label>
                )}
                <div style={{ margin: '8px 0' }}>
                  <UploadButton
                    endpoint="programMediaUploader"
                    appearance={{
                      button: {
                        background: borderColor,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        boxShadow: `0 1px 8px #1b7cf333`,
                        marginBottom: 4,
                      },
                      container: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      },
                    }}
                    onClientUploadComplete={handleEditUpload}
                    onUploadError={(error: Error) => {
                      alert(`Upload error: ${error.message}`);
                    }}
                  />
                </div>
                {editForm.images && editForm.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                    {editForm.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="Program" style={{ maxWidth: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} />
                    ))}
                  </div>
                )}
                {editForm.videos && editForm.videos.length > 0 && (
                  <div style={{ margin: '8px 0' }}>
                    <strong style={{ color: borderColor, fontSize: 14 }}>Videos:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {editForm.videos.map((video: string, idx: number) => (
                        <video key={idx} src={video} style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} controls />
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="submit" style={{ background: borderColor, color: "#fff", border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Update</button>
                  <button type="button" onClick={handleCancelEdit} style={{ background: "#eee", color: accentColor, border: "none", borderRadius: 8, padding: 8, fontWeight: 700 }}>Cancel</button>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
              </form>
            ) : (
              <>
                <strong style={{ color: borderColor, fontSize: 20 }}>{program.name}</strong>
                <div style={{ color: accentColor, margin: "8px 0" }}>{program.description}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{program.status}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{program.location}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{program.startDate ? new Date(program.startDate).toLocaleString() : ""}</div>
                <div style={{ fontSize: 12, color: program.approved ? "#1c8c3b" : "#1b4ab1", fontWeight: 700, margin: "8px 0" }}>
                  {program.approved ? "Approved" : "Not Approved"}
                </div>
                {program.images && program.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
                    {program.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="Program" style={{ maxWidth: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} />
                    ))}
                  </div>
                )}
                {program.videos && program.videos.length > 0 && (
                  <div style={{ margin: '8px 0' }}>
                    <strong style={{ color: borderColor, fontSize: 14 }}>Videos:</strong>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {program.videos.map((video: string, idx: number) => (
                        <video key={idx} src={video} style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, border: `1px solid ${borderColor}` }} controls />
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {canEdit(userRole) && (
                    <button onClick={() => handleEdit(program)} style={{ background: "#f7faff", color: borderColor, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Edit</button>
                  )}
                  {canEdit(userRole) && (
                    <button onClick={() => handleDelete(program._id as Id<"programs">)} style={{ background: "#f7faff", color: "#1b4ab1", border: `1.5px solid #1b4ab1`, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>Delete</button>
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

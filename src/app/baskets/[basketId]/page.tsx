"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/lib/toast";

type SubjectItem = {
  id: string;
  basketId: string;
  title: string;
  description?: string | null;
  colorHex?: string | null;
  icon?: string | null;
  position?: number;
  createdAt?: string;
};

type SubjectPayload = {
  title: string;
  description: string;
  colorHex: string;
  icon: string;
  position: number;
};

const initialSubjectPayload: SubjectPayload = {
  title: "",
  description: "",
  colorHex: "#6bd8cb",
  icon: "schema",
  position: 0,
};

function unwrapListResponse<T>(response: any): T[] {
  return (response?.data?.data ?? response?.data ?? []) as T[];
}

function unwrapItemResponse<T>(response: any): T {
  return (response?.data?.data ?? response?.data) as T;
}

export default function BasketPage() {
  const params = useParams();
  const basketId = params?.basketId as string;

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [form, setForm] = useState<SubjectPayload>(initialSubjectPayload);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);

  // Edit / Delete states
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);
  const [editForm, setEditForm] = useState<SubjectPayload>(initialSubjectPayload);
  const [updating, setUpdating] = useState(false);
  const [destroying, setDestroying] = useState(false);

  useEffect(() => {
    if (!basketId) return;

    let mounted = true;
    async function loadSubjects() {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/curriculum/subjects", {
          params: { basketId },
        });
        if (!mounted) return;
        setSubjects(unwrapListResponse<SubjectItem>(response).sort((left, right) => (left.position ?? 0) - (right.position ?? 0)));
      } catch {
        if (mounted) toastError("Unable to load subjects.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSubjects();
    return () => {
      mounted = false;
    };
  }, [basketId]);

  const subjectCount = useMemo(() => subjects.length, [subjects]);

  // Set up edit form when selection changes
  useEffect(() => {
    if (editingSubject) {
      setEditForm({
        title: editingSubject.title,
        description: editingSubject.description || "",
        colorHex: editingSubject.colorHex || "#6bd8cb",
        icon: editingSubject.icon || "schema",
        position: editingSubject.position ?? 0,
      });
    }
  }, [editingSubject]);

  async function createSubject() {
    if (!form.title.trim()) {
      toastError("Subject title is required.");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.post("/api/curriculum/subjects", {
        basketId,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        colorHex: form.colorHex.trim() || undefined,
        icon: form.icon.trim() || undefined,
        position: form.position,
      });

      const createdSubject = unwrapItemResponse<SubjectItem>(response);
      setSubjects((current) => [createdSubject, ...current].sort((left, right) => (left.position ?? 0) - (right.position ?? 0)));
      setForm(initialSubjectPayload);
      toastSuccess("Subject created.");
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to create subject.");
    } finally {
      setSaving(false);
    }
  }

  async function updateSubject() {
    if (!editingSubject) return;
    if (!editForm.title.trim()) {
      toastError("Subject title is required.");
      return;
    }

    setUpdating(true);
    try {
      const response = await apiClient.put(`/api/curriculum/subjects/${editingSubject.id}`, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        colorHex: editForm.colorHex.trim() || undefined,
        icon: editForm.icon.trim() || undefined,
        position: editForm.position,
      });

      const updatedSubject = unwrapItemResponse<SubjectItem>(response);
      setSubjects((current) =>
        current.map((s) => (s.id === editingSubject.id ? updatedSubject : s)).sort((left, right) => (left.position ?? 0) - (right.position ?? 0))
      );
      toastSuccess("Subject updated.");
      setEditingSubject(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to update subject.");
    } finally {
      setUpdating(false);
    }
  }

  async function deleteSubject() {
    if (!deletingSubject) return;

    setDestroying(true);
    try {
      await apiClient.delete(`/api/curriculum/subjects/${deletingSubject.id}`);
      setSubjects((current) => current.filter((s) => s.id !== deletingSubject.id));
      toastSuccess("Subject deleted.");
      setDeletingSubject(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to delete subject.");
    } finally {
      setDestroying(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-void text-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:px-10">
        <section className="rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-5 shadow-[0_20px_50px_rgba(6,10,9,0.4)] backdrop-blur-xl md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-secondary">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                Basket Workspace
              </div>
              <h1 className="mt-4 font-display text-headline-lg-mobile text-3xl text-text-primary md:text-display">
                Subjects
              </h1>
              <p className="mt-3 max-w-2xl font-body-base text-body-base text-text-secondary">
                Add schema-backed subjects inside this basket. Each subject can carry its own color, icon, description, and order position.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Subjects</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">{subjectCount}</div>
                </div>
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Basket ID</div>
                  <div className="mt-1 truncate font-body-sm text-sm text-primary">{basketId}</div>
                </div>
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Layout</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">Responsive</div>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-text-primary">Create Subject</h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">Uses the real subject schema fields.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateForm((value) => !value)}
                  className="border-outline-variant/50 bg-surface-base/60 text-text-primary hover:bg-surface-container"
                >
                  {showCreateForm ? "Hide" : "Show"}
                </Button>
              </div>

              <div
                className="mt-4 overflow-hidden transition-all duration-300"
                style={{ maxHeight: showCreateForm ? 900 : 0, opacity: showCreateForm ? 1 : 0 }}
              >
                <div className="grid gap-3">
                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Title *</span>
                    <input
                      className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Data Structures"
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                    <textarea
                      className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      style={{ minHeight: 88 }}
                      placeholder="Arrays, linked lists, trees, graphs..."
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Icon</span>
                      <input
                        className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="schema"
                        value={form.icon}
                        onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Position</span>
                      <input
                        className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        type="number"
                        value={form.position}
                        onChange={(event) => setForm((current) => ({ ...current, position: Number(event.target.value) }))}
                      />
                    </label>
                  </div>

                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Accent color</span>
                    <input
                      className="h-11 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      type="color"
                      value={form.colorHex}
                      onChange={(event) => setForm((current) => ({ ...current, colorHex: event.target.value }))}
                    />
                  </label>

                  <Button type="button" onClick={createSubject} disabled={saving} className="mt-1 h-11 bg-primary text-on-primary hover:bg-primary-fixed-dim">
                    {saving ? "Creating..." : "Create Subject"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-text-primary">Subjects in this basket</h2>
              <p className="font-body-sm text-body-sm text-text-secondary">Each card links into the subject playlists view.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateForm(true)} className="border-outline-variant/50 bg-surface-base/60 text-text-primary hover:bg-surface-container">
              New Subject
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-base/60" />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-base/50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">schema</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">No subjects yet</h3>
              <p className="mt-2 text-sm text-text-secondary">Create the first subject for this basket to continue into playlists.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/baskets/${basketId}/subjects/${subject.id}`}
                  className="group relative rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(6,10,9,0.35)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-overlay text-primary">
                        <span className="material-symbols-outlined">{subject.icon || "schema"}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-text-primary">{subject.title}</h3>
                        <p className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">
                          Position {subject.position ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingSubject(subject);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-primary/60 hover:text-primary transition-all duration-200"
                        title="Edit Subject"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingSubject(subject);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-red-500/60 hover:text-red-400 transition-all duration-200"
                        title="Delete Subject"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-text-secondary">{subject.description || "No description provided."}</p>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-primary transition-all duration-300 group-hover:w-full" style={{ width: "70%", backgroundColor: subject.colorHex || undefined }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Subject Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-display text-xl text-text-primary">Edit Subject</h3>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Title *</span>
                <input
                  className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Data Structures"
                  value={editForm.title}
                  onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                <textarea
                  className="min-h-22 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Arrays, linked lists, trees, graphs..."
                  value={editForm.description}
                  onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Icon</span>
                  <input
                    className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="schema"
                    value={editForm.icon}
                    onChange={(event) => setEditForm((current) => ({ ...current, icon: event.target.value }))}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Position</span>
                  <input
                    className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                    type="number"
                    value={editForm.position}
                    onChange={(event) => setEditForm((current) => ({ ...current, position: Number(event.target.value) }))}
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Accent color</span>
                <input
                  className="h-11 w-full rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  type="color"
                  value={editForm.colorHex}
                  onChange={(event) => setEditForm((current) => ({ ...current, colorHex: event.target.value }))}
                />
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={updateSubject}
                  disabled={updating}
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-fixed-dim"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSubject(null)}
                  className="border-outline-variant/40 bg-surface-base/60 text-text-primary hover:bg-surface-container"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Subject Confirmation Modal */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-red-500/25 bg-surface-raised p-6 shadow-2xl">
            <h3 className="font-display text-xl text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              Delete Subject
            </h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete <strong className="text-text-primary">"{deletingSubject.title}"</strong>?
              This action is permanent and will delete all associated playlists, nodes, and study reviews inside it.
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={deleteSubject}
                disabled={destroying}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none"
              >
                {destroying ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingSubject(null)}
                className="flex-1 border-outline-variant/40 bg-surface-base/60 text-text-primary hover:bg-surface-container"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
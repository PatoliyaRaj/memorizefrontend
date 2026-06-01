"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/lib/toast";

type BasketItem = {
  id: string;
  title: string;
  description?: string | null;
  fieldTag?: string | null;
  colorHex?: string | null;
  icon?: string | null;
  position?: number;
  isPublic?: boolean;
  createdAt?: string;
};

type BasketPayload = {
  title: string;
  description: string;
  fieldTag: string;
  colorHex: string;
  icon: string;
  isPublic: boolean;
};

const initialPayload: BasketPayload = {
  title: "",
  description: "",
  fieldTag: "",
  colorHex: "#6bd8cb",
  icon: "folder",
  isPublic: false,
};

function unwrapListResponse<T>(response: any): T[] {
  return (response?.data?.data ?? response?.data ?? []) as T[];
}

function unwrapItemResponse<T>(response: any): T {
  return (response?.data?.data ?? response?.data) as T;
}

export default function BasketsPage() {
  const [baskets, setBaskets] = useState<BasketItem[]>([]);
  const [form, setForm] = useState<BasketPayload>(initialPayload);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);

  // Edit / Delete states
  const [editingBasket, setEditingBasket] = useState<BasketItem | null>(null);
  const [deletingBasket, setDeletingBasket] = useState<BasketItem | null>(null);
  const [editForm, setEditForm] = useState<BasketPayload>(initialPayload);
  const [updating, setUpdating] = useState(false);
  const [destroying, setDestroying] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBaskets() {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/curriculum/baskets");
        if (!mounted) return;
        setBaskets(unwrapListResponse<BasketItem>(response).sort((left, right) => (left.position ?? 0) - (right.position ?? 0)));
      } catch {
        if (mounted) {
          toastError("Unable to load baskets.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBaskets();
    return () => {
      mounted = false;
    };
  }, []);

  const basketStats = useMemo(() => {
    const total = baskets.length;
    const publicCount = baskets.filter((basket) => basket.isPublic).length;
    const privateCount = total - publicCount;
    return { total, publicCount, privateCount };
  }, [baskets]);

  // Set up edit form when selection changes
  useEffect(() => {
    if (editingBasket) {
      setEditForm({
        title: editingBasket.title,
        description: editingBasket.description || "",
        fieldTag: editingBasket.fieldTag || "",
        colorHex: editingBasket.colorHex || "#6bd8cb",
        icon: editingBasket.icon || "folder",
        isPublic: editingBasket.isPublic || false,
      });
    }
  }, [editingBasket]);

  async function createBasket() {
    if (!form.title.trim()) {
      toastError("Basket title is required.");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.post("/api/curriculum/baskets", {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        fieldTag: form.fieldTag.trim() || undefined,
        colorHex: form.colorHex.trim() || undefined,
        icon: form.icon.trim() || undefined,
        isPublic: form.isPublic,
      });

      const createdBasket = unwrapItemResponse<BasketItem>(response);
      setBaskets((current) => [createdBasket, ...current].sort((left, right) => (left.position ?? 0) - (right.position ?? 0)));
      setForm(initialPayload);
      toastSuccess("Basket created.");
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to create basket.");
    } finally {
      setSaving(false);
    }
  }

  async function updateBasket() {
    if (!editingBasket) return;
    if (!editForm.title.trim()) {
      toastError("Basket title is required.");
      return;
    }

    setUpdating(true);
    try {
      const response = await apiClient.put(`/api/curriculum/baskets/${editingBasket.id}`, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        fieldTag: editForm.fieldTag.trim() || undefined,
        colorHex: editForm.colorHex.trim() || undefined,
        icon: editForm.icon.trim() || undefined,
        isPublic: editForm.isPublic,
      });

      const updatedBasket = unwrapItemResponse<BasketItem>(response);
      setBaskets((current) =>
        current.map((b) => (b.id === editingBasket.id ? updatedBasket : b)).sort((left, right) => (left.position ?? 0) - (right.position ?? 0))
      );
      toastSuccess("Basket updated.");
      setEditingBasket(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to update basket.");
    } finally {
      setUpdating(false);
    }
  }

  async function deleteBasket() {
    if (!deletingBasket) return;

    setDestroying(true);
    try {
      await apiClient.delete(`/api/curriculum/baskets/${deletingBasket.id}`);
      setBaskets((current) => current.filter((b) => b.id !== deletingBasket.id));
      toastSuccess("Basket deleted.");
      setDeletingBasket(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to delete basket.");
    } finally {
      setDestroying(false);
    }
  }

  return (
    <div className="text-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-base/80 shadow-[0_20px_50px_rgba(6,10,9,0.4)] backdrop-blur-xl">
          <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-5 md:p-6">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-text-secondary">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Curriculum Vault
                </div>
                <div className="space-y-3">
                  <h1 className="font-display text-headline-lg-mobile text-3xl tracking-tight text-text-primary md:text-display">
                    Baskets
                  </h1>
                  <p className="max-w-2xl font-body-base text-body-base text-text-secondary">
                    Organize your curriculum into baskets, define visibility and color coding, and keep each knowledge lane ready for subjects and playlists.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                    <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Total</div>
                    <div className="mt-1 text-2xl font-bold text-text-primary">{basketStats.total}</div>
                  </div>
                  <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                    <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Public</div>
                    <div className="mt-1 text-2xl font-bold text-primary">{basketStats.publicCount}</div>
                  </div>
                  <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                    <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Private</div>
                    <div className="mt-1 text-2xl font-bold text-text-primary">{basketStats.privateCount}</div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-text-primary">Create Basket</h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Match the underlying schema fields for a clean save.
                  </p>
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

              <div className={`mt-4 overflow-hidden transition-all duration-300 ${showCreateForm ? "max-h-225 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="grid gap-3">
                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Title *</span>
                    <input
                      className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Computer Science"
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                    <textarea
                      className="min-h-22 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Core foundations, architecture, and algorithmic design."
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Field tag</span>
                      <input
                        className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="science / cs"
                        value={form.fieldTag}
                        onChange={(event) => setForm((current) => ({ ...current, fieldTag: event.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Icon</span>
                      <input
                        className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="folder"
                        value={form.icon}
                        onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Accent color</span>
                      <input
                        className="h-11 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        type="color"
                        value={form.colorHex}
                        onChange={(event) => setForm((current) => ({ ...current, colorHex: event.target.value }))}
                      />
                    </label>
                    <label className="flex items-end gap-2 rounded-lg border border-outline-variant bg-surface-base px-3 py-3">
                      <input
                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                        type="checkbox"
                        checked={form.isPublic}
                        onChange={(event) => setForm((current) => ({ ...current, isPublic: event.target.checked }))}
                      />
                      <span className="font-body-sm text-body-sm text-text-secondary">Public basket</span>
                    </label>
                  </div>

                  <Button
                    type="button"
                    onClick={createBasket}
                    disabled={saving}
                    className="mt-1 h-11 bg-primary text-on-primary hover:bg-primary-fixed-dim"
                  >
                    {saving ? "Creating..." : "Create Basket"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-text-primary">Your Baskets</h2>
              <p className="font-body-sm text-body-sm text-text-secondary">All baskets are loaded from the authenticated curriculum API.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(true)}
              className="border-outline-variant/50 bg-surface-base/60 text-text-primary hover:bg-surface-container"
            >
              New Basket
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-56 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-base/60" />
              ))}
            </div>
          ) : baskets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-base/50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">No baskets yet</h3>
              <p className="mt-2 text-sm text-text-secondary">Create your first basket to start organizing subjects and playlists.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {baskets.map((basket) => (
                <Link
                  key={basket.id}
                  href={`/baskets/${basket.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(6,10,9,0.35)]"
                  style={{ boxShadow: `inset 0 1px 0 ${basket.colorHex ?? "rgba(107,216,203,0.2)"}` }}
                >
                  <div
                    className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
                    style={{ backgroundColor: basket.colorHex ?? "rgba(107,216,203,0.14)" }}
                  />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-overlay text-primary"
                        style={{ borderColor: basket.colorHex ?? undefined, color: basket.colorHex ?? undefined }}
                      >
                        <span className="material-symbols-outlined">{basket.icon || "folder"}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-text-primary">{basket.title}</h3>
                        <p className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">
                          {basket.fieldTag || "Unsorted"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-outline-variant/30 bg-surface-overlay px-2.5 py-1 font-data-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        {basket.isPublic ? "Public" : "Private"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingBasket(basket);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-primary/60 hover:text-primary transition-all duration-200"
                        title="Edit Basket"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingBasket(basket);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-red-500/60 hover:text-red-400 transition-all duration-200"
                        title="Delete Basket"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="relative z-10 mt-4 line-clamp-3 text-sm text-text-secondary">
                    {basket.description || "No description provided."}
                  </p>

                  <div className="relative z-10 mt-5 flex items-center justify-between text-xs uppercase tracking-wider text-text-secondary">
                    <span>Position {basket.position ?? 0}</span>
                    <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                      Open
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Modal */}
      {editingBasket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-display text-xl text-text-primary">Edit Basket</h3>
              <button
                type="button"
                onClick={() => setEditingBasket(null)}
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
                  placeholder="Computer Science"
                  value={editForm.title}
                  onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                <textarea
                  className="min-h-22 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Core foundations, architecture, and algorithmic design."
                  value={editForm.description}
                  onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Field tag</span>
                  <input
                    className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="science / cs"
                    value={editForm.fieldTag}
                    onChange={(event) => setEditForm((current) => ({ ...current, fieldTag: event.target.value }))}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Icon</span>
                  <input
                    className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="folder"
                    value={editForm.icon}
                    onChange={(event) => setEditForm((current) => ({ ...current, icon: event.target.value }))}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Accent color</span>
                  <input
                    className="h-11 w-full rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    type="color"
                    value={editForm.colorHex}
                    onChange={(event) => setEditForm((current) => ({ ...current, colorHex: event.target.value }))}
                  />
                </label>
                <label className="flex items-end gap-2 rounded-lg border border-outline-variant bg-surface-base px-3 py-3">
                  <input
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                    type="checkbox"
                    checked={editForm.isPublic}
                    onChange={(event) => setEditForm((current) => ({ ...current, isPublic: event.target.checked }))}
                  />
                  <span className="font-body-sm text-body-sm text-text-secondary">Public basket</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={updateBasket}
                  disabled={updating}
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-fixed-dim"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingBasket(null)}
                  className="border-outline-variant/40 bg-surface-base/60 text-text-primary hover:bg-surface-container"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBasket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-red-500/25 bg-surface-raised p-6 shadow-2xl">
            <h3 className="font-display text-xl text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              Delete Basket
            </h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete <strong className="text-text-primary">"{deletingBasket.title}"</strong>?
              This action is permanent and will delete all associated subjects, playlists, and cards inside it.
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={deleteBasket}
                disabled={destroying}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none"
              >
                {destroying ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingBasket(null)}
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
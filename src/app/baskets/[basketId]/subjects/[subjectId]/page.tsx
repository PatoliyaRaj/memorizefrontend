"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient } from "@/services/api-client";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/lib/toast";

type PlaylistItem = {
  id: string;
  subjectId: string;
  title: string;
  description?: string | null;
  orderIndex?: number;
  createdAt?: string;
};

type PlaylistPayload = {
  title: string;
  description: string;
  orderIndex: number;
};

const initialPlaylistPayload: PlaylistPayload = {
  title: "",
  description: "",
  orderIndex: 0,
};

function unwrapListResponse<T>(response: any): T[] {
  return (response?.data?.data ?? response?.data ?? []) as T[];
}

function unwrapItemResponse<T>(response: any): T {
  return (response?.data?.data ?? response?.data) as T;
}

export default function PlaylistsPage() {
  const params = useParams();
  const basketId = params?.basketId as string;
  const subjectId = params?.subjectId as string;

  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [form, setForm] = useState<PlaylistPayload>(initialPlaylistPayload);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(true);

  // Edit / Delete states
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<PlaylistItem | null>(null);
  const [editForm, setEditForm] = useState<PlaylistPayload>(initialPlaylistPayload);
  const [updating, setUpdating] = useState(false);
  const [destroying, setDestroying] = useState(false);

  useEffect(() => {
    if (!subjectId) return;

    let mounted = true;
    async function loadPlaylists() {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/curriculum/playlists", {
          params: { subjectId },
        });
        if (!mounted) return;
        setPlaylists(
          unwrapListResponse<PlaylistItem>(response).sort((left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0))
        );
      } catch {
        if (mounted) toastError("Unable to load playlists.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPlaylists();
    return () => {
      mounted = false;
    };
  }, [subjectId]);

  const playlistCount = useMemo(() => playlists.length, [playlists]);

  // Set up edit form when selection changes
  useEffect(() => {
    if (editingPlaylist) {
      setEditForm({
        title: editingPlaylist.title,
        description: editingPlaylist.description || "",
        orderIndex: editingPlaylist.orderIndex ?? 0,
      });
    }
  }, [editingPlaylist]);

  async function createPlaylist() {
    if (!form.title.trim()) {
      toastError("Playlist title is required.");
      return;
    }

    setSaving(true);
    try {
      const response = await apiClient.post("/api/curriculum/playlists", {
        subjectId,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        orderIndex: form.orderIndex,
      });

      const createdPlaylist = unwrapItemResponse<PlaylistItem>(response);
      setPlaylists((current) => [createdPlaylist, ...current].sort((left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0)));
      setForm(initialPlaylistPayload);
      toastSuccess("Playlist created.");
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to create playlist.");
    } finally {
      setSaving(false);
    }
  }

  async function updatePlaylist() {
    if (!editingPlaylist) return;
    if (!editForm.title.trim()) {
      toastError("Playlist title is required.");
      return;
    }

    setUpdating(true);
    try {
      const response = await apiClient.put(`/api/curriculum/playlists/${editingPlaylist.id}`, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
        orderIndex: editForm.orderIndex,
      });

      const updatedPlaylist = unwrapItemResponse<PlaylistItem>(response);
      setPlaylists((current) =>
        current.map((p) => (p.id === editingPlaylist.id ? updatedPlaylist : p)).sort((left, right) => (left.orderIndex ?? 0) - (right.orderIndex ?? 0))
      );
      toastSuccess("Playlist updated.");
      setEditingPlaylist(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to update playlist.");
    } finally {
      setUpdating(false);
    }
  }

  async function deletePlaylist() {
    if (!deletingPlaylist) return;

    setDestroying(true);
    try {
      await apiClient.delete(`/api/curriculum/playlists/${deletingPlaylist.id}`);
      setPlaylists((current) => current.filter((p) => p.id !== deletingPlaylist.id));
      toastSuccess("Playlist deleted.");
      setDeletingPlaylist(null);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to delete playlist.");
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
              <div className="flex flex-wrap items-center gap-2 text-data-mono uppercase tracking-widest text-text-secondary">
                <span className="material-symbols-outlined text-primary">playlist_add</span>
                Subject Workspace
              </div>
              <h1 className="mt-4 font-display text-headline-lg-mobile text-3xl text-text-primary md:text-display">
                Playlists
              </h1>
              <p className="mt-3 max-w-2xl font-body-base text-body-base text-text-secondary">
                Build playlist lanes under this subject. Each playlist can map directly into the neural canvas and study experience.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Playlists</div>
                  <div className="mt-1 text-2xl font-bold text-text-primary">{playlistCount}</div>
                </div>
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Subject ID</div>
                  <div className="mt-1 truncate font-body-sm text-sm text-primary">{subjectId}</div>
                </div>
                <div className="rounded-xl border border-outline-variant/20 bg-surface-base/70 p-3">
                  <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Basket ID</div>
                  <div className="mt-1 truncate font-body-sm text-sm text-primary">{basketId}</div>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-text-primary">Create Playlist</h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">Backed by the playlist schema.
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
                      placeholder="Arrays & Hashing"
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                    <textarea
                      className="min-h-22 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Sorting, searching, dynamic programming..."
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Order index</span>
                    <input
                      className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                      type="number"
                      value={form.orderIndex}
                      onChange={(event) => setForm((current) => ({ ...current, orderIndex: Number(event.target.value) }))}
                    />
                  </label>

                  <Button type="button" onClick={createPlaylist} disabled={saving} className="mt-1 h-11 bg-primary text-on-primary hover:bg-primary-fixed-dim">
                    {saving ? "Creating..." : "Create Playlist"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-text-primary">Playlists in this subject</h2>
              <p className="font-body-sm text-body-sm text-text-secondary">Open a playlist to continue into the map view.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateForm(true)} className="border-outline-variant/50 bg-surface-base/60 text-text-primary hover:bg-surface-container">
              New Playlist
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface-base/60" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-base/50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">playlist_add</span>
              </div>
              <h3 className="font-display text-xl text-text-primary">No playlists yet</h3>
              <p className="mt-2 text-sm text-text-secondary">Create the first playlist to map nodes and begin study sessions.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/map/${playlist.id}`}
                  className="group rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(6,10,9,0.35)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl text-text-primary">{playlist.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{playlist.description || "No description provided."}</p>
                    </div>

                    <div className="flex items-center gap-2 relative z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingPlaylist(playlist);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-primary/60 hover:text-primary transition-all duration-200"
                        title="Edit Playlist"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeletingPlaylist(playlist);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/35 bg-surface-overlay/80 text-text-secondary hover:border-red-500/60 hover:text-red-400 transition-all duration-200"
                        title="Delete Playlist"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-data-mono uppercase tracking-wider text-text-secondary">
                    <span>Order Index: {playlist.orderIndex ?? 0}</span>
                    <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                      Open Map
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Playlist Modal */}
      {editingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-raised p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-display text-xl text-text-primary">Edit Playlist</h3>
              <button
                type="button"
                onClick={() => setEditingPlaylist(null)}
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
                  placeholder="Arrays & Hashing"
                  value={editForm.title}
                  onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Description</span>
                <textarea
                  className="min-h-22 rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Sorting, searching, dynamic programming..."
                  value={editForm.description}
                  onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <label className="grid gap-1">
                <span className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">Order Index</span>
                <input
                  className="rounded-lg border border-outline-variant bg-surface-base px-3 py-2 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  type="number"
                  value={editForm.orderIndex}
                  onChange={(event) => setEditForm((current) => ({ ...current, orderIndex: Number(event.target.value) }))}
                />
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={updatePlaylist}
                  disabled={updating}
                  className="flex-1 bg-primary text-on-primary hover:bg-primary-fixed-dim"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPlaylist(null)}
                  className="border-outline-variant/40 bg-surface-base/60 text-text-primary hover:bg-surface-container"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Playlist Confirmation Modal */}
      {deletingPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-void/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-red-500/25 bg-surface-raised p-6 shadow-2xl">
            <h3 className="font-display text-xl text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              Delete Playlist
            </h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete <strong className="text-text-primary">"{deletingPlaylist.title}"</strong>?
              This action is permanent and will delete all associated nodes, links/edges, cards, and study sessions.
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={deletePlaylist}
                disabled={destroying}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none"
              >
                {destroying ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingPlaylist(null)}
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
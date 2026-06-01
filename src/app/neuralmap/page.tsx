"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/services/api-client";
import AuthGuard from "@/components/common/AuthGuard";

// ─── Types ─────────────────────────────────────────────────────────────────

type BasketItem = {
  id: string;
  title: string;
  description?: string | null;
  fieldTag?: string | null;
  colorHex?: string | null;
  icon?: string | null;
};

type SubjectItem = {
  id: string;
  basketId: string;
  title: string;
  description?: string | null;
  colorHex?: string | null;
};

type PlaylistItem = {
  id: string;
  subjectId: string;
  title: string;
  description?: string | null;
  orderIndex?: number;
};

type EnrichedPlaylist = PlaylistItem & {
  subjectTitle: string;
  basketTitle: string;
  basketColor: string | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function unwrap<T>(response: any): T {
  return (response?.data?.data ?? response?.data ?? []) as T;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const MASTERY_ICON: Record<string, string> = {
  unseen: "radio_button_unchecked",
  weak: "signal_cellular_alt_1_bar",
  learning: "signal_cellular_alt_2_bar",
  strong: "signal_cellular_alt",
  mastered: "verified",
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function NeuralMapHubPage() {
  const [baskets, setBaskets] = useState<BasketItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBasketId, setSelectedBasketId] = useState<string | "all">("all");

  // ── Data Fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      try {
        // 1. Fetch baskets
        const basketsRes = await apiClient.get("/api/curriculum/baskets");
        const fetchedBaskets = unwrap<BasketItem[]>(basketsRes);
        if (!mounted) return;
        setBaskets(fetchedBaskets);

        // 2. Fetch subjects for every basket in parallel
        const subjectArrays = await Promise.all(
          fetchedBaskets.map((b) =>
            apiClient
              .get("/api/curriculum/subjects", { params: { basketId: b.id } })
              .then((r) => unwrap<SubjectItem[]>(r))
              .catch(() => [] as SubjectItem[])
          )
        );
        const allSubjects = subjectArrays.flat();
        if (!mounted) return;
        setSubjects(allSubjects);

        // 3. Fetch playlists for every subject in parallel
        const playlistArrays = await Promise.all(
          allSubjects.map((s) =>
            apiClient
              .get("/api/curriculum/playlists", { params: { subjectId: s.id } })
              .then((r) => unwrap<PlaylistItem[]>(r))
              .catch(() => [] as PlaylistItem[])
          )
        );
        const allPlaylists = playlistArrays.flat();
        if (!mounted) return;
        setPlaylists(allPlaylists);
      } catch (e: any) {
        if (mounted) setError("Failed to load your knowledge maps. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Derived enriched playlists ─────────────────────────────────────────────

  const enrichedPlaylists = useMemo<EnrichedPlaylist[]>(() => {
    return playlists.map((pl) => {
      const subject = subjects.find((s) => s.id === pl.subjectId);
      const basket = baskets.find((b) => b.id === subject?.basketId);
      return {
        ...pl,
        subjectTitle: subject?.title ?? "Unknown Subject",
        basketTitle: basket?.title ?? "Unknown Basket",
        basketColor: basket?.colorHex ?? null,
      };
    });
  }, [playlists, subjects, baskets]);

  // ── Filter logic ───────────────────────────────────────────────────────────

  const filteredPlaylists = useMemo(() => {
    let result = enrichedPlaylists;
    if (selectedBasketId !== "all") {
      const subjectIds = subjects
        .filter((s) => s.basketId === selectedBasketId)
        .map((s) => s.id);
      result = result.filter((pl) => subjectIds.includes(pl.subjectId));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (pl) =>
          pl.title.toLowerCase().includes(q) ||
          pl.subjectTitle.toLowerCase().includes(q) ||
          pl.basketTitle.toLowerCase().includes(q) ||
          pl.description?.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [enrichedPlaylists, selectedBasketId, searchQuery, subjects]);

  const stats = useMemo(
    () => ({
      baskets: baskets.length,
      subjects: subjects.length,
      maps: playlists.length,
    }),
    [baskets, subjects, playlists]
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <AuthGuard>
      <div className="text-text-primary">
        <div className="mx-auto w-full max-w-7xl">

          {/* ── Hero Header ── */}
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-8">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-teal-500/8 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-secondary">
                  <span className="material-symbols-outlined text-primary text-base">account_tree</span>
                  Neural Map Hub
                </div>
                <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                  Knowledge Maps
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-text-secondary leading-relaxed">
                  Navigate your entire curriculum through interactive neural canvas maps. Each playlist is a live XY-Flow map where you can add concepts, draw prerequisite links, and study directly.
                </p>

                {/* Stat counters */}
                <div className="mt-5 flex flex-wrap gap-4">
                  {[
                    { label: "Baskets", value: stats.baskets, icon: "inventory_2" },
                    { label: "Subjects", value: stats.subjects, icon: "psychology" },
                    { label: "Maps", value: stats.maps, icon: "account_tree" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2 rounded-xl border border-outline-variant/25 bg-surface-overlay/50 px-4 py-2.5"
                    >
                      <span className="material-symbols-outlined text-primary text-base">{stat.icon}</span>
                      <div>
                        <div className="text-xl font-bold text-text-primary leading-none">{stat.value}</div>
                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/baskets"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-sm text-on-primary shadow-[0_0_20px_rgba(107,216,203,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(107,216,203,0.45)] active:scale-[0.97]"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Manage Curriculum
                </Link>
              </div>
            </div>
          </div>

          {/* ── Filter Bar ── */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-base pointer-events-none">search</span>
              <input
                type="text"
                className="w-full rounded-xl border border-outline-variant bg-surface-base pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Search maps, subjects, baskets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Basket filter */}
            <div className="shrink-0">
              <select
                value={selectedBasketId}
                onChange={(e) => setSelectedBasketId(e.target.value)}
                className="h-10 rounded-xl border border-outline-variant bg-surface-base px-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary min-w-[160px]"
              >
                <option value="all">All Baskets</option>
                {baskets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl border border-outline-variant/25 bg-surface-base/60"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          )}

          {/* ── Error State ── */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <span className="material-symbols-outlined text-red-400 text-4xl block mb-3">error</span>
              <h3 className="font-display text-lg text-red-400">{error}</h3>
              <p className="mt-2 text-sm text-text-secondary">Check your network connection and reload.</p>
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && !error && filteredPlaylists.length === 0 && (
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-base/50 p-12 text-center">
              <span className="material-symbols-outlined text-primary text-5xl block mb-4">account_tree</span>
              {playlists.length === 0 ? (
                <>
                  <h3 className="font-display text-xl text-text-primary">No maps yet</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto">
                    Create your first basket and playlist to start building knowledge maps. Each playlist gets its own interactive XY-Flow canvas.
                  </p>
                  <Link
                    href="/baskets"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.3)] transition-all hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    Create First Basket
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="font-display text-xl text-text-primary">No maps match your search</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Try a different keyword or select "All Baskets".
                  </p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedBasketId("all"); }}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Grouped by Basket ── */}
          {!loading && !error && filteredPlaylists.length > 0 && (() => {
            // Group by basket
            const basketGroups: Record<string, { basket: BasketItem; playlists: EnrichedPlaylist[] }> = {};
            filteredPlaylists.forEach((pl) => {
              const basket = baskets.find((b) => {
                const subject = subjects.find((s) => s.id === pl.subjectId);
                return b.id === subject?.basketId;
              });
              if (!basket) return;
              if (!basketGroups[basket.id]) {
                basketGroups[basket.id] = { basket, playlists: [] };
              }
              basketGroups[basket.id].playlists.push(pl);
            });

            return Object.values(basketGroups).map(({ basket, playlists: groupPlaylists }) => (
              <section key={basket.id} className="mb-10">
                {/* Basket heading */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/40 text-primary"
                    style={{ borderColor: basket.colorHex ?? undefined, color: basket.colorHex ?? undefined }}
                  >
                    <span className="material-symbols-outlined text-base">{basket.icon || "inventory_2"}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-text-primary">{basket.title}</h2>
                    <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                      {groupPlaylists.length} {groupPlaylists.length === 1 ? "map" : "maps"}
                    </p>
                  </div>
                  <div
                    className="ml-3 h-px flex-1 rounded-full opacity-30"
                    style={{ backgroundColor: basket.colorHex ?? "var(--border-default)" }}
                  />
                </div>

                {/* Playlist cards grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {groupPlaylists.map((pl) => (
                    <PlaylistMapCard key={pl.id} playlist={pl} accentColor={basket.colorHex} />
                  ))}
                </div>
              </section>
            ));
          })()}
        </div>
      </div>
    </AuthGuard>
  );
}

// ─── Playlist Map Card ───────────────────────────────────────────────────────

function PlaylistMapCard({
  playlist,
  accentColor,
}: {
  playlist: EnrichedPlaylist;
  accentColor?: string | null;
}) {
  const accent = accentColor ?? "#6BD8CB";

  return (
    <Link
      href={`/map/${playlist.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-base/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Accent glow top-right */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: accent }}
      />

      {/* Card top row */}
      <div className="flex items-start justify-between gap-3">
        {/* Icon badge */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg font-bold font-display"
          style={{
            borderColor: `${accent}44`,
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          {getInitials(playlist.title)}
        </div>

        {/* Open arrow indicator */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-overlay/60 text-text-secondary transition-all duration-200 group-hover:border-primary/50 group-hover:text-primary">
          <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            arrow_outward
          </span>
        </div>
      </div>

      {/* Title & description */}
      <div className="mt-3 flex-1">
        <h3 className="font-display text-lg font-bold leading-snug text-text-primary group-hover:text-primary transition-colors duration-200">
          {playlist.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary leading-relaxed">
          {playlist.description || "Neural map canvas for this playlist unit."}
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
        <span className="truncate max-w-[90px]">{playlist.basketTitle}</span>
        <span className="opacity-40">/</span>
        <span className="truncate max-w-[90px]">{playlist.subjectTitle}</span>
      </div>

      {/* Bottom footer */}
      <div className="mt-3 flex items-center justify-between border-t border-outline-variant/20 pt-3">
        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
          <span className="material-symbols-outlined text-sm text-primary">account_tree</span>
          Neural Map
        </div>
        <div
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-mono uppercase font-bold tracking-wider transition-all duration-200 group-hover:scale-[1.03]"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <span className="material-symbols-outlined text-xs">open_in_full</span>
          Open Map
        </div>
      </div>
    </Link>
  );
}
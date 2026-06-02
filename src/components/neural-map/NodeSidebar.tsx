"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { getNodeDetails, updateNodeDetails, type NodeDetails, type NodeReference, type NodeImage, type NodeFile } from "@/services/node-details-service";
import { createNode, updateNode, deleteNode, getNodeById, type VisualNode } from "@/services/nodes-service";
import NodeCardsTab from "./NodeCardsTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

type SidebarMode = "view" | "create" | null;

type CreateNodeFormState = {
  title: string;
  nodeType: NonNullable<VisualNode["node_type"]>;
  orderIndex: number;
  posX: number;
  posY: number;
  theory: string;
  takeaways: string[];
  emotionalAnchor: string;
};

type NodeSidebarProps = {
  playlistId: string | null;
  nodeId: string | null;
  mode: SidebarMode;
  createPosition?: { x: number; y: number } | null;
  onClose?: () => void;
  onCreated?: (node: VisualNode) => void;
  onUpdated?: (id: string, updates: Partial<VisualNode>) => void;
  onDeleted?: (id: string) => void;
};

const defaultCreateForm = (position?: { x: number; y: number } | null): CreateNodeFormState => ({
  title: "",
  nodeType: "concept",
  orderIndex: 0,
  posX: Math.round(position?.x ?? 0),
  posY: Math.round(position?.y ?? 0),
  theory: "",
  takeaways: [],
  emotionalAnchor: "",
});

type SaveStatus = "saved" | "drafting" | "saving";

export default function NodeSidebar({
  playlistId,
  nodeId,
  mode,
  createPosition,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: NodeSidebarProps) {
  const router = useRouter();
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  // General sidebar layout / data state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "cards" | "references" | "assets">("content");

  // Create Mode Form State
  const [createForm, setCreateForm] = useState<CreateNodeFormState>(() => defaultCreateForm(createPosition));
  const [newTakeawayCreate, setNewTakeawayCreate] = useState("");

  // View Mode Fields (Synced via Auto-Save)
  const [title, setTitle] = useState("");
  const [nodeType, setNodeType] = useState<VisualNode["node_type"]>("concept");
  const [masteryLevel, setMasteryLevel] = useState<VisualNode["mastery_level"]>("unseen");
  const [theory, setTheory] = useState("");
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [emotionalAnchor, setEmotionalAnchor] = useState("");
  const [references, setReferences] = useState<NodeReference[]>([]);
  const [images, setImages] = useState<NodeImage[]>([]);
  const [files, setFiles] = useState<NodeFile[]>([]);
  const [cardsDueCount, setCardsDueCount] = useState(0);

  // References inline form
  const [newRefTitle, setNewRefTitle] = useState("");
  const [newRefUrl, setNewRefUrl] = useState("");
  const [newRefType, setNewRefType] = useState<"video" | "article" | "doc" | "book">("article");

  // Images inline form
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newImgCaption, setNewImgCaption] = useState("");
  const [newImgAlt, setNewImgAlt] = useState("");

  // Files inline form
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");

  // Add Takeaway in content tab
  const [newTakeawayContent, setNewTakeawayContent] = useState("");

  // Inline Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-Save Management
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const originalDetailsRef = useRef<{
    title: string;
    nodeType: VisualNode["node_type"];
    masteryLevel: VisualNode["mastery_level"];
    theory: string;
    takeaways: string[];
    emotionalAnchor: string;
    references: NodeReference[];
    images: NodeImage[];
    files: NodeFile[];
  } | null>(null);

  const latestValuesRef = useRef({
    title,
    nodeType,
    theory,
    takeaways,
    emotionalAnchor,
    references,
    images,
    files,
  });

  // Track latest states in Ref to prevent closure issues in auto-save
  useEffect(() => {
    latestValuesRef.current = {
      title,
      nodeType,
      theory,
      takeaways,
      emotionalAnchor,
      references,
      images,
      files,
    };
  }, [title, nodeType, theory, takeaways, emotionalAnchor, references, images, files]);

  // Load Node Details
  useEffect(() => {
    if (mode !== "view" || !nodeId) {
      originalDetailsRef.current = null;
      setConfirmDelete(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setSaveStatus("saved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    getNodeDetails(nodeId)
      .then((response) => {
        if (!mounted) return;

        // Fetch the node info too to get title and type
        getNodeById(nodeId)
          .then((node) => {
            if (!mounted) return;

            // Set states synchronously
            setTitle(node.title);
            setNodeType(node.node_type ?? "concept");
            setMasteryLevel(node.mastery_level ?? "unseen");
            setTheory(response.theory || "");
            setTakeaways(response.takeaways || []);
            setEmotionalAnchor(response.emotional_anchor || "");
            setReferences(response.references || []);
            setImages(response.images || []);
            setFiles(response.files || []);
            setCardsDueCount(response.cards_due_count || 0);

            // Seed original values
            originalDetailsRef.current = {
              title: node.title,
              nodeType: node.node_type ?? "concept",
              masteryLevel: node.mastery_level ?? "unseen",
              theory: response.theory || "",
              takeaways: response.takeaways || [],
              emotionalAnchor: response.emotional_anchor || "",
              references: response.references || [],
              images: response.images || [],
              files: response.files || [],
            };
          })
          .catch((err) => {
            console.error("Failed to load node primary data", err);
          });
      })
      .catch((err) => {
        if (mounted) {
          toastError("Failed to load node details.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [mode, nodeId]);

  // Populate create form on position changes
  useEffect(() => {
    if (mode === "create") {
      setCreateForm(defaultCreateForm(createPosition));
      setNewTakeawayCreate("");
    }
  }, [mode, createPosition]);

  // Trigger Save Changes
  const triggerChange = (updatedFields: Partial<typeof latestValuesRef.current>) => {
    if (mode !== "view" || !nodeId) return;

    // Apply local state updates immediately
    if (updatedFields.hasOwnProperty("title")) setTitle(updatedFields.title!);
    if (updatedFields.hasOwnProperty("nodeType")) setNodeType(updatedFields.nodeType!);
    if (updatedFields.hasOwnProperty("theory")) setTheory(updatedFields.theory!);
    if (updatedFields.hasOwnProperty("takeaways")) setTakeaways(updatedFields.takeaways!);
    if (updatedFields.hasOwnProperty("emotionalAnchor")) setEmotionalAnchor(updatedFields.emotionalAnchor!);
    if (updatedFields.hasOwnProperty("references")) setReferences(updatedFields.references!);
    if (updatedFields.hasOwnProperty("images")) setImages(updatedFields.images!);
    if (updatedFields.hasOwnProperty("files")) setFiles(updatedFields.files!);

    setSaveStatus("drafting");

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const merged = {
          ...latestValuesRef.current,
          ...updatedFields,
        };

        const orig = originalDetailsRef.current;
        const titleOrTypeChanged =
          orig && (merged.title !== orig.title || merged.nodeType !== orig.nodeType);

        if (titleOrTypeChanged) {
          const updatedNodeData = await updateNode(nodeId, {
            title: merged.title,
            nodeType: merged.nodeType,
          });
          onUpdated?.(nodeId, updatedNodeData);
        }

        const detailsUpdate = await updateNodeDetails(nodeId, {
          theory: merged.theory,
          takeaways: merged.takeaways,
          emotional_anchor: merged.emotionalAnchor,
          references: merged.references,
          images: merged.images,
          files: merged.files,
        });

        // Set new original ref value
        originalDetailsRef.current = {
          title: merged.title,
          nodeType: merged.nodeType,
          masteryLevel: masteryLevel,
          theory: detailsUpdate.theory || "",
          takeaways: detailsUpdate.takeaways || [],
          emotionalAnchor: detailsUpdate.emotional_anchor || "",
          references: detailsUpdate.references || [],
          images: detailsUpdate.images || [],
          files: detailsUpdate.files || [],
        };

        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("drafting");
      }
    }, 1000);
  };

  // Node Options
  const nodeTypeOptions = useMemo(
    () => ["concept", "definition", "formula", "process", "example", "exception"] as const,
    []
  );

  // Sequential Node Creation with details
  async function handleCreateNode() {
    if (mode !== "create" || !playlistId) return;

    if (!createForm.title.trim()) {
      toastError("Node title is required.");
      return;
    }

    setSaving(true);
    try {
      // Step 1: Create node on the canvas
      const createdNode = await createNode({
        playlistId,
        title: createForm.title.trim(),
        nodeType: createForm.nodeType,
        posX: createForm.posX,
        posY: createForm.posY,
        orderIndex: createForm.orderIndex,
      });

      // Step 2: Sequential update of its details
      if (createForm.theory.trim() || createForm.takeaways.length > 0 || createForm.emotionalAnchor.trim()) {
        await updateNodeDetails(createdNode.id, {
          theory: createForm.theory.trim(),
          takeaways: createForm.takeaways,
          emotional_anchor: createForm.emotionalAnchor.trim(),
        });
      }

      toastSuccess("Node created successfully.");
      onCreated?.(createdNode);
    } catch (error: any) {
      toastError(error?.response?.data?.error || error?.response?.data?.message || "Failed to create node.");
    } finally {
      setSaving(false);
    }
  }

  // Handle Delete with inline 2-step confirm
  function handleDeleteNode() {
    if (!nodeId) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
      return;
    }

    // Explicit confirmation received
    setSaving(true);
    deleteNode(nodeId)
      .then(() => {
        toastSuccess("Node deleted.");
        onDeleted?.(nodeId);
      })
      .catch((err) => {
        toastError("Failed to delete node.");
      })
      .finally(() => {
        setSaving(false);
      });
  }



  if (!mode) return null;

  return (
    <aside className="fixed right-0 top-0 z-50 h-full w-full border-l border-border-default bg-[#0B1210]/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:w-105 lg:w-115 text-text-primary flex flex-col font-body">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border-default px-5 py-4 bg-[#121C1A]/50">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              {mode === "create" ? "Create Node" : "Node Details"}
            </p>
            {mode === "view" && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-border-subtle bg-surface-void">
                <span
                  className={cn(
                    "size-1.5 rounded-full inline-block",
                    saveStatus === "saved" && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                    saveStatus === "drafting" && "bg-amber-400 animate-pulse",
                    saveStatus === "saving" && "bg-teal-400 animate-pulse"
                  )}
                />
                <span
                  className={cn(
                    saveStatus === "saved" && "text-emerald-400",
                    saveStatus === "drafting" && "text-amber-400",
                    saveStatus === "saving" && "text-teal-400"
                  )}
                >
                  {saveStatus === "saved" && "Saved"}
                  {saveStatus === "drafting" && "Drafting..."}
                  {saveStatus === "saving" && "Saving..."}
                </span>
              </div>
            )}
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary tracking-tight mt-0.5">
            {mode === "create" ? "New Canvas Node" : title || "Loading..."}
          </h2>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary hover:bg-[#1F312D] rounded-full"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </Button>
      </div>

      {/* Main Sidebar Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {mode === "create" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border-default bg-[#121C1A]/40 p-4 space-y-2">
              <h4 className="font-display text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#6BD8CB] text-base">architecture</span>
                Sequential Creation
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                NeuroLearn implements curatorial precision. Build the node's geometry and core theory elements sequentially in one pipeline.
              </p>
            </div>

            <label className="grid gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Title *</span>
              <Input
                value={createForm.title}
                onChange={(event) => setCreateForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="E.g. Graph Traversal"
                className="bg-[#060A09] border-border-default focus-visible:ring-primary focus-visible:border-primary text-text-primary"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Node Type</span>
              <select
                value={createForm.nodeType}
                onChange={(event) => setCreateForm((current) => ({ ...current, nodeType: event.target.value as CreateNodeFormState["nodeType"] }))}
                className="h-9 rounded-lg border border-border-default bg-[#060A09] px-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {nodeTypeOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#0B1210]">
                    {option.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 grid-cols-2">
              <label className="grid gap-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Position X</span>
                <Input
                  type="number"
                  value={createForm.posX}
                  onChange={(event) => setCreateForm((current) => ({ ...current, posX: Number(event.target.value) }))}
                  className="bg-[#060A09] border-border-default"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Position Y</span>
                <Input
                  type="number"
                  value={createForm.posY}
                  onChange={(event) => setCreateForm((current) => ({ ...current, posY: Number(event.target.value) }))}
                  className="bg-[#060A09] border-border-default"
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Theory Content</span>
              <textarea
                value={createForm.theory}
                onChange={(event) => setCreateForm((current) => ({ ...current, theory: event.target.value }))}
                placeholder="Elaborate the mental theory / concepts..."
                rows={4}
                className="w-full rounded-lg border border-border-default bg-[#060A09] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
              />
            </label>

            <div className="grid gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Takeaways</span>
              {createForm.takeaways.length > 0 && (
                <ul className="space-y-1.5 mb-2">
                  {createForm.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#121C1A] border border-border-subtle text-xs text-text-secondary">
                      <span>• {takeaway}</span>
                      <button
                        type="button"
                        onClick={() => setCreateForm(current => ({ ...current, takeaways: current.takeaways.filter((_, i) => i !== idx) }))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <Input
                  value={newTakeawayCreate}
                  onChange={(e) => setNewTakeawayCreate(e.target.value)}
                  placeholder="Key takeaway to recall..."
                  className="bg-[#060A09] border-border-default flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newTakeawayCreate.trim()) {
                        setCreateForm(current => ({ ...current, takeaways: [...current.takeaways, newTakeawayCreate.trim()] }));
                        setNewTakeawayCreate("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newTakeawayCreate.trim()) {
                      setCreateForm(current => ({ ...current, takeaways: [...current.takeaways, newTakeawayCreate.trim()] }));
                      setNewTakeawayCreate("");
                    }
                  }}
                  className="border-border-default hover:bg-[#1F312D] text-text-primary"
                >
                  Add
                </Button>
              </div>
            </div>

            <label className="grid gap-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Emotional Anchor</span>
              <Input
                value={createForm.emotionalAnchor}
                onChange={(event) => setCreateForm((current) => ({ ...current, emotionalAnchor: event.target.value }))}
                placeholder="Mnemonic or association hook..."
                className="bg-[#060A09] border-border-default text-text-primary"
              />
            </label>

            <div className="flex gap-2.5 pt-3">
              <Button
                type="button"
                onClick={handleCreateNode}
                disabled={saving}
                className="flex-1 bg-primary text-on-primary hover:bg-[#4FDBC8] font-bold"
              >
                {saving ? "Creating..." : "Create Node"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-border-default bg-[#060A09] text-text-primary hover:bg-[#1F312D]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-xl border border-border-default bg-[#121C1A]/40 p-5 text-center text-sm text-text-secondary animate-pulse">
                Analyzing neural pathway details...
              </div>
            ) : (
              <>
                {/* Spaced Repetition Trigger */}
                <div className="rounded-xl border border-border-default bg-[#121C1A]/80 p-4 flex flex-col gap-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-sm font-semibold text-text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#6BD8CB] text-base animate-pulse">psychology</span>
                        FSRS Spaced Repetition
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Test your memory to review this node.
                      </p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider",
                      masteryLevel === 'mastered' && "bg-[#134E4A] text-[#2DD4BF]",
                      masteryLevel === 'strong' && "bg-[#0A2A20] text-[#34D399]",
                      masteryLevel === 'learning' && "bg-[#3A2A0A] text-[#FBBF24]",
                      masteryLevel === 'weak' && "bg-[#4A1A1A] text-[#F87171]",
                      masteryLevel === 'unseen' && "bg-[#2A3530] text-[#6B8A85]",
                    )}>
                      {(masteryLevel || 'unseen').toUpperCase()}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      if (!isAuth) {
                        router.push("/login");
                      } else {
                        router.push(`/study/${nodeId}`);
                      }
                    }}
                    className="w-full bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(13,148,136,0.25)] border border-[#0D9488]/40"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    ⚡ Start Active Recall ({cardsDueCount} Cards Due)
                  </Button>
                </div>

                {/* Glassmorphic Tab Selector */}
                <div className="flex p-1 rounded-xl bg-[#060A09] border border-border-default">
                  {(["content", "cards", "references", "assets"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all font-bold",
                        activeTab === tab
                          ? "bg-[#121C1A] text-[#6BD8CB] border border-border-subtle shadow-sm"
                          : "text-text-secondary hover:text-text-primary hover:bg-[#1F312D]/40"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* TAB 1: CONTENT */}
                {activeTab === "content" && (
                  <div className="space-y-4">
                    <label className="grid gap-1.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Title</span>
                      <Input
                        value={title}
                        onChange={(e) => triggerChange({ title: e.target.value })}
                        className="bg-[#060A09] border-border-default focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </label>

                    <label className="grid gap-1.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Node Type</span>
                      <select
                        value={nodeType}
                        onChange={(e) => triggerChange({ nodeType: e.target.value as VisualNode["node_type"] })}
                        className="h-9 rounded-lg border border-border-default bg-[#060A09] px-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {nodeTypeOptions.map((option) => (
                          <option key={option} value={option} className="bg-[#0B1210]">
                            {option.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-1.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Theory / Core Concept</span>
                      <textarea
                        value={theory}
                        onChange={(e) => triggerChange({ theory: e.target.value })}
                        placeholder="Detail the core theory behind this node..."
                        rows={6}
                        className="w-full rounded-lg border border-border-default bg-[#060A09] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed placeholder:text-text-tertiary"
                      />
                    </label>

                    {/* Takeaways Dynamic List */}
                    <div className="grid gap-1.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Takeaways / Key Reminders</span>
                      <ul className="space-y-2 mb-1">
                        {takeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#121C1A] border border-border-subtle text-sm text-text-secondary leading-relaxed">
                            <span className="mt-0.5">• {takeaway}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newTakeaways = takeaways.filter((_, i) => i !== idx);
                                triggerChange({ takeaways: newTakeaways });
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-colors shrink-0"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </li>
                        ))}
                        {takeaways.length === 0 && (
                          <li className="text-xs text-text-tertiary italic p-2.5 rounded-lg border border-border-subtle border-dashed bg-[#060A09]">
                            No takeaways entered yet. Add visual or structural bullets below to sync.
                          </li>
                        )}
                      </ul>

                      <div className="flex gap-2 mt-1">
                        <Input
                          value={newTakeawayContent}
                          onChange={(e) => setNewTakeawayContent(e.target.value)}
                          placeholder="Type key bullet and press Enter..."
                          className="bg-[#060A09] border-border-default flex-1 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newTakeawayContent.trim()) {
                                const newList = [...takeaways, newTakeawayContent.trim()];
                                triggerChange({ takeaways: newList });
                                setNewTakeawayContent("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newTakeawayContent.trim()) {
                              const newList = [...takeaways, newTakeawayContent.trim()];
                              triggerChange({ takeaways: newList });
                              setNewTakeawayContent("");
                            }
                          }}
                          className="border-border-default hover:bg-[#1F312D]"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <label className="grid gap-1.5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">Emotional Anchor</span>
                      <Input
                        value={emotionalAnchor}
                        onChange={(e) => triggerChange({ emotionalAnchor: e.target.value })}
                        placeholder="Mnemonics or extreme associations to help memory recall..."
                        className="bg-[#060A09] border-border-default text-text-primary text-sm"
                      />
                    </label>
                  </div>
                )}

                {/* TAB 2: CARDS */}
                {activeTab === "cards" && mode === "view" && nodeId && (
                  <NodeCardsTab
                    nodeId={nodeId}
                    onCardsChange={() => {
                      getNodeDetails(nodeId)
                        .then((res) => {
                          setCardsDueCount(res.cards_due_count || 0);
                        })
                        .catch((err) => console.error("Failed to sync due cards count", err));
                    }}
                  />
                )}

                {/* TAB 3: REFERENCES */}
                {activeTab === "references" && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block">Resource Links</span>
                      {references.map((ref, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#121C1A] border border-border-subtle text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="material-symbols-outlined text-[#6BD8CB]">
                              {ref.type === "video" && "play_circle"}
                              {ref.type === "article" && "article"}
                              {ref.type === "doc" && "description"}
                              {ref.type === "book" && "menu_book"}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-text-primary truncate">{ref.title}</p>
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-brand hover:underline font-mono truncate block text-[10px]"
                              >
                                {ref.url}
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedRefs = references.filter((_, i) => i !== idx);
                              triggerChange({ references: updatedRefs });
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ))}
                      {references.length === 0 && (
                        <p className="text-xs text-text-tertiary italic p-3 rounded-lg border border-border-subtle border-dashed bg-[#060A09]">
                          No references attached. Add videos, papers, or documentation below.
                        </p>
                      )}
                    </div>

                    {/* Add Reference Inline Form */}
                    <div className="rounded-xl border border-border-subtle bg-[#121C1A]/50 p-4 space-y-3">
                      <h5 className="font-display text-xs font-semibold text-text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#6BD8CB] text-xs">add_link</span>
                        Attach Reference Link
                      </h5>

                      <label className="grid gap-1">
                        <span className="text-[10px] uppercase font-mono text-text-secondary">Link Title</span>
                        <Input
                          value={newRefTitle}
                          onChange={(e) => setNewRefTitle(e.target.value)}
                          placeholder="E.g. Mitosis Wikipedia Page"
                          className="bg-[#060A09] border-border-default h-8 text-xs"
                        />
                      </label>

                      <label className="grid gap-1">
                        <span className="text-[10px] uppercase font-mono text-text-secondary">URL</span>
                        <Input
                          value={newRefUrl}
                          onChange={(e) => setNewRefUrl(e.target.value)}
                          placeholder="https://wikipedia.org/..."
                          className="bg-[#060A09] border-border-default h-8 text-xs font-mono"
                        />
                      </label>

                      <label className="grid gap-1">
                        <span className="text-[10px] uppercase font-mono text-text-secondary">Resource Type</span>
                        <select
                          value={newRefType}
                          onChange={(e) => setNewRefType(e.target.value as any)}
                          className="h-8 rounded-lg border border-border-default bg-[#060A09] px-2 text-xs text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          <option value="article">Article / Page</option>
                          <option value="video">Video Lecture</option>
                          <option value="doc">Documentation</option>
                          <option value="book">Textbook / PDF</option>
                        </select>
                      </label>

                      <Button
                        type="button"
                        onClick={() => {
                          if (!newRefTitle.trim() || !newRefUrl.trim()) {
                            toastError("Title and URL are required.");
                            return;
                          }
                          const newRef: NodeReference = {
                            title: newRefTitle.trim(),
                            url: newRefUrl.trim(),
                            type: newRefType,
                          };
                          const updated = [...references, newRef];
                          triggerChange({ references: updated });
                          setNewRefTitle("");
                          setNewRefUrl("");
                          setNewRefType("article");
                        }}
                        className="w-full bg-[#0B1210] border border-[#6BD8CB]/30 hover:bg-[#121C1A] text-[#6BD8CB] text-xs h-8 font-bold"
                      >
                        + Add Reference Link
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 4: ASSETS */}
                {activeTab === "assets" && (
                  <div className="space-y-6">
                    {/* Visual Images Section */}
                    <div className="space-y-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block">Images</span>
                      {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {images.map((img, idx) => (
                            <div key={idx} className="group relative rounded-xl border border-border-subtle overflow-hidden bg-[#121C1A] flex flex-col">
                              <div className="relative aspect-video bg-surface-void flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={img.altText || img.caption || "Node Image"}
                                  className="object-cover w-full h-full"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImgs = images.filter((_, i) => i !== idx);
                                    triggerChange({ images: updatedImgs });
                                  }}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-red-500 text-white p-1 rounded-lg transition-all"
                                >
                                  <span className="material-symbols-outlined text-xs">delete</span>
                                </button>
                              </div>
                              <div className="p-2 text-[10px] leading-snug">
                                <p className="font-semibold text-text-primary truncate">{img.caption || "No Caption"}</p>
                                <p className="text-text-tertiary truncate">{img.altText || "No Alt text"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-tertiary italic p-3 rounded-lg border border-border-subtle border-dashed bg-[#060A09]">
                          No image assets attached. Link diagrams below.
                        </p>
                      )}

                      {/* Add Image Inline Form */}
                      <div className="rounded-xl border border-border-subtle bg-[#121C1A]/50 p-4 space-y-3">
                        <h5 className="font-display text-xs font-semibold text-text-primary flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#6BD8CB] text-xs">image</span>
                          Link Image Asset
                        </h5>

                        <label className="grid gap-1">
                          <span className="text-[10px] uppercase font-mono text-text-secondary">Image URL</span>
                          <Input
                            value={newImgUrl}
                            onChange={(e) => setNewImgUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="bg-[#060A09] border-border-default h-8 text-xs font-mono"
                          />
                        </label>

                        <label className="grid gap-1">
                          <span className="text-[10px] uppercase font-mono text-text-secondary">Caption</span>
                          <Input
                            value={newImgCaption}
                            onChange={(e) => setNewImgCaption(e.target.value)}
                            placeholder="E.g. Mitosis Cycle Diagram"
                            className="bg-[#060A09] border-border-default h-8 text-xs"
                          />
                        </label>

                        <label className="grid gap-1">
                          <span className="text-[10px] uppercase font-mono text-text-secondary">Alt Text</span>
                          <Input
                            value={newImgAlt}
                            onChange={(e) => setNewImgAlt(e.target.value)}
                            placeholder="E.g. Diagram of cells splitting"
                            className="bg-[#060A09] border-border-default h-8 text-xs"
                          />
                        </label>

                        <Button
                          type="button"
                          onClick={() => {
                            if (!newImgUrl.trim()) {
                              toastError("Image URL is required.");
                              return;
                            }
                            const newImg: NodeImage = {
                              url: newImgUrl.trim(),
                              caption: newImgCaption.trim() || undefined,
                              altText: newImgAlt.trim() || undefined,
                            };
                            const updated = [...images, newImg];
                            triggerChange({ images: updated });
                            setNewImgUrl("");
                            setNewImgCaption("");
                            setNewImgAlt("");
                          }}
                          className="w-full bg-[#0B1210] border border-[#6BD8CB]/30 hover:bg-[#121C1A] text-[#6BD8CB] text-xs h-8 font-bold"
                        >
                          + Add Image Asset
                        </Button>
                      </div>
                    </div>

                    {/* Files Section */}
                    <div className="space-y-3 border-t border-border-default/40 pt-5">
                      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block">File Attachments</span>
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#121C1A] border border-border-subtle text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="material-symbols-outlined text-[#6BD8CB]">attachment</span>
                            <div className="min-w-0">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-text-primary hover:underline truncate block"
                              >
                                {file.name}
                              </a>
                              <span className="text-text-tertiary block text-[10px] truncate">{file.url}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFiles = files.filter((_, i) => i !== idx);
                              triggerChange({ files: updatedFiles });
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ))}
                      {files.length === 0 && (
                        <p className="text-xs text-text-tertiary italic p-3 rounded-lg border border-border-subtle border-dashed bg-[#060A09]">
                          No files attached. Attach reference documents below.
                        </p>
                      )}

                      {/* Add File Inline Form */}
                      <div className="rounded-xl border border-border-subtle bg-[#121C1A]/50 p-4 space-y-3">
                        <h5 className="font-display text-xs font-semibold text-text-primary flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#6BD8CB] text-xs">attachment</span>
                          Attach Reference File
                        </h5>

                        <label className="grid gap-1">
                          <span className="text-[10px] uppercase font-mono text-text-secondary">File Name</span>
                          <Input
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="E.g. Lecture Notes PDF"
                            className="bg-[#060A09] border-border-default h-8 text-xs"
                          />
                        </label>

                        <label className="grid gap-1">
                          <span className="text-[10px] uppercase font-mono text-text-secondary">File URL</span>
                          <Input
                            value={newFileUrl}
                            onChange={(e) => setNewFileUrl(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="bg-[#060A09] border-border-default h-8 text-xs font-mono"
                          />
                        </label>

                        <Button
                          type="button"
                          onClick={() => {
                            if (!newFileName.trim() || !newFileUrl.trim()) {
                              toastError("File Name and URL are required.");
                              return;
                            }
                            const newFile: NodeFile = {
                              name: newFileName.trim(),
                              url: newFileUrl.trim(),
                            };
                            const updated = [...files, newFile];
                            triggerChange({ files: updated });
                            setNewFileName("");
                            setNewFileUrl("");
                          }}
                          className="w-full bg-[#0B1210] border border-[#6BD8CB]/30 hover:bg-[#121C1A] text-[#6BD8CB] text-xs h-8 font-bold"
                        >
                          + Attach Reference File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Footer containing Delete Button */}
      {mode === "view" && !loading && (
        <div className="border-t border-border-default p-4 bg-[#060A09]/60 flex items-center justify-between">
          <Button
            type="button"
            onClick={handleDeleteNode}
            disabled={saving}
            className={cn(
              "flex-1 transition-all duration-300 font-bold",
              confirmDelete
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500/10 hover:bg-red-500/20 text-red-400 focus-visible:ring-red-500/30"
            )}
          >
            <span className="material-symbols-outlined text-sm mr-1.5">
              {confirmDelete ? "warning" : "delete"}
            </span>
            {confirmDelete ? "Confirm Deletion — Click Again" : "Delete Node Pathway"}
          </Button>
        </div>
      )}
    </aside>
  );
}
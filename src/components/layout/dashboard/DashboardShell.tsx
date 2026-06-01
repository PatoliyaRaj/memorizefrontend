"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Brain,
  ChevronLeft,
  LayoutGrid,
  LogOut,
  Map,
  Menu,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/use-auth-store"

// ─── Types ──────────────────────────────────────────────────────────────────

type DashboardShellProps = {
  children: React.ReactNode
}

type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

// ─── Nav Config ─────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { label: "Dashboard",    icon: LayoutGrid, path: "/dashboard" },
  { label: "Today's Pulse",icon: Sparkles,   path: "/pulse" },
  { label: "My Baskets",   icon: Brain,      path: "/baskets" },
  { label: "Neural Maps",  icon: Map,        path: "/neuralmap" },
]

// ─── Sidebar Logo ────────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-5 py-5 group">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border-brand/60 bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/25 group-hover:shadow-[0_0_16px_rgba(107,216,203,0.25)]">
        <Brain className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-base font-bold leading-tight text-text-primary truncate">Memorize</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary truncate">Scientific Learning</p>
      </div>
    </Link>
  )
}

// ─── Nav Items List ──────────────────────────────────────────────────────────

function SidebarNavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon
        // Match exact path or any sub-path (e.g. /baskets/abc)
        const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path))

        return (
          <Link
            key={item.label}
            href={item.path}
            onClick={onNavigate}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(107,216,203,0.2)]"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            <Icon className={cn("size-4 shrink-0 transition-colors", active && "text-primary")} />
            <span className="truncate">{item.label}</span>
            {active && (
              <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_6px_rgba(107,216,203,0.6)]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Sidebar User Footer ─────────────────────────────────────────────────────

function SidebarUserFooter({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  // Prevent hydration mismatch: useAuthStore reads localStorage on the client,
  // so server HTML has user=null but client has user=object. Guard with mounted.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <div className="mt-auto shrink-0 border-t border-border-subtle px-3 py-4 space-y-2">
      {/* New Session CTA */}
      <Link
        href="/baskets"
        onClick={onNavigate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.2)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(107,216,203,0.35)] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        New Session
      </Link>

      {/* Settings Link */}
      <Link
        href="/settings"
        onClick={onNavigate}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-all hover:bg-surface-hover hover:text-text-primary"
      >
        <Settings className="size-4 shrink-0" />
        <span>Settings</span>
      </Link>

      {/* User Profile Row — only after hydration to avoid SSR mismatch */}
      {mounted && user && (
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-border-subtle bg-surface-overlay/40">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary leading-tight">{user.name}</p>
            <p className="truncate font-mono text-[10px] text-text-secondary">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Full Sidebar (used on desktop) ─────────────────────────────────────────

function DesktopSidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full border-r border-border-subtle bg-surface-base/90 backdrop-blur-md shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-0 border-r-0" : "w-64"
      )}
    >
      {/* Inner wrapper — fixed 256px so transition clips cleanly */}
      <div className="flex h-full w-64 flex-col overflow-hidden">
        <SidebarLogo />
        <SidebarNavItems onNavigate={onNavigate} />
        <SidebarUserFooter onNavigate={onNavigate} />
      </div>
    </aside>
  )
}

// ─── Top Header ─────────────────────────────────────────────────────────────

function DashboardTopBar({
  onToggleSidebar,
  sidebarCollapsed,
  onOpenMobileSidebar,
}: {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  onOpenMobileSidebar: () => void
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface-base/80 px-4 backdrop-blur-sm lg:px-5 z-10">
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden md:flex text-text-secondary hover:text-text-primary hover:bg-surface-hover"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeft className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>

        {/* Search bar — hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border-default bg-surface-overlay/70 px-3 py-2 text-sm text-text-secondary max-w-[28rem] cursor-pointer hover:border-border-strong hover:bg-surface-hover transition-colors duration-200">
          <Search className="size-3.5 shrink-0" />
          <span className="truncate text-xs">Search nodes, baskets...</span>
          <kbd className="ml-2 shrink-0 hidden md:inline-flex h-5 items-center gap-1 rounded border border-border-default bg-surface-raised px-1.5 font-mono text-[9px] text-text-tertiary">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-text-secondary hover:text-text-primary hover:bg-surface-hover relative"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(107,216,203,0.6)]" />
        </Button>

        <div className="h-6 w-px bg-border-subtle mx-0.5" />

        <Link
          href="/pulse"
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-on-primary shadow-[0_0_12px_rgba(107,216,203,0.2)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_18px_rgba(107,216,203,0.35)] active:scale-[0.97]"
        >
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">Start Session</span>
          <span className="sm:hidden">Go</span>
        </Link>
      </div>
    </header>
  )
}

// ─── Mobile Sidebar (Drawer) ─────────────────────────────────────────────────

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="left">
      <DrawerContent className="w-[84vw] max-w-[22rem] h-full flex flex-col border-r border-border-default bg-surface-base p-0 rounded-r-xl">
        {/* Close button row */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg border border-border-brand/50 bg-primary/15 text-primary">
              <Brain className="size-3.5" />
            </div>
            <span className="font-display text-sm font-bold text-text-primary">Memorize</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>
        {/* Nav */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNavItems onNavigate={onClose} />
        </div>
        <SidebarUserFooter onNavigate={onClose} />
      </DrawerContent>
    </Drawer>
  )
}

// ─── Main Shell ──────────────────────────────────────────────────────────────

/**
 * DashboardShell — The canonical dashboard layout.
 *
 * Structure (desktop):
 *   <div h-screen overflow-hidden flex>          ← viewport-locked outer shell
 *     <aside w-64 h-full flex-col>               ← sidebar (never scrolls the page)
 *     <div flex-1 flex-col h-full overflow-hidden>
 *       <header h-16 shrink-0>                   ← sticky top bar
 *       <main flex-1 min-h-0 overflow-y-auto>    ← THE ONLY scroll container
 *
 * The `min-h-0` on <main> is the critical fix: in a flex column, children
 * default to `min-height: auto`, which means they expand to fit content and
 * never trigger overflow. `min-h-0` overrides this, capping the main area
 * at whatever height is left after the header, enabling overflow-y-auto.
 *
 * Lenis smooth scroll runs on <html>, but since the dashboard wrapper is
 * `overflow-hidden`, Lenis sees no scrollable content on <html> and skips it.
 * The <main> scroll container scrolls natively (fast, no Lenis interference).
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  return (
    // Outer: full viewport, no overflow. This prevents Lenis from touching the dashboard body scroll.
    <div className="flex h-screen overflow-hidden bg-surface-void text-text-primary">

      {/* ── Desktop Sidebar ── */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onNavigate={undefined}
      />

      {/* ── Right column: topbar + scrollable main ── */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">

        {/* Topbar — fixed height, never scrolls */}
        <DashboardTopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Main content — THE ONLY SCROLL ZONE */}
        {/* min-h-0 is critical — without it, flex children won't scroll in a column flex container */}
        {/* data-lenis-prevent tells Lenis to NOT intercept scroll events here → native overflow-y-auto works */}
        <main className="flex-1 min-h-0 overflow-y-auto" data-lenis-prevent>
          <div className="h-full p-4 md:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile Drawer Sidebar ── */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Brain,
  ChevronLeft,
  CheckCheck,
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
  BarChart3,
  Moon,
  Monitor,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/use-auth-store"
import { type NotificationItem } from "@/services/notification-service"
import { useNotifications, useMarkAsReadMutation, useMarkAllAsReadMutation } from "@/hooks/use-notifications"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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
  { label: "Sleep Tracker",icon: Moon,       path: "/sleep" },
  { label: "Analytics Hub",icon: BarChart3,  path: "/stats" },
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

function DesktopSidebar({
  collapsed,
  isDesktopView,
  onNavigate,
}: {
  collapsed: boolean;
  isDesktopView: boolean;
  onNavigate?: () => void;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border-subtle bg-surface-base/90 backdrop-blur-md shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        isDesktopView ? "w-64" : (collapsed ? "w-0 border-r-0" : "w-64 hidden md:flex")
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
  isDesktopView,
  onToggleDesktopView,
}: {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  onOpenMobileSidebar: () => void
  isDesktopView: boolean
  onToggleDesktopView: () => void
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  const queryClient = useQueryClient()
  const { data: notificationsList = [], isLoading } = useNotifications()
  const markAsReadMutation = useMarkAsReadMutation()
  const markAllAsReadMutation = useMarkAllAsReadMutation()

  React.useEffect(() => {
    if (!user) return

    // Establishes a persistent SSE stream to capture real-time database pushes
    const token = useAuthStore.getState().token
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const url = token 
      ? `${baseURL}/api/notifications/stream?token=${encodeURIComponent(token)}` 
      : `${baseURL}/api/notifications/stream`

    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.connected) {
          console.log('[SSE] Stream connected successfully')
          return
        }

        // Live Cache Invalidation and Injection
        queryClient.setQueryData<NotificationItem[]>(['notifications'], (old) => {
          if (!old) return [payload]
          if (old.some((n) => n.id === payload.id)) return old
          return [payload, ...old]
        })

        // Fire toast visual alert
        toast.info(`🔔 ${payload.title}`, {
          description: payload.body,
          action: {
            label: "Open",
            onClick: () => {
              if (payload.type === 'study_reminder') router.push('/pulse')
              else if (payload.type === 'sleep_alert') router.push('/sleep')
            }
          }
        })
      } catch (e) {
        console.error('[SSE] Failed to parse stream event:', e)
      }
    }

    eventSource.onerror = (e) => {
      console.warn('[SSE] EventSource disconnected. Standard React Query poll fallback active.', e)
    }

    return () => {
      eventSource.close()
    }
  }, [user, queryClient, router])

  // Handle click outside to close the dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notificationsList.filter(n => !n.read).length

  async function handleMarkAllAsRead() {
    try {
      await markAllAsReadMutation.mutateAsync()
    } catch (e) {
      console.error('[Notifications] Mark all read failed:', e)
    }
  }

  async function handleNotificationClick(item: NotificationItem) {
    try {
      if (!item.read) {
        await markAsReadMutation.mutateAsync(item.id)
      }
      setDropdownOpen(false)
      if (item.type === 'study_reminder') {
        router.push('/pulse')
      } else if (item.type === 'sleep_alert') {
        router.push('/sleep')
      }
    } catch (e) {
      console.error('[Notifications] Click notification failed:', e)
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface-base/80 px-4 backdrop-blur-sm lg:px-5 z-10">
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
            isDesktopView ? "hidden" : "md:hidden"
          )}
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
            isDesktopView ? "flex" : "hidden md:flex"
          )}
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeft className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>

        {/* Search bar — hidden on small screens */}
        <div className={cn(
          "items-center gap-2 rounded-lg border border-border-default bg-surface-overlay/70 px-3 py-2 text-sm text-text-secondary max-w-[28rem] cursor-pointer hover:border-border-strong hover:bg-surface-hover transition-colors duration-200",
          isDesktopView ? "flex" : "hidden sm:flex"
        )}>
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
          className="text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
          onClick={onToggleDesktopView}
          aria-label={isDesktopView ? "Switch to Mobile View" : "Switch to Desktop View"}
          title={isDesktopView ? "Switch to Mobile View" : "Switch to Desktop View"}
        >
          {isDesktopView ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
        </Button>

        <div className="relative flex items-center" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              "text-text-secondary hover:text-text-primary hover:bg-surface-hover relative transition-all duration-200",
              dropdownOpen && "text-primary bg-surface-hover"
            )}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary shadow-[0_0_6px_rgba(107,216,203,0.8)]"></span>
              </span>
            )}
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-80 max-h-[28rem] overflow-hidden rounded-2xl border border-border-subtle bg-surface-base/90 backdrop-blur-md shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 bg-surface-overlay/30 shrink-0">
                <span className="text-xs font-bold text-text-primary tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-fixed transition-colors"
                  >
                    <CheckCheck className="size-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-80 divide-y divide-border-subtle/50" data-lenis-prevent>
                {isLoading && notificationsList.length === 0 ? (
                  <div className="flex items-center justify-center p-8 text-xs text-text-tertiary">
                    Loading notifications...
                  </div>
                ) : notificationsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-surface-hover text-text-tertiary mb-2">
                      <Bell className="size-4" />
                    </div>
                    <p className="text-xs font-bold text-text-secondary">All caught up!</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">No new study alerts or sleep notifications.</p>
                  </div>
                ) : (
                  notificationsList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        "p-3 text-left cursor-pointer transition-colors duration-150 hover:bg-surface-hover",
                        !item.read ? "bg-primary/5" : "bg-transparent"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!item.read && (
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_6px_rgba(107,216,203,0.8)]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text-primary leading-snug truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
                            {item.body}
                          </p>
                          <p className="text-[9px] font-mono text-text-tertiary mt-1.5">
                            {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border-subtle mx-0.5" />

        <Link
          href="/pulse"
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-bold text-on-primary shadow-[0_0_12px_rgba(107,216,203,0.2)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_18px_rgba(107,216,203,0.35)] active:scale-[0.97]"
        >
          <Sparkles className="size-3.5" />
          <span className={cn(isDesktopView ? "inline" : "hidden sm:inline")}>Start Session</span>
          {!isDesktopView && <span className="sm:hidden">Go</span>}
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
  const [isDesktopView, setIsDesktopView] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem("force-desktop-view")
    if (saved === "true") {
      setIsDesktopView(true)
    }
  }, [])

  const handleToggleDesktopView = () => {
    setIsDesktopView((prev) => {
      const next = !prev
      localStorage.setItem("force-desktop-view", String(next))
      toast.success(next ? "Forced Desktop View active" : "Responsive View active")
      return next
    })
  }

  return (
    // Outer: full viewport. If isDesktopView is true, we allow horizontal overflow of the 1280px canvas!
    <div className={cn(
      "flex h-screen bg-surface-void text-text-primary",
      isDesktopView ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden"
    )}>

      {/* Viewport content wrapper for forced desktop layout */}
      <div className={cn(
        "flex flex-1 h-full min-w-0",
        isDesktopView ? "w-[1280px] min-w-[1280px] shrink-0" : "w-full"
      )}>

        {/* ── Desktop Sidebar ── */}
        <DesktopSidebar
          collapsed={sidebarCollapsed}
          isDesktopView={isDesktopView}
          onNavigate={undefined}
        />

        {/* ── Right column: topbar + scrollable main ── */}
        <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">

          {/* Topbar — fixed height, never scrolls */}
          <DashboardTopBar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            isDesktopView={isDesktopView}
            onToggleDesktopView={handleToggleDesktopView}
          />

          {/* Main content — THE ONLY SCROLL ZONE */}
          <main className="flex-1 min-h-0 overflow-y-auto animate-fade-in" data-lenis-prevent>
            <div className={cn(
              "h-full",
              isDesktopView ? "p-6" : "p-4 md:p-5 lg:p-6"
            )}>
              {children}
            </div>
          </main>
        </div>

      </div>

      {/* ── Mobile Drawer Sidebar ── */}
      {!isDesktopView && (
        <MobileSidebar
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  )
}

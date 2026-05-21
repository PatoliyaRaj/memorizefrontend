"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  Brain,
  CalendarDays,
  LayoutGrid,
  Menu,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

type DashboardShellProps = {
  children: React.ReactNode
}

type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Today's Pulse", icon: Sparkles, path: "/pulse" },
  { label: "My Baskets", icon: Brain, path: "/baskets" },
  { label: "Neural Map", icon: CalendarDays, path: "/neuralmap" },
]

function SidebarNav({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full border border-border-brand/70 bg-primary/15 text-primary">
            <Brain className="size-4" />
          </div>
          <div>
            <p className="font-display text-lg leading-5 text-text-primary">Memorize</p>
            <p className="font-body text-xs text-text-secondary">Scientific Learning</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = index === 0

          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-surface-hover text-text-primary"
                  : "text-text-secondary hover:bg-surface-hover/70 hover:text-text-primary"
              )}
            >
              <Link href={item.path || "#"} className="flex items-center gap-3 w-full">
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-border-subtle px-3 py-4">
        <button
          type="button"
          className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover/70 hover:text-text-primary"
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </button>
        <Button className="w-full justify-center bg-primary text-on-primary hover:bg-primary/90">
          <Plus className="size-4" />
          New Session
        </Button>
      </div>
    </div>
  )
}

function DashboardTopBar({
  onToggleSidebar,
  sidebarHidden,
}: {
  onToggleSidebar: () => void
  sidebarHidden: boolean
}) {
  return (
    <header className="flex h-[var(--dashboard-header-height)] items-center justify-between gap-3 border-b border-border-subtle bg-surface-base/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-text-secondary hover:text-text-primary"
          onClick={onToggleSidebar}
          aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
        >
          <PanelLeft className="size-4" />
        </Button>

        <div className="hidden max-w-[30rem] items-center gap-2 rounded-lg border border-border-default bg-surface-overlay px-3 py-2 text-sm text-text-secondary md:flex">
          <Search className="size-4" />
          <span className="truncate">Search nodes, baskets...</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <div className="h-8 w-px bg-border-subtle" />
        <Button className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-on-primary hover:bg-primary/90">
          Start Session
        </Button>
      </div>
    </header>
  )
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [desktopSidebarHidden, setDesktopSidebarHidden] = React.useState(false)

  return (
    <div className="min-h-screen bg-surface-void text-text-primary">
      <div className="md:hidden">
        <header className="sticky top-0 z-30 flex h-[var(--dashboard-header-height)] items-center justify-between border-b border-border-subtle bg-surface-base/90 px-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="font-display text-base text-text-primary">Dashboard</h1>
          <Button size="sm" className="h-8 bg-primary px-3 text-xs text-on-primary hover:bg-primary/90">
            New Session
          </Button>
        </header>

        {mobileSidebarOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/55"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-[84vw] max-w-[22rem] border-r border-border-default bg-surface-base shadow-lg">
              <div className="flex items-center justify-between border-b border-border-subtle px-3 py-3">
                <span className="font-display text-sm text-text-primary">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  aria-label="Close sidebar"
                >
                  <X className="size-4" />
                </button>
              </div>
              <SidebarNav className="h-[calc(100%-3.25rem)]" />
            </aside>
          </>
        ) : null}

        <main className="p-[var(--dashboard-shell-padding)]">{children}</main>
      </div>

      <div className="hidden h-screen md:block">
        {desktopSidebarHidden ? (
          <div className="flex h-full flex-col">
            <DashboardTopBar
              sidebarHidden={desktopSidebarHidden}
              onToggleSidebar={() => setDesktopSidebarHidden((prev) => !prev)}
            />
            <main className="min-h-0 flex-1 overflow-auto p-[var(--dashboard-shell-padding)] lg:p-6">{children}</main>
          </div>
        ) : (
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            <ResizablePanel
              defaultSize={300}
              minSize={200}
              maxSize={400}
              collapsible
              collapsedSize={0}
              // onCollapse={() => setDesktopSidebarHidden(true)}
              className="min-w-0"
            >
              <aside className="h-full border-r border-border-default bg-surface-base/85 backdrop-blur-sm">
                <SidebarNav />
              </aside>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={400} minSize={300} className="min-w-0">
              <div className="flex h-full flex-col">
                <DashboardTopBar
                  sidebarHidden={desktopSidebarHidden}
                  onToggleSidebar={() => setDesktopSidebarHidden((prev) => !prev)}
                />
                <main className="min-h-0 flex-1 overflow-auto p-[var(--dashboard-shell-padding)] lg:p-6">
                  {children}
                </main>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

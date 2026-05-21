"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import {
  Group as ResizableGroup,
  Panel as ResizablePanelPrimitive,
  Separator as ResizableSeparator,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof ResizableGroup>) {
  return (
    <ResizableGroup
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ResizablePanelPrimitive>) {
  return (
    <ResizablePanelPrimitive {...props}>
      <div className={cn("h-full w-full min-w-0", className)}>
        {children}
      </div>
    </ResizablePanelPrimitive>
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizableSeparator> & { withHandle?: boolean }) {
  return (
    <ResizableSeparator
      className={cn(
        "relative flex w-1 items-center justify-center bg-border-default/30 transition-colors hover:bg-border-brand/50",
        "cursor-col-resize select-none touch-none",
        className
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-8 w-1 items-center justify-center">
          <div className="h-8 w-1 rounded-full bg-border-brand/60 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ) : null}
    </ResizableSeparator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

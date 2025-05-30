"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

/**
 * Định nghĩa type cho context
 */
type TabsContextType = {
  value: string
  onValueChange: (value: string) => void
}

// Tạo context với type đã định nghĩa
const TabsContext = React.createContext<TabsContextType | null>(null)

/**
 * Tabs container component
 */
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ children, value, onValueChange, className, ...props }, ref) => (
    <TabsContext.Provider value={{ value: value || "", onValueChange: onValueChange || (() => {}) }}>
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
)
Tabs.displayName = "Tabs"

/**
 * Tabs list component
 */
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
TabsList.displayName = "TabsList"

/**
 * Tabs trigger component
 */
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  asChild?: boolean
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, value, className, asChild = false, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    const isActive = value === context?.value
    
    const handleClick = () => {
      context?.onValueChange?.(value)
    }

    const Comp = asChild ? Slot : "button"

    return (
      <Comp 
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
          "ring-offset-background transition-colors focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive ? 
            "bg-background text-foreground shadow-sm" : 
            "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

/**
 * Tabs content component
 */
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, className, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    const isActive = value === context?.value
    
    if (!isActive) return null
    
    return (
      <div 
        ref={ref}
        role="tabpanel"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "mt-2 ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white shadow-sm hover:bg-neutral-900/90 active:scale-95",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-border bg-card shadow-sm hover:bg-accent/5",
        secondary:
          "bg-neutral-200 text-neutral-900 hover:bg-neutral-200/80",
        ghost:
          "rounded-xl hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Accent variants for domain-specific actions
        earn: "bg-[var(--accent-earn)] text-neutral-900 shadow-sm hover:brightness-105 hover:shadow-[var(--shadow-raised)] active:scale-95",
        save: "bg-[var(--accent-balance)] text-neutral-900 shadow-sm hover:brightness-105 active:scale-95",
        invest: "bg-[var(--accent-invest)] text-white shadow-sm hover:brightness-110 active:scale-95",
        spend: "bg-[var(--accent-spend)] text-neutral-900 shadow-sm hover:brightness-105 active:scale-95",
        donate: "bg-[var(--accent-donate)] text-neutral-900 shadow-sm hover:brightness-105 active:scale-95",
        upgrade: "bg-[var(--accent-upgrade)] text-white shadow-sm hover:brightness-110 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-12 px-8 py-3",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

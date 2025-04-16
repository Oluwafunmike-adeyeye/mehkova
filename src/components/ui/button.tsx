import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary button with perfect e-commerce radius
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] rounded-[10px]",
        // Destructive actions (like delete)
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 rounded-[10px]",
        // Outline for secondary actions
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-[10px]",
        // Secondary solid button
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-[10px]",
        // Ghost for toolbar-like buttons
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[10px]",
        // Text link style
        link: "text-primary underline-offset-4 hover:underline rounded-none",
        // Special pill-shaped for tags/categories
        pill: "rounded-full bg-primary/10 text-primary hover:bg-primary/20",
        // Sharp corners for minimalist designs
        sharp: "rounded-sm bg-primary text-primary-foreground"
      },
      size: {
        // Optimal sizes for e-commerce
        sm: "h-8 px-3 text-xs rounded-[8px]", // Small rounded corners
        md: "h-10 px-4 text-sm rounded-[10px]", // Perfect default
        lg: "h-12 px-6 text-base rounded-[12px]", // Larger with more curve
        xl: "h-14 px-8 text-lg rounded-[14px]", // Extra prominent
        icon: "h-10 w-10 rounded-[10px]", // Square with subtle rounding
        iconSm: "h-8 w-8 rounded-[8px]",
        iconLg: "h-12 w-12 rounded-[12px]"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        inner: "shadow-inner"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shadow: "md"
    },
    compoundVariants: [
      {
        variant: "link",
        size: "md",
        className: "rounded-none"
      },
      {
        variant: "pill",
        className: "rounded-full"
      }
    ]
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shadow, asChild = false, isLoading = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shadow, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/**
 * Props cho component Button
 * @param variant - Kiểu hiển thị của button
 * @param size - Kích thước của button
 * @param asChild - Cho phép chuyển component thành child component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

/**
 * Button component - Sử dụng Tailwind v4
 */
const Button = React.forwardRef<HTMLButtonElement | HTMLElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Base style 
    const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    // Variants
    const variants = {
      default: "bg-primary text-primary-foreground hover:opacity-90",
      destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    // Sizes
    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          baseStyle,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

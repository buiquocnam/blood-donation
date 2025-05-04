import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // Import Slot

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean; // Thêm asChild vào interface để nhận prop này
}

const Button = React.forwardRef<HTMLButtonElement | HTMLElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
    };

    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };

    // Chọn component: Nếu asChild = true, dùng Slot, nếu không thì dùng button
    const Comp = asChild ? Slot : "button";
    
    const variantClass = variants[variant];
    const sizeClass = sizes[size];

    // Truyền ref đến button hoặc Slot (nếu asChild là true)
    return (
      <Comp
        className={`${baseStyle} ${variantClass} ${sizeClass} ${className || ""}`}
        ref={ref as React.Ref<HTMLButtonElement>} // Ref cho phép cả button hoặc element khác
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

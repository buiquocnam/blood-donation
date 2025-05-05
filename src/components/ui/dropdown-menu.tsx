"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

// Hằng số style chung theo chức năng
const BASE_CLASSES = {
  // Animation
  animation:
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  
  // Components
  content: "dropdown-content", // CSS class từ globals.css
  item: "dropdown-item", // CSS class từ globals.css
  
  // States
  disabled: "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  focus: "focus:text-accent-foreground focus:bg-accent",
  hover: "hover-accent", // CSS class từ globals.css
  active: "active:bg-accent/90 active:text-accent-foreground",
  selected: "data-[state=open]:bg-primary data-[state=open]:text-primary-foreground",
};

/**
 * Thành phần gốc của Dropdown Menu.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * Nút kích hoạt Dropdown Menu.
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/**
 * Nhóm các mục trong Dropdown.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * Cổng để render nội dung Dropdown ngoài cây DOM.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * Submenu trong Dropdown.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * Nhóm radio trong Dropdown.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * Thành phần kích hoạt submenu.
 * @param inset - Thêm khoảng cách bên trái.
 * @param className - Class tùy chỉnh.
 * @param children - Nội dung hiển thị.
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      BASE_CLASSES.item,
      BASE_CLASSES.hover,
      BASE_CLASSES.selected,
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

/**
 * Nội dung của submenu.
 * @param className - Class tùy chỉnh.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      BASE_CLASSES.content,
      BASE_CLASSES.animation,
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

/**
 * Nội dung chính của Dropdown.
 * @param className - Class tùy chỉnh.
 * @param sideOffset - Khoảng cách từ trigger.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        BASE_CLASSES.content,
        BASE_CLASSES.animation,
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/**
 * Mục trong Dropdown.
 * @param inset - Thêm khoảng cách bên trái.
 * @param className - Class tùy chỉnh.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      BASE_CLASSES.item,
      BASE_CLASSES.hover,
      BASE_CLASSES.focus,
      BASE_CLASSES.disabled,
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * Mục checkbox trong Dropdown.
 * @param className - Class tùy chỉnh.
 * @param children - Nội dung hiển thị.
 * @param checked - Trạng thái checkbox.
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      BASE_CLASSES.item,
      BASE_CLASSES.hover,
      BASE_CLASSES.focus,
      BASE_CLASSES.disabled,
      "pl-8 pr-2",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

/**
 * Mục radio trong Dropdown.
 * @param className - Class tùy chỉnh.
 * @param children - Nội dung hiển thị.
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      BASE_CLASSES.item,
      BASE_CLASSES.hover,
      BASE_CLASSES.focus,
      BASE_CLASSES.disabled,
      "pl-8 pr-2",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

/**
 * Nhãn trong Dropdown.
 * @param inset - Thêm khoảng cách bên trái.
 * @param className - Class tùy chỉnh.
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/**
 * Đường phân cách trong Dropdown.
 * @param className - Class tùy chỉnh.
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

/**
 * Phím tắt trong Dropdown.
 * @param className - Class tùy chỉnh.
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

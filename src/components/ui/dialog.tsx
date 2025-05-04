"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Dialog = ({ children, open, onOpenChange, className }: DialogProps) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className={`z-50 ${className}`}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative bg-background p-6 shadow-lg rounded-lg max-w-lg w-full max-h-[85vh] overflow-auto ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogFooter = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

const DialogTrigger = ({ 
  children, 
  onClick
}: { 
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger
}; 
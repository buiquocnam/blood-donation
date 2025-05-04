"use client"

import * as React from "react";

// Định nghĩa type cho context
type TabsContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

// Tạo context với type đã định nghĩa
const TabsContext = React.createContext<TabsContextType | null>(null);

const Tabs = ({ 
  children, 
  value, 
  onValueChange, 
  className 
}: { 
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  children, 
  value, 
  className 
}: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const context = React.useContext(TabsContext);
  const isActive = value === context?.value;
  
  const handleClick = () => {
    context?.onValueChange?.(value);
  };

  return (
    <button 
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-accent hover:text-accent-foreground"} ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  children, 
  value, 
  className 
}: { 
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  const context = React.useContext(TabsContext);
  const isActive = value === context?.value;
  
  if (!isActive) return null;
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 
"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

interface DonorLayoutProps {
  children: ReactNode;
}

export default function DonorLayout({ children }: DonorLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="container mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
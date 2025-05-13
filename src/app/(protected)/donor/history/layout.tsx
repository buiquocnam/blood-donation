"use client";

import { ReactNode } from "react";

interface DonorHistoryLayoutProps {
  children: ReactNode;
}

export default function DonorHistoryLayout({ children }: DonorHistoryLayoutProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
} 
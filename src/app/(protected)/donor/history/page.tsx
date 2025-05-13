"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DonorHistoryRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "all";
  
  useEffect(() => {
    // Redirect to the appropriate specialized page based on tab parameter
    if (tab === "registration") {
      router.replace("/donor/history/registrations");
    } else if (tab === "donation") {
      router.replace("/donor/history/donations");
    } else {
      // Default to "all" for any other value
      router.replace("/donor/history/all");
    }
  }, [tab, router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
        <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-lg font-medium">Đang chuyển hướng...</h3>
            <p className="text-sm text-muted-foreground mt-1">Vui lòng đợi trong giây lát</p>
          </div>
    </div>
  );
} 
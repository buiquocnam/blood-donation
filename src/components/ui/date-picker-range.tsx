"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps {
  className?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  onChange: (date: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DatePickerWithRange({
  className,
  dateFrom,
  dateTo,
  onChange,
}: DatePickerWithRangeProps) {
  const [dateRange, setDateRange] = React.useState({
    from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : "",
    to: dateTo ? format(dateTo, "yyyy-MM-dd") : "",
  });

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setDateRange(prev => ({ ...prev, from: newFromDate }));
    onChange({
      from: newFromDate ? new Date(newFromDate) : undefined,
      to: dateRange.to ? new Date(dateRange.to) : undefined,
    });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setDateRange(prev => ({ ...prev, to: newToDate }));
    onChange({
      from: dateRange.from ? new Date(dateRange.from) : undefined,
      to: newToDate ? new Date(newToDate) : undefined,
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2 border rounded-md p-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground">Từ ngày</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={handleFromDateChange}
              className="w-full border-0 p-0 focus:outline-none text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-muted-foreground">Đến ngày</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={handleToDateChange}
              className="w-full border-0 p-0 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
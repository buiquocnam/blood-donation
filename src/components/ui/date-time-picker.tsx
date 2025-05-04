"use client"

import * as React from "react";
import { Button } from "./button";
import { Input } from "./input";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({ 
  value, 
  onChange, 
  className 
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<string>(
    value ? value.toISOString().slice(0, 10) : ""
  );
  
  const [time, setTime] = React.useState<string>(
    value ? value.toTimeString().slice(0, 5) : ""
  );
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    updateDateTime(e.target.value, time);
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    updateDateTime(date, e.target.value);
  };
  
  const updateDateTime = (newDate: string, newTime: string) => {
    if (!newDate || !newTime) {
      onChange?.(undefined);
      return;
    }
    
    try {
      const dateTimeString = `${newDate}T${newTime}:00`;
      const newDateTime = new Date(dateTimeString);
      onChange?.(newDateTime);
    } catch (error) {
      console.error("Invalid date or time format", error);
    }
  };
  
  const today = new Date().toISOString().slice(0, 10);
  
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex gap-2">
        <Input
          type="date"
          value={date}
          onChange={handleDateChange}
          min={today}
          className="flex-1"
        />
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="w-24"
        />
      </div>
    </div>
  );
}

export function DatePicker({ 
  selected, 
  onSelect, 
  minDate, 
  className 
}: { 
  selected?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      onSelect?.(date);
    }
  };
  
  const minDateString = minDate ? minDate.toISOString().slice(0, 10) : undefined;
  
  return (
    <Input
      type="date"
      value={selected ? selected.toISOString().slice(0, 10) : ""}
      onChange={handleChange}
      min={minDateString}
      className={className}
    />
  );
} 
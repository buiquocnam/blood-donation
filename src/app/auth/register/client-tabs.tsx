"use client";

import { useState, useCallback, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { THANHPHO } from "@/types/location";
import React from "react";
import { UserRegisterForm } from "@/features/auth/components/RegisterForm/UserRegisterForm";
import { VolunteerCenterRegisterForm } from "@/features/auth/components/RegisterForm/VolunteerCenterRegisterForm";

// Fallback loading component
const FormSkeleton = () => (
    <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-12 w-full rounded-md" />
        <div className="animate-pulse bg-gray-200 h-12 w-full rounded-md" />
        <div className="animate-pulse bg-gray-200 h-12 w-3/4 rounded-md" />
        <div className="animate-pulse bg-gray-200 h-48 w-full rounded-md" />
        <div className="animate-pulse bg-gray-200 h-12 w-full rounded-md" />
    </div>
);

interface ClientTabContentProps {
    initialCities?: THANHPHO[];
}

function ClientTabContentComponent({ initialCities = [] }: ClientTabContentProps) {
    const [activeTab, setActiveTab] = useState("user");
    
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
    }, []);
    
    // Tạo memo các components để tránh render lại không cần thiết
    const userForm = useMemo(() => <UserRegisterForm initialCities={initialCities} />, [initialCities]);
    const volunteerForm = useMemo(() => <VolunteerCenterRegisterForm initialCities={initialCities} />, [initialCities]);

    return (
        <>
            <Tabs.Root 
                value={activeTab} 
                onValueChange={handleTabChange}
                className="w-full"
            >
                <Tabs.List className="grid w-full grid-cols-2 mb-8 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                    <Tabs.Trigger 
                        value="user"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        Người dùng thông thường
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                        value="volunteer-center"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        Trưởng cơ sở tình nguyện
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="user" className="mt-0">
                    {userForm}
                </Tabs.Content>
                <Tabs.Content value="volunteer-center" className="mt-0">
                    {volunteerForm}
                </Tabs.Content>
            </Tabs.Root>
        </>
    );
}

// Sử dụng React.memo để tối ưu render
export const ClientTabContent = React.memo(ClientTabContentComponent);
"use client";

import { useState } from "react";
import { NotificationForm, NotificationList } from "@/features/blood-bank";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

export default function NotificationsPage() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Thông báo</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? (
            <>
              <XIcon className="h-4 w-4 mr-2" />
              Đóng biểu mẫu
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo thông báo mới
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tạo thông báo mới</CardTitle>
            <CardDescription>Tạo thông báo hiến máu mới gửi đến các trường/cơ sở tình nguyện</CardDescription>
          </CardHeader>
          <NotificationForm onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      <NotificationList />
    </div>
  );
}

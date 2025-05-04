

import { RegistrationApprovalList } from "@/features/blood-bank";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Sự kiện</h1>
      
      <RegistrationApprovalList />
    </div>
  );
} 
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrangThaiDangKy, TrangThaiHienMau } from "@/types";
import { RegistrationResponse } from "../types";
import { RegistrationDetailDialog } from "./RegistrationDetailDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarClock, Clock, Search, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RegistrationListProps {
  registrations: RegistrationResponse[];
  isLoading?: boolean;
  onStatusChange: (id: string, status: TrangThaiDangKy) => void;
  onBloodDonationStatusChange: (id: string, status: TrangThaiHienMau) => void;
}

export function RegistrationList({
  registrations,
  isLoading,
  onStatusChange,
  onBloodDonationStatusChange,
}: RegistrationListProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const filterRegistrations = (registrations: RegistrationResponse[]) => {
    if (!searchQuery) return registrations;
    
    const query = searchQuery.toLowerCase();
    return registrations.filter((registration) => {
      const name = registration.NGUOIHIENMAU?.HoTen?.toLowerCase() || "";
      const email = registration.NGUOIHIENMAU?.Email?.toLowerCase() || "";
      const phone = registration.NGUOIHIENMAU?.SDT?.toLowerCase() || "";
      
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  };

  const pendingRegistrations = filterRegistrations(
    registrations.filter(
      (registration) => registration.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET
    )
  );

  const approvedRegistrations = filterRegistrations(
    registrations.filter(
      (registration) => registration.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh sách đăng ký hiến máu</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các đăng ký hiến máu
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="h-8 px-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chờ duyệt: {pendingRegistrations.length}
          </Badge>
          <Badge variant="outline" className="h-8 px-4 flex items-center gap-2">
            <User2 className="h-4 w-4" />
            Đã duyệt: {approvedRegistrations.length}
          </Badge>
        </div>
      </div>

      <Card>
        <div className="border-b p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "approved")} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-background rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
            >
              Chờ duyệt ({pendingRegistrations.length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-background rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-12"
            >
              Đã duyệt ({approvedRegistrations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người hiến máu</TableHead>
                    <TableHead>Thông tin liên hệ</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRegistrations.map((registration) => (
                    <TableRow key={registration.MaDKiHienMau}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{registration.NGUOIHIENMAU?.HoTen}</span>
                          <span className="text-sm text-muted-foreground">
                            {registration.NGUOIHIENMAU?.GioiTinh ? 'Nam' : 'Nữ'} • {formatDate(registration.NGUOIHIENMAU?.NgaySinh)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{registration.NGUOIHIENMAU?.SDT}</span>
                          <span className="text-sm text-muted-foreground">{registration.NGUOIHIENMAU?.Email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(registration.NgayDangKi)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedRegistration(registration)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="approved" className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người hiến máu</TableHead>
                    <TableHead>Thông tin liên hệ</TableHead>
                    <TableHead>Trạng thái hiến máu</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRegistrations.map((registration) => (
                    <TableRow key={registration.MaDKiHienMau}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{registration.NGUOIHIENMAU?.HoTen}</span>
                          <span className="text-sm text-muted-foreground">
                            {registration.NGUOIHIENMAU?.GioiTinh ? 'Nam' : 'Nữ'} • {formatDate(registration.NGUOIHIENMAU?.NgaySinh)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{registration.NGUOIHIENMAU?.SDT}</span>
                          <span className="text-sm text-muted-foreground">{registration.NGUOIHIENMAU?.Email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          registration.TrangThaiHienMau === TrangThaiHienMau.DA_HIEN ? 'success' :
                          registration.TrangThaiHienMau === TrangThaiHienMau.TU_CHOI ? 'destructive' : 'secondary'
                        }>
                          {registration.TrangThaiHienMau || TrangThaiHienMau.CHO_HIEN}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedRegistration(registration)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>

      <RegistrationDetailDialog
        registration={selectedRegistration}
        isOpen={!!selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
        onStatusChange={onStatusChange}
        onBloodDonationStatusChange={onBloodDonationStatusChange}
      />
    </div>
  );
} 
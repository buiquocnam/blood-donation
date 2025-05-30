'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TrangThaiDangKy, TrangThaiHienMau } from '@/types';
import { formatDate } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ApproveRegistrationDialog } from './ApproveRegistrationDialog';
import { DonationRegistrationResponse } from '@/features/medical-staff/types';
import { useApproveRegistration } from '@/features/medical-staff/hooks';

interface RegistrationsListProps {
  eventId: string;
  initialRegistrations: DonationRegistrationResponse[];
}

/**
 * Danh sách đăng ký hiến máu cho một sự kiện
 */
export function RegistrationsList({ eventId, initialRegistrations }: RegistrationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<DonationRegistrationResponse | null>(null);
  const queryClient = useQueryClient();
  
  // Sử dụng hook để xử lý duyệt đơn
  const { approveRegistration, isApproving } = useApproveRegistration(eventId);
  
  // Lọc danh sách đăng ký theo từ khóa tìm kiếm
  const filteredRegistrations = initialRegistrations.filter((registration) => 
    registration.MaDKiHienMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.IdNguoiHienMau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý khi nhấn vào nút duyệt đơn
  const handleApproveClick = (registration: DonationRegistrationResponse) => {
    setSelectedRegistration(registration);
    setShowDialog(true);
  };
  
  // Xử lý sau khi duyệt đơn thành công
  const handleApproveSuccess = () => {
    // Cập nhật lại dữ liệu
    queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });

    // Đóng dialog
    setShowDialog(false);
    setSelectedRegistration(null);
  };
  
  // Helper để hiển thị trạng thái duyệt
  const getApprovalStatusBadge = (status: string) => {
    switch(status) {
      case TrangThaiDangKy.CHO_DUYET:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang chờ duyệt</Badge>;
      case TrangThaiDangKy.DA_DUYET:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã duyệt</Badge>;
      case TrangThaiDangKy.TU_CHOI:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Xử lý khi duyệt đơn
  const handleApprove = (registrationId: string, status: string, note?: string) => {
    approveRegistration(registrationId, status, note);
    handleApproveSuccess();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="sr-only">Tìm kiếm</Label>
          <Input
            id="search"
            placeholder="Tìm kiếm theo ID đăng ký hoặc ID người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredRegistrations.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">Không có đăng ký hiến máu nào cho sự kiện này.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Đăng Ký</TableHead>
                <TableHead>Tên Người Hiến</TableHead>
                <TableHead>Ngày Đăng Ký</TableHead>
                <TableHead>Trạng Thái Duyệt</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.MaDKiHienMau}>
                  <TableCell className="font-medium">{registration.MaDKiHienMau}</TableCell>
                  <TableCell>{registration.NGUOIHIENMAU.HoTen}</TableCell>
                  <TableCell>{formatDate(registration.NgayDangKi)}</TableCell>
                  <TableCell>{getApprovalStatusBadge(registration.TrangThaiDonDK)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveClick(registration as DonationRegistrationResponse)}
                      // disabled={registration.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET}
                    >
                      {registration.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET ? 'Duyệt' : 'Xem chi tiết'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedRegistration && (
        <ApproveRegistrationDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          registration={selectedRegistration}
          onApprove={handleApprove}
          isSubmitting={isApproving}
        />
      )}
    </div>
  );
} 
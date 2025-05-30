'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrangThaiHienMau } from '@/types';
import { DonationRegistrationResponse } from '@/features/medical-staff/types';
import { UpdateDonationStatusDialog } from './UpdateDonationStatusDialog'; 
import { useQueryClient } from '@tanstack/react-query';

interface DonationsListProps {
  eventId: string;
  initialDonations: DonationRegistrationResponse[];
}

/** 
 * Danh sách người đã hiến máu cho một sự kiện
 */       
export function DonationsList({ eventId, initialDonations }: DonationsListProps) {
  const [donations, setDonations] = useState<DonationRegistrationResponse[]>(initialDonations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<DonationRegistrationResponse | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredDonations = donations.filter((donation) => 
    donation.MaDKiHienMau?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.IdNguoiHienMau?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.NGUOIHIENMAU?.HoTen?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Xử lý khi nhấn vào nút cập nhật trạng thái
  const handleUpdateClick = (donation: DonationRegistrationResponse) => {
    setSelectedDonation(donation);
    setShowDialog(true);
  };
  
  // Cập nhật thành công
  const handleUpdateSuccess = () => {
    // Cập nhật lại dữ liệu
    queryClient.invalidateQueries({ queryKey: ['donations', eventId] });
  };
  
  // Helper để hiển thị trạng thái hiến máu
  const getDonationStatusBadge = (status: string) => {
    switch(status) {
      case TrangThaiHienMau.CHO_HIEN:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Chờ hiến</Badge>;
      case TrangThaiHienMau.DA_HIEN:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã hiến</Badge>;
      case TrangThaiHienMau.TU_CHOI:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Tìm kiếm người hiến máu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredDonations.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">Chưa có người hiến máu nào cho sự kiện này.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Đăng Ký</TableHead>
                <TableHead>Họ Tên</TableHead>
                <TableHead>Nhóm Máu</TableHead>
                <TableHead>Thông Số</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.MaDKiHienMau}>
                  <TableCell className="font-medium">{donation.MaDKiHienMau}</TableCell>
                  <TableCell>{donation.NGUOIHIENMAU?.HoTen || 'Không xác định'}</TableCell>
                  <TableCell>{donation.NGUOIHIENMAU?.MaNhomMau || 'Không xác định'}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>Chiều cao: {donation.ChieuCao} cm</div>
                      <div>Cân nặng: {donation.CanNang} kg</div>
                      <div>Nhiệt độ: {donation.NhietDo}°C</div>
                      <div>Nhịp tim: {donation.NhipTim} bpm</div>
                      <div>Huyết áp: {donation.HuyetAp}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getDonationStatusBadge(donation.TrangThaiHienMau)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateClick(donation)}
                    >
                      Cập nhật
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedDonation && (
        <UpdateDonationStatusDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          donation={selectedDonation}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
} 
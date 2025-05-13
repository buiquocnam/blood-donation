'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDonations } from '@/features/medical-staff/hooks';
import { DonationStatusBadge } from '@/features/medical-staff/components/common';
import { UpdateDonationStatusDialog } from '@/features/medical-staff/components/registrations';
import { ApproveRegistrationDialog } from '@/features/medical-staff/components/registrations';
import { formatDate } from '@/utils';

interface DonationsListProps {
  eventId: string;
}

/**
 * Hiển thị danh sách những người đã hiến máu cho một sự kiện
 */
export function DonationsList({ eventId }: DonationsListProps) {
  const {
    searchTerm,
    setSearchTerm,
    filteredDonations,
    isLoading,
    error,
    selectedDonation,
    setSelectedDonation,
    updateStatusDialogOpen,
    setUpdateStatusDialogOpen,
    handleOpenUpdateDialog
  } = useDonations(eventId);
  
  if (isLoading) {
    return <div className="py-10 text-center">Đang tải danh sách hiến máu...</div>;
  }
  
  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách hiến máu
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tổng số: {filteredDonations.length} người hiến máu</h3>
        <Input
          placeholder="Tìm kiếm theo tên, mã số..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredDonations.length === 0 ? (
        <div className="text-center py-10">
          Không tìm thấy người hiến máu phù hợp
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đăng ký</TableHead>
              <TableHead>Người hiến máu</TableHead>
              <TableHead>Nhóm máu</TableHead>
              <TableHead>Chỉ số sinh hiệu</TableHead>
              <TableHead>Ngày hiến</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.map((donation) => (
              <TableRow key={donation.MaDKiHienMau}>
                <TableCell className="font-medium">{donation.MaDKiHienMau}</TableCell>
                <TableCell>{donation.HoTen || donation.IdNguoiHienMau}</TableCell>
                <TableCell>{donation.MaNhomMau || 'Không xác định'}</TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    {donation.NhietDo && <div>Nhiệt độ: {donation.NhietDo}°C</div>}
                    {donation.NhipTim && <div>Nhịp tim: {donation.NhipTim} bpm</div>}
                    {donation.HuyetAp && <div>Huyết áp: {donation.HuyetAp}</div>}
                  </div>
                </TableCell>
                <TableCell>{formatDate(donation.NgayHienMau)}</TableCell>
                <TableCell>
                  <DonationStatusBadge status={donation.TrangThaiHienMau} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenUpdateDialog(donation.MaDKiHienMau)}
                  >
                    Cập nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Dialog cập nhật trạng thái hiến máu */}
      {selectedDonation && (
        <UpdateDonationStatusDialog
          open={updateStatusDialogOpen}
          onOpenChange={setUpdateStatusDialogOpen}
          registrationId={selectedDonation}
          onSuccess={() => {
            setUpdateStatusDialogOpen(false);
          }}
        />
      )}
      
      {/* Dialog xem chi tiết đơn đăng ký (view only) */}
      {selectedDonation && (
        <ApproveRegistrationDialog
          open={false} // Chỉ hiển thị khi cần thiết bằng cách thay đổi state
          onOpenChange={() => {}} // Thêm handler nếu cần
          registrationId={selectedDonation}
          onApprove={() => {}} // Trong chế độ xem, hàm này không được gọi
          viewOnly={true}
        />
      )}
    </div>
  );
} 
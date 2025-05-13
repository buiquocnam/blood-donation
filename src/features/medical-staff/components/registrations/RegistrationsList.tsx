'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { useRegistrations } from '@/features/medical-staff/hooks';
import { RegistrationStatusBadge } from '@/features/medical-staff/components/common';
import { ApproveRegistrationDialog } from '@/features/medical-staff/components/registrations/ApproveRegistrationDialog';
import { UpdateDonationStatusDialog } from '@/features/medical-staff/components/registrations/UpdateDonationStatusDialog';
import { DANGKIHIENMAU, NGUOIDUNG, TrangThaiDangKy } from '@/types';
import { formatDate } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface RegistrationsListProps {
  eventId: string;
}

/**
 * Hiển thị danh sách đăng ký hiến máu cho một sự kiện
 */
export function RegistrationsList({ eventId }: RegistrationsListProps) {
  const [userMap, setUserMap] = useState<Record<string, NGUOIDUNG | null>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  const {
    searchTerm,
    setSearchTerm,
    filteredRegistrations,
    isLoading,
    error,
    approveDialogOpen,
    setApproveDialogOpen,
    selectedRegistration,
    setSelectedRegistration,
    handleOpenApproveDialog,
    handleApprove,
    updateStatusDialogOpen, 
    setUpdateStatusDialogOpen,
    getUserInfo
  } = useRegistrations(eventId);

  // Tạo memoized function để fetch thông tin người dùng
  const fetchUserInfo = useCallback(async (userId: string) => {
    if (userMap[userId] !== undefined) return;
    
    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      const userData = await getUserInfo(userId);
      setUserMap(prev => ({ ...prev, [userId]: userData }));
    } catch (err) {
      console.error(`Lỗi khi lấy thông tin người dùng ${userId}:`, err);
      setUserMap(prev => ({ ...prev, [userId]: null }));
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  }, [getUserInfo, userMap]);

  // Fetch thông tin người dùng cho một đăng ký cụ thể khi hiển thị
  const getUserData = (userId: string) => {
    if (!userMap[userId] && !loadingUsers[userId]) {
      // Chỉ fetch khi cần hiển thị và chưa fetch
      fetchUserInfo(userId);
    }
    return userMap[userId];
  };
  
  // Xử lý mở dialog cập nhật trạng thái hiến máu
  const handleOpenUpdateDialog = (registrationId: string) => {
    setSelectedRegistration(registrationId);
    setUpdateStatusDialogOpen(true);
  };
  
  if (isLoading) {
    return <div className="py-10 text-center">Đang tải danh sách đăng ký...</div>;
  }
  
  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách đăng ký
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tổng số: {filteredRegistrations.length} người đăng ký</h3>
        <Input
          placeholder="Tìm kiếm theo tên, SĐT, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-10">
          Không tìm thấy đăng ký phù hợp
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nhóm máu</TableHead>
              <TableHead>Ngày đăng ký</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((reg: DANGKIHIENMAU) => {
              const isLoadingUser = loadingUsers[reg.IdNguoiHienMau];
              const user = getUserData(reg.IdNguoiHienMau);
              
              return (
                <TableRow key={reg.MaDKiHienMau}>
                  <TableCell className="font-medium">
                    {isLoadingUser ? (
                      <Skeleton className="h-5 w-32" />
                    ) : (
                      user?.HoTen || 'Không xác định'
                    )}
                  </TableCell>
                  <TableCell>
                    {isLoadingUser ? (
                      <Skeleton className="h-5 w-24" />
                    ) : (
                      user?.SDT || 'Không xác định'
                    )}
                  </TableCell>
                  <TableCell>
                    {isLoadingUser ? (
                      <Skeleton className="h-5 w-40" />
                    ) : (
                      user?.Email || 'Không xác định'
                    )}
                  </TableCell>
                  <TableCell>
                    {isLoadingUser ? (
                      <Skeleton className="h-5 w-16" />
                    ) : (
                      user?.MaNhomMau || 'Không xác định'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(reg.NgayDangKi)}</TableCell>
                  <TableCell>
                    <RegistrationStatusBadge status={reg.TrangThaiDonDK} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Hiển thị nút duyệt nếu đơn chưa được duyệt */}
                      {reg.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenApproveDialog(reg.MaDKiHienMau)}
                        >
                          Duyệt
                        </Button>
                      )}
                      
                      {/* Hiển thị nút cập nhật trạng thái hiến máu nếu đơn đã được duyệt */}
                      {reg.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenUpdateDialog(reg.MaDKiHienMau)}
                        >
                          Cập nhật TT hiến máu
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      
      {/* Dialog duyệt đơn đăng ký */}
      {selectedRegistration && (
        <ApproveRegistrationDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          registrationId={selectedRegistration}
          onApprove={handleApprove}
        />
      )}
      
      {/* Dialog cập nhật trạng thái hiến máu */}
      {selectedRegistration && (
        <UpdateDonationStatusDialog
          open={updateStatusDialogOpen}
          onOpenChange={setUpdateStatusDialogOpen}
          registrationId={selectedRegistration}
          onSuccess={() => {
            // Cập nhật sau khi lưu thành công
            setUpdateStatusDialogOpen(false);
          }}
        />
      )}
    </div>
  );
} 
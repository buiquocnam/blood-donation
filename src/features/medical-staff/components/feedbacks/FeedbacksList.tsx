'use client';

import { useState } from 'react';
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
import { useFeedbacks } from '@/features/medical-staff/hooks';
import { FeedbackStatusBadge } from '@/features/medical-staff/components/feedbacks/FeedbackStatusBadge';
import { UpdateFeedbackStatusDialog } from '@/features/medical-staff/components/feedbacks/UpdateFeedbackStatusDialog';
import { PhanHoiWithUserInfo } from '@/features/medical-staff/types';
import { formatDate } from '@/utils';

/**
 * Hiển thị danh sách phản hồi của người hiến máu
 */
export function FeedbacksList() {
  const {
    searchTerm,
    setSearchTerm,
    filteredFeedbacks,
    isLoading,
    error,
    updateDialogOpen,
    setUpdateDialogOpen,
    selectedFeedback,
    setSelectedFeedback,
    handleOpenUpdateDialog,
  } = useFeedbacks();
  
  // Xử lý mở dialog cập nhật trạng thái
  const handleOpenDialog = (feedbackId: string) => {
    handleOpenUpdateDialog(feedbackId);
  };
  
  if (isLoading) {
    return <div className="py-10 text-center">Đang tải danh sách phản hồi...</div>;
  }
  
  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách phản hồi
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Phản hồi của người hiến máu ({filteredFeedbacks.length})</h3>
        <Input
          placeholder="Tìm kiếm theo mã phản hồi, tên người hiến máu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-10">
          Không tìm thấy phản hồi phù hợp
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phản hồi</TableHead>
              <TableHead>Người hiến máu</TableHead>
              <TableHead>Mã đăng ký</TableHead>
              <TableHead>Ngày phản hồi</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbacks.map((feedback: PhanHoiWithUserInfo) => {
              return (
                <TableRow key={feedback.MaPhanHoi}>
                  <TableCell className="font-medium">
                    {feedback.MaPhanHoi}
                  </TableCell>
                  <TableCell>
                    {feedback.NguoiHienMau?.HoTen || 'Không xác định'}
                  </TableCell>
                  <TableCell>
                    {feedback.MaDKiKienMau}
                  </TableCell>
                  <TableCell>
                    {formatDate(feedback.NgayPhanHoi)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.TinhTrangMoTa}
                  </TableCell>
                  <TableCell>
                    <FeedbackStatusBadge status={feedback.TrangThaiXuLy} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(feedback.MaPhanHoi)}
                    >
                      Xử lý
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      
      {/* Dialog cập nhật trạng thái xử lý phản hồi */}
      {selectedFeedback && (
        <UpdateFeedbackStatusDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          feedbackId={selectedFeedback}
        />
      )}
    </div>
  );
} 
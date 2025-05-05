"use client"

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle, XCircle } from 'lucide-react';

// Types
import type { RegistrationRequest } from '../types';

// Hooks và services
import { useOrganizationRequests } from '../hooks/useOrganizationRequests';
import { mockRegistrationRequests } from '../mock/data';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationProps, Pagination } from '@/components/ui/pagination';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Label } from '@/components/ui/label';

// Constants
const STATUS_BADGE_VARIANT: Record<string, 'default' | 'success' | 'destructive'> = {
  pending: 'default',
  approved: 'success',
  rejected: 'destructive',
};

const STATUS_TRANSLATION: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

const ITEMS_PER_PAGE = 5;

// Interfaces
interface EventFormValues {
  TgBatDauSK: string;
  TgKetThucSK: string;
  HanDK: string;
}

interface RegistrationApprovalListProps {
  notificationId?: string;
}

/**
 * Component hiển thị trạng thái của đăng ký
 */
const RequestStatus = ({ status }: { status: string }) => (
  <Badge variant={STATUS_BADGE_VARIANT[status || 'pending']}>
    {STATUS_TRANSLATION[status || 'pending']}
  </Badge>
);

/**
 * Component phân trang cho bảng
 */
const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: PaginationProps['onPageChange'] 
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

/**
 * Component hiển thị hộp thoại từ chối đăng ký
 */
const RejectDialog = ({ 
  open, 
  onOpenChange, 
  rejectReason, 
  onReasonChange, 
  onConfirm, 
  isPending 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  rejectReason: string; 
  onReasonChange: (reason: string) => void; 
  onConfirm: () => void; 
  isPending: boolean; 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Từ chối đăng ký</DialogTitle>
        <DialogDescription>
          Vui lòng cung cấp lý do từ chối đăng ký này.
        </DialogDescription>
      </DialogHeader>
      <Textarea
        value={rejectReason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Nhập lý do từ chối..."
        className="min-h-24"
      />
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Hủy
        </Button>
        <Button 
          variant="destructive" 
          onClick={onConfirm}
          disabled={!rejectReason.trim() || isPending}
        >
          {isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/**
 * Component hiển thị hộp thoại tạo sự kiện
 */
const CreateEventDialog = ({ 
  open, 
  onOpenChange, 
  eventForm, 
  onEventFormChange, 
  onCreateEvent, 
  isPending 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  eventForm: EventFormValues; 
  onEventFormChange: (form: EventFormValues) => void; 
  onCreateEvent: () => void; 
  isPending: boolean; 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Tạo sự kiện hiến máu</DialogTitle>
        <DialogDescription>
          Thiết lập thông tin cho sự kiện hiến máu mới.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Thời gian bắt đầu sự kiện</Label>
          <DateTimePicker
            value={eventForm.TgBatDauSK ? new Date(eventForm.TgBatDauSK) : undefined}
            onChange={(date) => {
              onEventFormChange({
                ...eventForm,
                TgBatDauSK: date ? date.toISOString() : '',
              });
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Thời gian kết thúc sự kiện</Label>
          <DateTimePicker
            value={eventForm.TgKetThucSK ? new Date(eventForm.TgKetThucSK) : undefined}
            onChange={(date) => {
              onEventFormChange({
                ...eventForm,
                TgKetThucSK: date ? date.toISOString() : '',
              });
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registrationDeadline">Hạn đăng ký hiến máu</Label>
          <DateTimePicker
            value={eventForm.HanDK ? new Date(eventForm.HanDK) : undefined}
            onChange={(date) => {
              onEventFormChange({
                ...eventForm,
                HanDK: date ? date.toISOString() : '',
              });
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Hủy
        </Button>
        <Button 
          onClick={onCreateEvent}
          disabled={!eventForm.TgBatDauSK || !eventForm.TgKetThucSK || !eventForm.HanDK || isPending}
        >
          {isPending ? 'Đang tạo sự kiện...' : 'Tạo sự kiện'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/**
 * Component chính hiển thị danh sách đăng ký cần phê duyệt
 */
export function RegistrationApprovalList({ notificationId }: RegistrationApprovalListProps) {
  // Hooks và state
  const { 
    pendingRequests, 
    isPendingLoading, 
    approveRequest, 
    rejectRequest, 
    createEvent,
  } = useOrganizationRequests();
  
  // State cho tương tác với đăng ký
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  
  // State cho form tạo sự kiện
  const [eventForm, setEventForm] = useState<EventFormValues>({
    TgBatDauSK: '',
    TgKetThucSK: '',
    HanDK: '',
  });
  
  // State cho danh sách đăng ký theo thông báo
  const [notificationRequests, setNotificationRequests] = useState<RegistrationRequest[]>([]);
  const [isNotificationRequestsLoading, setIsNotificationRequestsLoading] = useState(false);
  
  // Tải dữ liệu khi notificationId thay đổi
  useEffect(() => {
    const fetchNotificationRequests = async () => {
      if (!notificationId) return;
      
      setIsNotificationRequestsLoading(true);
      try {
        const { organizationRequestService } = await import('../services/organizationRequestService');
        const requests = await organizationRequestService.getRequestsByNotificationId(notificationId);
        setNotificationRequests(requests);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đăng ký:', error);
        setNotificationRequests([]);
      } finally {
        setIsNotificationRequestsLoading(false);
      }
    };
    
    fetchNotificationRequests();
    setCurrentPage(1);
  }, [notificationId]);

  // Các hàm xử lý dữ liệu
  const getDisplayRequests = (): RegistrationRequest[] => {
    if (notificationId) {
      return notificationRequests;
    } else {
      return pendingRequests || mockRegistrationRequests.filter(req => req.TinhTrangDK === 'pending');
    }
  };

  // Chuẩn bị dữ liệu hiển thị
  const displayRequests = getDisplayRequests();
  const isLoading = (notificationId ? isNotificationRequestsLoading : isPendingLoading) && !displayRequests.length;
  const totalRequests = displayRequests.length;
  const totalPages = Math.ceil(totalRequests / ITEMS_PER_PAGE);
  const paginatedRequests = displayRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Event handlers
  const handleApprove = async (request: RegistrationRequest) => {
    try {
      await approveRequest.mutateAsync(request.IdDangKiTC);
      setSelectedRequest(request);
      setShowCreateEventDialog(true);
    } catch (error) {
      console.error('Lỗi khi phê duyệt đăng ký:', error);
    }
  };

  const handleReject = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const handleRejectReasonChange = (value: string) => {
    setRejectReason(value);
  };

  const confirmReject = async () => {
    if (!selectedRequest) return;
    
    try {
      await rejectRequest.mutateAsync({
        id: selectedRequest.IdDangKiTC,
        reason: rejectReason,
      });
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Lỗi khi từ chối đăng ký:', error);
    }
  };

  const handleEventFormChange = (form: EventFormValues) => {
    setEventForm(form);
  };

  const handleCreateEvent = async () => {
    if (!selectedRequest) return;
    
    try {
      await createEvent.mutateAsync({
        registrationId: selectedRequest.IdDangKiTC,
        eventData: eventForm,
      });
      setShowCreateEventDialog(false);
      setEventForm({
        TgBatDauSK: '',
        TgKetThucSK: '',
        HanDK: '',
      });
      setSelectedRequest(null);
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện hiến máu:', error);
    }
  };

  const handlePaginationChange: PaginationProps['onPageChange'] = (page) => {
    setCurrentPage(page);
  };

  // Render loading state
  if (isLoading) {
    return <div className="py-10 text-center">Đang tải dữ liệu...</div>;
  }

  // Render empty state
  if (!displayRequests || displayRequests.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {notificationId 
          ? "Chưa có cơ sở tình nguyện nào đăng ký cho thông báo này"
          : "Không có đăng ký nào đang chờ duyệt"}
      </div>
    );
  }

  // Render data table
  const renderRequestsTable = () => (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cơ sở tình nguyện</TableHead>
            {!notificationId && <TableHead>Thông báo</TableHead>}
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRequests.map((request: RegistrationRequest) => (
            <TableRow key={request.IdDangKiTC}>
              <TableCell className="font-medium">
                {request.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Không xác định'}
              </TableCell>
              {!notificationId && (
                <TableCell>{request.ThongBao?.TieuDe || 'Không xác định'}</TableCell>
              )}
              <TableCell>
                {request.NgayDangKi 
                  ? format(new Date(request.NgayDangKi), 'dd/MM/yyyy HH:mm', { locale: vi })
                  : 'Không xác định'
                }
              </TableCell>
              <TableCell>
                <RequestStatus status={request.TinhTrangDK} />
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                {request.TinhTrangDK === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(request)}
                      disabled={approveRequest.isPending}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Duyệt
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleReject(request)}
                      disabled={rejectRequest.isPending}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Từ chối
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePaginationChange}
      />
    </>
  );

  // Render dialogs 
  const renderDialogs = () => (
    <>
      <RejectDialog 
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        rejectReason={rejectReason}
        onReasonChange={handleRejectReasonChange}
        onConfirm={confirmReject}
        isPending={rejectRequest.isPending}
      />

      <CreateEventDialog 
        open={showCreateEventDialog}
        onOpenChange={setShowCreateEventDialog}
        eventForm={eventForm}
        onEventFormChange={handleEventFormChange}
        onCreateEvent={handleCreateEvent}
        isPending={createEvent.isPending}
      />
    </>
  );

  // Render theo context - chi tiết thông báo hoặc dashboard
  if (notificationId) {
    return (
      <>
        {renderRequestsTable()}
        {renderDialogs()}
      </>
    );
  }

  // Trường hợp dashboard view
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký chờ duyệt</CardTitle>
          <CardDescription>Danh sách đăng ký tổ chức hiến máu từ các cơ sở tình nguyện</CardDescription>
        </CardHeader>
        <CardContent>
          {renderRequestsTable()}
        </CardContent>
      </Card>
      {renderDialogs()}
    </>
  );
}
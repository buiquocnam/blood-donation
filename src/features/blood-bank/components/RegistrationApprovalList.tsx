"use client"

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, InfoIcon } from 'lucide-react';

// Types
import type { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiDangKy } from '@/types';

// Hooks và services
import { useOrganizationRequests } from '../hooks/useOrganizationRequests';
import { mockDangKiToChucHienMau } from '@/mock';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// Thêm import formatDate từ utils và xóa import format, vi từ date-fns
import { formatDate } from '@/utils';

// Status mapping for UI rendering
type StatusType = 'pending' | 'approved' | 'rejected';

const STATUS_MAP = {
  pending: { 
    label: 'Chờ duyệt', 
    variant: 'default', 
    className: 'bg-primary/10 text-primary hover:bg-primary/20'
  },
  approved: { 
    label: 'Đã duyệt', 
    variant: 'success', 
    className: 'bg-green-100 text-green-600 hover:bg-green-200'
  },
  rejected: { 
    label: 'Từ chối', 
    variant: 'destructive', 
    className: 'bg-red-100 text-red-600 hover:bg-red-200'
  },
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
 * Function to convert numeric status to text status
 * Still needed for backward compatibility with any existing numeric statuses
 */
const getStatusText = (status: number | string): StatusType => {
  if (typeof status === 'string') {
    return status as StatusType;
  }
  
  switch(status) {
    case 0: return 'pending';
    case 1: return 'approved';
    case 2: return 'rejected';
    default: return 'pending';
  }
};

/**
 * Component hiển thị trạng thái của đăng ký
 */
const RequestStatus = ({ status }: { status: number | string }) => {
  const statusText = getStatusText(status);
  const statusInfo = STATUS_MAP[statusText];
  
  return (
    <Badge 
      variant={statusInfo.variant as 'default' | 'success' | 'destructive'}
      className={`px-3 py-1 ${statusInfo.className}`}
    >
      {statusInfo.label}
    </Badge>
  );
};

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
  const [selectedRequest, setSelectedRequest] = useState<DANGKITOCHUCHIENMAU_WithRelations | null>(null);
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
  const [notificationRequests, setNotificationRequests] = useState<DANGKITOCHUCHIENMAU_WithRelations[]>([]);
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
  const getDisplayRequests = (): DANGKITOCHUCHIENMAU_WithRelations[] => {
    if (notificationId) {
      return notificationRequests;
    } else {
      return pendingRequests || mockDangKiToChucHienMau.filter(req => 
        getStatusText(req.TinhTrangDK) === 'pending'
      );
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
  const handleApprove = (request: DANGKITOCHUCHIENMAU_WithRelations) => {
    setSelectedRequest(request);
    setShowCreateEventDialog(true);
  };

  const handleReject = (request: DANGKITOCHUCHIENMAU_WithRelations) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const handleRejectReasonChange = (value: string) => {
    setRejectReason(value);
  };

  const confirmReject = () => {
    if (!selectedRequest) return;
    
    // In a real app, we would call an API
    // For now, just update the local state
    setNotificationRequests(prev => 
      prev.map(req => 
        req.IdSuKien === selectedRequest.IdSuKien 
          ? { ...req, TinhTrangDK: 'rejected' as TrangThaiDangKy } 
          : req
      )
    );
    
    setShowRejectDialog(false);
    setRejectReason('');
    setSelectedRequest(null);
  };

  const handleEventFormChange = (form: EventFormValues) => {
    setEventForm(form);
  };

  const confirmCreateEvent = () => {
    if (!selectedRequest) return;
    
    // In a real app, we would call an API
    // For now, just update the local state
    setNotificationRequests(prev => 
      prev.map(req => 
        req.IdSuKien === selectedRequest.IdSuKien 
          ? { ...req, TinhTrangDK: 'approved' as TrangThaiDangKy } 
          : req
      )
    );
    
    setShowCreateEventDialog(false);
    setEventForm({ TgBatDauSK: '', TgKetThucSK: '', HanDK: '' });
    setSelectedRequest(null);
  };

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8 text-gray-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!displayRequests || displayRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border">
        <InfoIcon className="h-12 w-12 mb-4 text-gray-400" />
        <p className="mb-2 font-medium">
          {notificationId 
            ? "Chưa có cơ sở tình nguyện nào đăng ký cho thông báo này"
            : "Không có đăng ký nào cần xử lý"}
        </p>
        <p className="text-sm">Các đăng ký sẽ xuất hiện khi các cơ sở tình nguyện gửi yêu cầu</p>
      </div>
    );
  }

  // Render data table
  const renderRequestsTable = () => (
    <div className="border rounded-md overflow-hidden">
      <ScrollArea className={notificationId ? 'max-h-[500px]' : undefined}>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-4 font-semibold">Cơ sở tình nguyện</TableHead>
              {!notificationId && <TableHead className="py-4 font-semibold">Thông báo</TableHead>}
              <TableHead className="py-4 font-semibold">Ngày đăng ký</TableHead>
              <TableHead className="py-4 font-semibold">Trạng thái</TableHead>
              <TableHead className="text-right py-4 font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRequests.map((request, index) => (
              <TableRow 
                key={request.IdSuKien} 
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="font-medium py-4">
                  {request.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Không xác định'}
                </TableCell>
                {!notificationId && (
                  <TableCell className="py-4">
                    {request.ThongBao?.TieuDe || 'Không xác định'}
                  </TableCell>
                )}
                <TableCell className="py-4">
                  {request.NgayDangKi 
                    ? formatDate(request.NgayDangKi)
                    : 'Không xác định'
                  }
                </TableCell>
                <TableCell className="py-4">
                  <RequestStatus status={request.TinhTrangDK} />
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    {getStatusText(request.TinhTrangDK) === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(request)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Duyệt
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleReject(request)}
                          className="border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePaginationChange}
          />
        </div>
      )}
    </div>
  );

  // Render theo context - chi tiết thông báo hoặc dashboard
  if (notificationId) {
    return (
      <>
        {renderRequestsTable()}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">Từ chối đăng ký</DialogTitle>
              <DialogDescription>Vui lòng cung cấp lý do từ chối đăng ký này.</DialogDescription>
            </DialogHeader>
            <Textarea
              value={rejectReason}
              onChange={(e) => handleRejectReasonChange(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="min-h-24"
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Hủy</Button>
              <Button 
                variant="destructive" 
                onClick={confirmReject}
                disabled={!rejectReason.trim() || rejectRequest.isPending}
              >
                {rejectRequest.isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Tạo sự kiện hiến máu</DialogTitle>
              <DialogDescription>Thiết lập thông tin cho sự kiện hiến máu mới.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Thời gian bắt đầu sự kiện</Label>
                <DateTimePicker
                  value={eventForm.TgBatDauSK ? new Date(eventForm.TgBatDauSK) : undefined}
                  onChange={(date) => handleEventFormChange({
                    ...eventForm,
                    TgBatDauSK: date ? date.toISOString() : ''
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Thời gian kết thúc sự kiện</Label>
                <DateTimePicker
                  value={eventForm.TgKetThucSK ? new Date(eventForm.TgKetThucSK) : undefined}
                  onChange={(date) => handleEventFormChange({
                    ...eventForm,
                    TgKetThucSK: date ? date.toISOString() : ''
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Hạn đăng ký hiến máu</Label>
                <DateTimePicker
                  value={eventForm.HanDK ? new Date(eventForm.HanDK) : undefined}
                  onChange={(date) => handleEventFormChange({
                    ...eventForm,
                    HanDK: date ? date.toISOString() : ''
                  })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowCreateEventDialog(false)}>Hủy</Button>
              <Button 
                onClick={confirmCreateEvent}
                disabled={!eventForm.TgBatDauSK || !eventForm.TgKetThucSK || !eventForm.HanDK || createEvent.isPending}
              >
                {createEvent.isPending ? 'Đang tạo sự kiện...' : 'Tạo sự kiện'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Trường hợp dashboard view
  return (
    <>
      <Card className="w-full shadow-sm border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b">
          <div>
            <CardTitle className="text-xl text-primary font-bold">Đăng ký chờ duyệt</CardTitle>
            <CardDescription className="text-muted-foreground">
              Danh sách đăng ký tổ chức hiến máu từ các cơ sở tình nguyện
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {renderRequestsTable()}
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Từ chối đăng ký</DialogTitle>
            <DialogDescription>Vui lòng cung cấp lý do từ chối đăng ký này.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => handleRejectReasonChange(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            className="min-h-24"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Hủy</Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectReason.trim() || rejectRequest.isPending}
            >
              {rejectRequest.isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-600">Tạo sự kiện hiến máu</DialogTitle>
            <DialogDescription>Thiết lập thông tin cho sự kiện hiến máu mới.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Thời gian bắt đầu sự kiện</Label>
              <DateTimePicker
                value={eventForm.TgBatDauSK ? new Date(eventForm.TgBatDauSK) : undefined}
                onChange={(date) => handleEventFormChange({
                  ...eventForm,
                  TgBatDauSK: date ? date.toISOString() : ''
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Thời gian kết thúc sự kiện</Label>
              <DateTimePicker
                value={eventForm.TgKetThucSK ? new Date(eventForm.TgKetThucSK) : undefined}
                onChange={(date) => handleEventFormChange({
                  ...eventForm,
                  TgKetThucSK: date ? date.toISOString() : ''
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Hạn đăng ký hiến máu</Label>
              <DateTimePicker
                value={eventForm.HanDK ? new Date(eventForm.HanDK) : undefined}
                onChange={(date) => handleEventFormChange({
                  ...eventForm,
                  HanDK: date ? date.toISOString() : ''
                })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCreateEventDialog(false)}>Hủy</Button>
            <Button 
              onClick={confirmCreateEvent}
              disabled={!eventForm.TgBatDauSK || !eventForm.TgKetThucSK || !eventForm.HanDK || createEvent.isPending}
            >
              {createEvent.isPending ? 'Đang tạo sự kiện...' : 'Tạo sự kiện'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { useVolunteerCenters } from '../hooks/useVolunteerCenters';
import { formatDate } from '@/utils/formatDate';
import { Skeleton } from '@/components/ui/skeleton';
import type { COSOTINHNGUYEN } from '@/types';

/**
 * Component hiển thị danh sách cơ sở tình nguyện đang chờ duyệt
 */
export function VolunteerCenterApprovalList() {
  const {
    pendingCenters,
    isLoadingPending,
    searchTerm,
    setSearchTerm,
    approveCenter,
    rejectCenter,
    isApproving,
    isRejecting,
  } = useVolunteerCenters();

  const [selectedCenter, setSelectedCenter] = useState<COSOTINHNGUYEN | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Hiển thị chi tiết cơ sở tình nguyện
  const handleShowDetails = (center: COSOTINHNGUYEN) => {
    setSelectedCenter(center);
    setIsDetailsOpen(true);
  };

  // Mở dialog từ chối
  const handleOpenRejectDialog = (center: COSOTINHNGUYEN) => {
    setSelectedCenter(center);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  // Phê duyệt cơ sở tình nguyện
  const handleApprove = (centerId: string) => {
    approveCenter(centerId);
  };

  // Từ chối cơ sở tình nguyện
  const handleReject = () => {
    if (selectedCenter && rejectReason) {
      rejectCenter(selectedCenter.IDCoSoTinhNguyen, rejectReason);
      setIsRejectDialogOpen(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Duyệt đăng ký cơ sở tình nguyện</CardTitle>
            <CardDescription>
              Phê duyệt hoặc từ chối các cơ sở tình nguyện đăng ký mới
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 font-medium">
            {pendingCenters.length} đang chờ duyệt
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cơ sở tình nguyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-lg"
          />
        </div>

        {isLoadingPending ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-full h-16" />
            ))}
          </div>
        ) : pendingCenters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm 
              ? 'Không tìm thấy cơ sở tình nguyện nào phù hợp' 
              : 'Không có cơ sở tình nguyện nào đang chờ duyệt'}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên cơ sở</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCenters.map((center) => (
                  <TableRow key={center.IDCoSoTinhNguyen}>
                    <TableCell className="font-medium">{center.TenCoSoTinhNguyen}</TableCell>
                    <TableCell>{center.Email}</TableCell>
                    <TableCell>{center.SDT}</TableCell>
                    <TableCell>{formatDate(center.NgayTao)}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowDetails(center)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(center.IDCoSoTinhNguyen)}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Duyệt
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenRejectDialog(center)}
                        disabled={isRejecting}
                      >
                        {isRejecting ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Từ chối
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog hiển thị chi tiết cơ sở tình nguyện */}
        {selectedCenter && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Chi tiết cơ sở tình nguyện</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về cơ sở tình nguyện đang đăng ký
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">ID</Label>
                  <div className="col-span-3">
                    <code className="rounded bg-slate-100 px-2 py-1">
                      {selectedCenter.IDCoSoTinhNguyen}
                    </code>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tên cơ sở</Label>
                  <div className="col-span-3 font-medium">
                    {selectedCenter.TenCoSoTinhNguyen}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Người phụ trách</Label>
                  <div className="col-span-3">{selectedCenter.NguoiPhuTrach}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email</Label>
                  <div className="col-span-3">{selectedCenter.Email}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Số điện thoại</Label>
                  <div className="col-span-3">{selectedCenter.SDT}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Địa chỉ</Label>
                  <div className="col-span-3">{selectedCenter.DiaChi}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tên đăng nhập</Label>
                  <div className="col-span-3">{selectedCenter.UserName}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Minh chứng</Label>
                  <div className="col-span-3">
                    <a 
                      href={selectedCenter.MinhChung} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Xem minh chứng
                    </a>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleOpenRejectDialog(selectedCenter);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Từ chối
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove(selectedCenter.IDCoSoTinhNguyen);
                    setIsDetailsOpen(false);
                  }}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  )}
                  Duyệt
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog xác nhận từ chối */}
        <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận từ chối cơ sở tình nguyện</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn từ chối cơ sở tình nguyện "{selectedCenter?.TenCoSoTinhNguyen}"? 
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-3">
              <Label htmlFor="reject-reason">Lý do từ chối</Label>
              <Textarea
                id="reject-reason"
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleReject}
                disabled={!rejectReason || isRejecting}
              >
                {isRejecting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                Từ chối
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
} 
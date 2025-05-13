'use client';

import { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { COSOTINHNGUYEN_WithLocation } from '@/types';
import { EllipsisVertical, TrashIcon, LockIcon, UnlockIcon } from 'lucide-react';

interface VolunteersTableProps {
  volunteerCenters: COSOTINHNGUYEN_WithLocation[];
  onUpdateStatus: (centerId: string, status: boolean) => void;
  onDeleteCenter: (centerId: string) => void;
}

/**
 * Component hiển thị bảng danh sách cơ sở tình nguyện
 */
export function VolunteersTable({ 
  volunteerCenters, 
  onUpdateStatus, 
  onDeleteCenter 
}: VolunteersTableProps) {
  const [selectedCenter, setSelectedCenter] = useState<COSOTINHNGUYEN_WithLocation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteCenter = () => {
    if (selectedCenter) {
      onDeleteCenter(selectedCenter.IDCoSoTinhNguyen);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên cơ sở</TableHead>
            <TableHead>Người phụ trách</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tác vụ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteerCenters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Không có dữ liệu cơ sở tình nguyện
              </TableCell>
            </TableRow>
          ) : (
            volunteerCenters.map((center) => (
              <TableRow key={center.IDCoSoTinhNguyen}>
                <TableCell className="font-medium">{center.TenCoSoTinhNguyen}</TableCell>
                <TableCell>{center.NguoiPhuTrach}</TableCell>
                <TableCell>
                  <div>{center.Email}</div>
                  <div className="text-gray-500">{center.SDT}</div>
                </TableCell>
                <TableCell>
                  <div>{center.DiaChi}</div>
                  <div className="text-gray-500">
                    {center.Phuong?.TenPhuong}{center.Phuong?.Quan && `, ${center.Phuong.Quan.TenQuan}`}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={center.TinhTrang ? "success" : "destructive"}
                    className="font-normal"
                  >
                    {center.TinhTrang ? 'Đang hoạt động' : 'Bị khóa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(center.IDCoSoTinhNguyen, !center.TinhTrang)}
                      >
                        {center.TinhTrang ? (
                          <>
                            <LockIcon className="mr-2 h-4 w-4" />
                            <span>Khóa cơ sở</span>
                          </>
                        ) : (
                          <>
                            <UnlockIcon className="mr-2 h-4 w-4" />
                            <span>Mở khóa cơ sở</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCenter(center);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Xóa cơ sở</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cơ sở tình nguyện</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cơ sở <strong>{selectedCenter?.TenCoSoTinhNguyen}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCenter} className="bg-red-600">
              Xóa cơ sở
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 
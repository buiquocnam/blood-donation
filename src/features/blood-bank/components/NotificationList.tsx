'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '../hooks/useNotifications';
import { THONGBAODKTOCHUC } from '@/types';
import { EyeIcon, EditIcon, Trash2Icon, MoreVerticalIcon, SearchIcon, BuildingIcon, CalendarIcon } from 'lucide-react';
import { formatDate } from '@/utils';
import { NotificationForm } from './NotificationForm';
import { RegistrationApprovalList } from './RegistrationApprovalList';

export type FilterStatus = 'all' | 'active' | 'expired';

interface NotificationListProps {
  filterStatus?: FilterStatus;
}

/**
 * Component hiển thị danh sách thông báo đăng ký hiến máu
 */
export function NotificationList({ filterStatus = 'all' }: NotificationListProps) {
  console.log("NotificationList được render với filterStatus:", filterStatus);
  
  // Lấy danh sách thông báo và các hàm liên quan
  const { notifications, isLoading, error, deleteNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<THONGBAODKTOCHUC | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  
  // Lọc thông báo dựa trên từ khóa tìm kiếm và trạng thái
  const filteredNotifications = notifications ? notifications.filter(notification => {    
    if (!notification) {
      return false;
    }
    
    // Filter by search term
    const matchesSearch = notification.TieuDe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.NoiDung?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) {
      return false;
    }
    
    // Filter by status
    if (filterStatus === 'all') return true;
    
    try {
      const currentDate = new Date();
      
      if (filterStatus === 'active') {
        // Kiểm tra TgKetThucDK hợp lệ
        if (!notification.TgKetThucDK) {
          return false;
        }
        const endDate = new Date(notification.TgKetThucDK);
        
        const isActive = !isNaN(endDate.getTime()) && endDate > currentDate;
        return isActive;
      }
      
      if (filterStatus === 'expired') {
        // Kiểm tra TgKetThucDK hợp lệ
        if (!notification.TgKetThucDK) {
          return false;
        }
        const endDate = new Date(notification.TgKetThucDK);
        
        const isExpired = !isNaN(endDate.getTime()) && endDate <= currentDate;
        return isExpired;
      }
    } catch (error) {
      console.error("Lỗi khi filter theo trạng thái:", error);
      return false;
    }
    
    return true;
  }) : [];

  // Debug giá trị sau khi filter
  useEffect(() => {
    console.log("Kết quả lọc theo status:", filterStatus);
    console.log("Tổng số thông báo:", notifications?.length);
    console.log("Số thông báo sau khi lọc:", filteredNotifications.length);
  }, [filteredNotifications.length, filterStatus, notifications?.length]);

  /**
   * Xử lý xóa thông báo
   */
  const handleDelete = () => {
    if (selectedNotification) {
      deleteNotification.mutate(selectedNotification.IdThongBaoDK);
      setIsDeleteDialogOpen(false);
    }
  };

  /**
   * Xử lý xem chi tiết thông báo
   * @param notification Thông báo cần xem chi tiết
   */
  const handleView = (notification: THONGBAODKTOCHUC) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
    setActiveTab('details');
  };

  /**
   * Xử lý chỉnh sửa thông báo
   * @param notification Thông báo cần chỉnh sửa
   */
  const handleEdit = (notification: THONGBAODKTOCHUC) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  };

  /**
   * Chuẩn bị xác nhận xóa thông báo
   * @param notification Thông báo cần xóa
   */
  const confirmDelete = (notification: THONGBAODKTOCHUC) => {
    setSelectedNotification(notification);
    setIsDeleteDialogOpen(true);
  };


  return (
    <Card className="w-full shadow-sm border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4 border-b">
        <CardTitle className="text-xl text-primary font-bold">Danh sách thông báo</CardTitle>
        <div className="relative w-72">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            className="pl-9 border-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-8 text-muted-foreground">
            Đang tải thông báo...
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="mb-2">Không có thông báo nào</p>
            <p className="text-sm">Hãy tạo thông báo mới để thông báo đến các cơ sở tình nguyện</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-muted/40">
                  <TableHead className="py-4 font-semibold text-primary">Tiêu đề</TableHead>
                  <TableHead className="py-4 font-semibold text-primary">Ngày đăng</TableHead>
                  <TableHead className="py-4 font-semibold text-primary">Hạn đăng ký</TableHead>
                  <TableHead className="py-4 font-semibold text-primary">Số lượng hiến</TableHead>
                  <TableHead className="text-right py-4 font-semibold text-primary">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification, index) => (
                  <TableRow 
                    key={notification.IdThongBaoDK} 
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}
                  >
                    <TableCell className="font-medium py-4 text-foreground">{notification.TieuDe}</TableCell>
                    <TableCell className="py-4">{formatDate(notification.NgayDang)}</TableCell>
                    <TableCell className="py-4">{formatDate(notification.TgKetThucDK)}</TableCell>
                    <TableCell className="py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {notification.SoLuongMauHien}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => handleView(notification)}
                            className="py-2 cursor-pointer"
                          >
                            <EyeIcon className="mr-2 h-4 w-4 text-primary" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(notification)}
                            className="py-2 cursor-pointer"
                          >
                            <EditIcon className="mr-2 h-4 w-4 text-secondary" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => confirmDelete(notification)} 
                            className="text-destructive py-2 cursor-pointer"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Xóa thông báo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="mb-2">Không tìm thấy thông báo phù hợp</p>
            <p className="text-sm">Hãy thử tìm kiếm với từ khóa khác hoặc chọn bộ lọc khác</p>
          </div>
        )}
      </CardContent>

      {/* Dialog xem chi tiết thông báo */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl text-primary">
              Chi tiết thông báo: {selectedNotification?.TieuDe}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNotification && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details" className="py-2.5">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="registrations" className="py-2.5">
                  <BuildingIcon className="h-4 w-4 mr-2" />
                  Cơ sở đăng ký
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{selectedNotification.TieuDe}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ngày đăng: {formatDate(selectedNotification.NgayDang)}
                  </p>
                </div>
                <div className="bg-muted/20 rounded-md p-6 border">
                  <p className="whitespace-pre-wrap text-foreground">{selectedNotification.NoiDung}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/10 p-6 rounded-md border">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Bắt đầu đăng ký:</p>
                    <p className="text-foreground">{formatDate(selectedNotification.TgBatDauDK)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Kết thúc đăng ký:</p>
                    <p className="text-foreground">{formatDate(selectedNotification.TgKetThucDK)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Hạn đăng ký:</p>
                    <p className="text-foreground">{formatDate(selectedNotification.HanDK)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Số lượng hiến dự kiến:</p>
                    <p className="text-foreground">{selectedNotification.SoLuongMauHien}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Thời gian sự kiện bắt đầu:</p>
                    <p className="text-foreground">{formatDate(selectedNotification.TgBatDauSK)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Thời gian sự kiện kết thúc:</p>
                    <p className="text-foreground">{formatDate(selectedNotification.TgKetThucSK)}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="registrations" className="mt-0">
                <RegistrationApprovalList notificationId={selectedNotification.IdThongBaoDK} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa thông báo */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl text-primary">
              Chỉnh sửa thông báo
            </DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="p-6">
              <NotificationForm 
                notification={selectedNotification}
                onSuccess={() => setIsEditModalOpen(false)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. Thông báo "{selectedNotification?.TieuDe}" sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Xóa thông báo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 
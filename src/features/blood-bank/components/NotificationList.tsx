'use client';

import { useState } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types';
import { EyeIcon, EditIcon, Trash2Icon, MoreVerticalIcon, SearchIcon, BuildingIcon, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { NotificationForm } from './NotificationForm';
import { RegistrationApprovalList } from './RegistrationApprovalList';

/**
 * Component hiển thị danh sách thông báo đăng ký hiến máu
 */
export function NotificationList() {
  // Lấy danh sách thông báo và các hàm liên quan
  const { notifications, isLoading, deleteNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Lọc thông báo dựa trên từ khóa tìm kiếm
  const filteredNotifications = notifications?.filter(notification => 
    notification.TieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.NoiDung.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Định dạng ngày tháng để hiển thị
   * @param dateString Chuỗi ngày tháng cần định dạng
   * @returns Chuỗi ngày tháng đã định dạng
   */
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

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
  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsViewModalOpen(true);
    setActiveTab('details');
  };

  /**
   * Xử lý chỉnh sửa thông báo
   * @param notification Thông báo cần chỉnh sửa
   */
  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  };

  /**
   * Chuẩn bị xác nhận xóa thông báo
   * @param notification Thông báo cần xóa
   */
  const confirmDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách thông báo</CardTitle>
        <div className="relative w-72">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">Đang tải thông báo...</div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Hạn đăng ký</TableHead>
                  <TableHead>Số lượng hiến</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.IdThongBaoDK}>
                    <TableCell className="font-medium">{notification.TieuDe}</TableCell>
                    <TableCell>{formatDate(notification.NgayDang)}</TableCell>
                    <TableCell>{formatDate(notification.HanDangKi)}</TableCell>
                    <TableCell>{notification.SoLuongHien}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(notification)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(notification)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => confirmDelete(notification)} className="text-destructive">
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
          <div className="flex justify-center py-6">Không có thông báo nào</div>
        )}
      </CardContent>

      {/* Hộp thoại xem chi tiết thông báo */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Chi tiết thông báo: {selectedNotification?.TieuDe}</DialogTitle>
          </DialogHeader>
          
          {selectedNotification && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="registrations">
                  <BuildingIcon className="h-4 w-4 mr-2" />
                  Cơ sở đăng ký
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedNotification.TieuDe}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ngày đăng: {formatDate(selectedNotification.NgayDang)}
                  </p>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="whitespace-pre-wrap">{selectedNotification.NoiDung}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Bắt đầu đăng ký:</p>
                    <p>{formatDate(selectedNotification.TgBatDauDK)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kết thúc đăng ký:</p>
                    <p>{formatDate(selectedNotification.TgKetThucDK)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hạn đăng ký:</p>
                    <p>{formatDate(selectedNotification.HanDangKi)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Số lượng hiến dự kiến:</p>
                    <p>{selectedNotification.SoLuongHien} người</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="registrations" className="mt-4">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Danh sách đăng ký tổ chức hiến máu theo thông báo: <span className="font-medium">{selectedNotification.TieuDe}</span>
                  </p>
                </div>
                <RegistrationApprovalList 
                  notificationId={selectedNotification.IdThongBaoDK}
                />
              </TabsContent>
            </Tabs>
          )}
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hộp thoại chỉnh sửa thông báo */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <NotificationForm
              notification={selectedNotification}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Hộp thoại xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 
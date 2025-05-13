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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { NGUOIDUNG_WithRole, VAITRO } from '@/types';
import { EllipsisVertical, PencilIcon, TrashIcon, LockIcon, UnlockIcon } from 'lucide-react';

interface UsersTableProps {
  users: NGUOIDUNG_WithRole[];
  roles: VAITRO[];
  onUpdateStatus: (userId: string, status: boolean) => void;
  onUpdateRole: (userId: string, roleId: string) => void;
  onDeleteUser: (userId: string) => void;
}

/**
 * Component hiển thị bảng danh sách người dùng
 */
export function UsersTable({ 
  users, 
  roles, 
  onUpdateStatus, 
  onUpdateRole, 
  onDeleteUser 
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<NGUOIDUNG_WithRole | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateRole = () => {
    if (selectedUser && selectedRole) {
      onUpdateRole(selectedUser.MaNguoiDung, selectedRole);
      setShowRoleDialog(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.MaNguoiDung);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tác vụ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Không có dữ liệu người dùng
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.MaNguoiDung}>
                <TableCell className="font-medium">{user.HoTen}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.VaiTro?.TenVaiTro || 'Chưa phân quyền'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.TinhTrangTK ? "success" : "destructive"}
                    className="font-normal"
                  >
                    {user.TinhTrangTK ? 'Đang hoạt động' : 'Bị khóa'}
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
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.MaVaiTro);
                          setShowRoleDialog(true);
                        }}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        <span>Cập nhật vai trò</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(user.MaNguoiDung, !user.TinhTrangTK)}
                      >
                        {user.TinhTrangTK ? (
                          <>
                            <LockIcon className="mr-2 h-4 w-4" />
                            <span>Khóa tài khoản</span>
                          </>
                        ) : (
                          <>
                            <UnlockIcon className="mr-2 h-4 w-4" />
                            <span>Mở khóa tài khoản</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Xóa tài khoản</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog cập nhật vai trò */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật vai trò người dùng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Người dùng: <strong>{selectedUser?.HoTen}</strong>
            </p>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.MaVaiTro} value={role.MaVaiTro}>
                    {role.TenVaiTro} - {role.MoTa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateRole}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tài khoản người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản của <strong>{selectedUser?.HoTen}</strong>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600">
              Xóa tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 
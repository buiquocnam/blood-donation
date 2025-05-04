"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Bảng điều khiển Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+12.5%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Người hiến máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,890</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+10.2%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đơn vị máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,672</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+8.7%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sự kiện hiến máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+15.3%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
            <CardDescription>Thông tin cơ bản về hệ thống quản lý hiến máu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Phiên bản hệ thống</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Cập nhật gần nhất</span>
                <span>01/06/2023</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Trạng thái hệ thống</span>
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Hoạt động
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Thời gian hoạt động</span>
                <span>99.8%</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-medium">Dung lượng lưu trữ</span>
                <span>45% (450GB/1TB)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>Chi tiết tài khoản đăng nhập hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <div className="font-bold text-lg">{user?.name || "Admin"}</div>
                  <div className="text-sm text-gray-500">{user?.email || "admin@example.com"}</div>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Vai trò</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Quản trị viên</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Đăng nhập gần nhất</span>
                  <span>Hôm nay, 10:45 AM</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Địa chỉ IP</span>
                  <span>192.168.1.1</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Xác thực hai yếu tố</span>
                  <span className="text-red-500">Chưa kích hoạt</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="font-medium">Trạng thái tài khoản</span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Hoạt động
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
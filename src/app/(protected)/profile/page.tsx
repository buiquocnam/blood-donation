"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "0901234567", // Giả lập dữ liệu
    address: "Số 1, Đường Trần Duy Hưng, Cầu Giấy, Hà Nội", // Giả lập dữ liệu
    bloodType: "A+", // Chỉ áp dụng cho người hiến máu
    dateOfBirth: "01/01/1990", // Giả lập dữ liệu
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trong thực tế, gọi API để cập nhật thông tin người dùng
    setTimeout(() => {
      toast.success("Đã cập nhật thông tin thành công");
      setIsEditing(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    // Trong thực tế, chuyển hướng hoặc mở modal đổi mật khẩu
    toast.info("Tính năng đổi mật khẩu đang được phát triển");
  };

  // Hiển thị thông tin dựa trên vai trò người dùng
  const renderRoleSpecificInfo = () => {
    if (user?.role === "donor") {
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin hiến máu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nhóm máu</p>
              <p className="text-base">{formData.bloodType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng số lần hiến máu</p>
              <p className="text-base">3</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lần hiến máu gần nhất</p>
              <p className="text-base">10/05/2023</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lần hiến máu tiếp theo có thể</p>
              <p className="text-base">10/08/2023</p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "medical_staff") {
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin công việc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phòng ban</p>
              <p className="text-base">Khoa Huyết học</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vị trí</p>
              <p className="text-base">Nhân viên xét nghiệm</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày bắt đầu làm việc</p>
              <p className="text-base">01/01/2021</p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "doctor") {
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin chuyên môn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phòng ban</p>
              <p className="text-base">Khoa Nội</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chuyên khoa</p>
              <p className="text-base">Huyết học</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Số giấy phép hành nghề</p>
              <p className="text-base">MD12345</p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "blood_bank_director") {
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin công việc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Vị trí</p>
              <p className="text-base">Giám đốc</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phòng ban</p>
              <p className="text-base">Ngân hàng máu trung ương</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mã nhân viên</p>
              <p className="text-base">BD1001</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày bắt đầu làm việc</p>
              <p className="text-base">01/01/2018</p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.role === "volunteer_center_manager") {
      return (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin công việc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Vị trí</p>
              <p className="text-base">Trưởng cơ sở</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cơ sở</p>
              <p className="text-base">Trung tâm tình nguyện Hà Nội</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mã nhân viên</p>
              <p className="text-base">VC2002</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngày bắt đầu quản lý</p>
              <p className="text-base">15/05/2020</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 mt-1">Xem và cập nhật thông tin cá nhân của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thông tin cá nhân</CardTitle>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="text"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  {user?.role === "donor" && (
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                        Nhóm máu
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Họ tên</p>
                    <p className="text-base">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p className="text-base">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                    <p className="text-base">{formData.dateOfBirth}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                    <p className="text-base">{formData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vai trò</p>
                    <p className="text-base">
                      {user?.role === "donor" && "Người hiến máu"}
                      {user?.role === "medical_staff" && "Nhân viên y tế"}
                      {user?.role === "doctor" && "Bác sĩ"}
                      {user?.role === "volunteer_center_manager" && "Trưởng cơ sở tình nguyện"}
                      {user?.role === "blood_bank_director" && "Giám đốc ngân hàng máu"}
                      {user?.role === "admin" && "Quản trị viên"}
                    </p>
                  </div>
                </div>

                {renderRoleSpecificInfo()}

                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={handleChangePassword}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
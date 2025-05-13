"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";
import { isNguoiDung, isCoSoTinhNguyen } from "@/utils/typeGuards";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Calendar, Droplet, Mail, MapPin, Phone, User } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: isNguoiDung(user) ? user.HoTen : isCoSoTinhNguyen(user) ? user.TenCoSoTinhNguyen : "",
    email: user?.Email || "",
    phone: user?.SDT || "",
    address: isNguoiDung(user) ? user.tenDiaChi : isCoSoTinhNguyen(user) ? user.DiaChi : "",
    bloodType: isNguoiDung(user) ? user.MaNhomMau : "",
    dateOfBirth: isNguoiDung(user) ? user.NgaySinh : "",
    position: isCoSoTinhNguyen(user) ? "Quản lý tình nguyện viên" : "",
    organizationName: isCoSoTinhNguyen(user) ? user.TenCoSoTinhNguyen : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    setTimeout(() => {
      toast.success("Đã cập nhật thông tin thành công");
      setIsEditing(false);
    }, 500);
  };

  const handleChangePassword = () => {
    toast.info("Tính năng đổi mật khẩu đang được phát triển");
  };

  const isDonor = isNguoiDung(user) && user?.MaVaiTro === "ROLE_DONOR";
  const isVolunteer = user?.MaVaiTro === "ROLE_VOLUNTEER" || isCoSoTinhNguyen(user);

  // Mock data for donors
  const donorData = {
    totalDonations: 3,
    lastDonationDate: "10/05/2023",
    nextPossibleDonationDate: "10/08/2023"
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="container max-w-4xl mx-auto">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ tên</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        {isDonor && (
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                            <Input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                        
                        <div className={`space-y-2 ${!isDonor ? "md:col-span-2" : ""}`}>
                          <Label htmlFor="address">Địa chỉ</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        {isDonor && (
                          <div className="space-y-2">
                            <Label htmlFor="bloodType">Nhóm máu</Label>
                            <Select 
                              value={formData.bloodType} 
                              onValueChange={(value) => handleSelectChange("bloodType", value)}
                            >
                              <SelectTrigger id="bloodType">
                                <SelectValue placeholder="Chọn nhóm máu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {isVolunteer && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="position">Vị trí</Label>
                              <Input
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="organizationName">Tên tổ chức</Label>
                              <Input
                                id="organizationName"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Hủy
                        </Button>
                        <Button type="submit">
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-3 items-start">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Họ tên</p>
                            <p className="font-medium">{formData.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 items-start">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 items-start">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Số điện thoại</p>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                        </div>
                        
                        {isDonor && (
                          <div className="flex gap-3 items-start">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Ngày sinh</p>
                              <p className="font-medium">{formData.dateOfBirth}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className={`flex gap-3 items-start ${!isDonor ? "md:col-span-2" : ""}`}>
                          <div className="bg-primary/10 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Địa chỉ</p>
                            <p className="font-medium">{formData.address}</p>
                          </div>
                        </div>
                        
                        {isDonor && (
                          <div className="flex gap-3 items-start">
                            <div className="bg-red-100 p-2 rounded-full">
                              <Droplet className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Nhóm máu</p>
                              <p className="font-medium">{formData.bloodType || "Chưa cập nhật"}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-3 items-start">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Vai trò</p>
                            <p className="font-medium">
                              {isDonor ? "Người hiến máu" : isVolunteer ? "Quản lý tình nguyện" : "Người dùng"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isDonor && (
                        <Card className="mt-6 border-border/40">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Droplet className="h-5 w-5 text-red-500" />
                              Thông tin hiến máu
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tổng số lần hiến máu</p>
                                  <p className="font-medium">{donorData.totalDonations}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                  <Calendar className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Lần hiến máu gần nhất</p>
                                  <p className="font-medium">{donorData.lastDonationDate}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-2 rounded-full">
                                  <Calendar className="h-4 w-4 text-purple-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Lần hiến máu tiếp theo</p>
                                  <p className="font-medium">{donorData.nextPossibleDonationDate}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {isVolunteer && (
                        <Card className="mt-6 border-border/40">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Building className="h-5 w-5 text-blue-500" />
                              Thông tin tổ chức
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <User className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Vị trí</p>
                                  <p className="font-medium">{formData.position}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                  <Building className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tổ chức</p>
                                  <p className="font-medium">{formData.organizationName}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="pt-6">
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
        </main>
      </div>
    </div>
  );
}
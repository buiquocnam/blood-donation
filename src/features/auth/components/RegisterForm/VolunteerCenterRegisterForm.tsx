"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VolunteerCenterRegisterFormData, volunteerCenterRegisterSchema } from "@/features/auth/schemas/register-schemas";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthService } from "@/features/auth/services/auth-service";
import { toast } from "sonner";
import { mockThanhPho, mockQuan, mockPhuong } from "@/mock/location";

interface VolunteerCenterRegisterFormProps {
  onSuccess?: () => void;
}

export function VolunteerCenterRegisterForm({ onSuccess }: VolunteerCenterRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<Array<{IdQuan: string, TenQuan: string}>>([]);
  const [availableWards, setAvailableWards] = useState<Array<{IdPhuong: string, TenPhuong: string}>>([]);
  
  const { registerVolunteerCenter } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VolunteerCenterRegisterFormData>({
    resolver: zodResolver(volunteerCenterRegisterSchema),
    defaultValues: {
      TenCoSoTinhNguyen: "",
      DiaChi: "",
      IdPhuong: "",
      MinhChung: "",
      Email: "",
      SDT: "",
      UserName: "",
      NguoiPhuTrach: "",
      MatKhau: "",
      XacNhanMatKhau: "",
      MaVaiTro: "ROLE_VOLUNTEER" as const,
    },
  });

  // Update available districts when city changes
  useEffect(() => {
    if (selectedCity) {
      const filteredDistricts = mockQuan.filter((district: {IdThanhPho: string}) => district.IdThanhPho === selectedCity);
      setAvailableDistricts(filteredDistricts);
      setSelectedDistrict("");
      setAvailableWards([]);
      setValue("IdPhuong", "");
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict("");
      setAvailableWards([]);
      setValue("IdPhuong", "");
    }
  }, [selectedCity, setValue]);

  // Update available wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filteredWards = mockPhuong.filter((ward: {IdQuan: string}) => ward.IdQuan === selectedDistrict);
      setAvailableWards(filteredWards);
      setValue("IdPhuong", "");
    } else {
      setAvailableWards([]);
      setValue("IdPhuong", "");
    }
  }, [selectedDistrict, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProofFile(file);
    
    // Trong thực tế, sẽ upload file lên server và lấy URL
    // Ở đây chỉ lưu tên file để demo
    if (file) {
      setValue("MinhChung", file.name);
    } else {
      setValue("MinhChung", "");
    }
  };

  const onSubmit: SubmitHandler<VolunteerCenterRegisterFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Đảm bảo các trường tính toán
      const registerData = {
        ...data,
        NguoiPhuTrach: data.NguoiPhuTrach || "Người quản lý", // Tự động tạo nếu chưa có
        UserName: data.UserName || data.Email, // Tự động lấy từ email nếu chưa có
        MinhChung: data.MinhChung || "", // Đảm bảo không null
        MaVaiTro: "ROLE_VOLUNTEER" as const,
      };
      
      // Gọi service để đăng ký
      const center = await AuthService.registerVolunteerCenter(registerData);
      
      // Cập nhật trạng thái đăng nhập
      await registerVolunteerCenter(registerData);
      
      toast.success("Đăng ký thành công, yêu cầu của bạn đang được xét duyệt");
      
      // Gọi callback thành công nếu có
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại, vui lòng thử lại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Thông tin trưởng cơ sở */}
      <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Thông tin người quản lý
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Thông tin này sẽ được sử dụng để đăng nhập và liên hệ
        </p>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="NguoiPhuTrach" className="font-medium">Họ tên người phụ trách</Label>
            <Input
              id="NguoiPhuTrach"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register("NguoiPhuTrach")}
              className={errors.NguoiPhuTrach ? "border-red-500" : ""}
            />
            {errors.NguoiPhuTrach && (
              <p className="text-red-500 text-sm">{errors.NguoiPhuTrach.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Email" className="font-medium">Email</Label>
            <Input
              id="Email"
              type="email"
              placeholder="example@email.com"
              {...register("Email")}
              className={errors.Email ? "border-red-500" : ""}
            />
            {errors.Email && (
              <p className="text-red-500 text-sm">{errors.Email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="SDT" className="font-medium">Số điện thoại</Label>
            <Input
              id="SDT"
              type="tel"
              placeholder="0912345678"
              {...register("SDT")}
              className={errors.SDT ? "border-red-500" : ""}
            />
            {errors.SDT && (
              <p className="text-red-500 text-sm">{errors.SDT.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="UserName" className="font-medium">Tên đăng nhập</Label>
            <Input
              id="UserName"
              type="text"
              placeholder="tên_đăng_nhập"
              {...register("UserName")}
              className={errors.UserName ? "border-red-500" : ""}
            />
            {errors.UserName && (
              <p className="text-red-500 text-sm">{errors.UserName.message as string}</p>
            )}
            <p className="text-xs text-gray-500">Mặc định sẽ sử dụng email nếu bỏ trống</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="MatKhau" className="font-medium">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="MatKhau"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                {...register("MatKhau")}
                className={errors.MatKhau ? "border-red-500" : ""}
              />
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </Button>
            </div>
            {errors.MatKhau && (
              <p className="text-red-500 text-sm">{errors.MatKhau.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="XacNhanMatKhau" className="font-medium">Xác nhận mật khẩu</Label>
            <Input
              id="XacNhanMatKhau"
              type={showPassword ? "text" : "password"}
              placeholder="******"
              {...register("XacNhanMatKhau")}
              className={errors.XacNhanMatKhau ? "border-red-500" : ""}
            />
            {errors.XacNhanMatKhau && (
              <p className="text-red-500 text-sm">{errors.XacNhanMatKhau.message as string}</p>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin cơ sở tình nguyện */}
      <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Thông tin cơ sở tình nguyện
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Thông tin về cơ sở tình nguyện của bạn
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="TenCoSoTinhNguyen" className="font-medium">Tên cơ sở tình nguyện</Label>
            <Input
              id="TenCoSoTinhNguyen"
              type="text"
              placeholder="Trường Đại học ABC"
              {...register("TenCoSoTinhNguyen")}
              className={errors.TenCoSoTinhNguyen ? "border-red-500" : ""}
            />
            {errors.TenCoSoTinhNguyen && (
              <p className="text-red-500 text-sm">{errors.TenCoSoTinhNguyen.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="DiaChi" className="font-medium">Địa chỉ cơ sở</Label>
            <Input
              id="DiaChi"
              type="text"
              placeholder="Số nhà, tên đường"
              {...register("DiaChi")}
              className={errors.DiaChi ? "border-red-500" : ""}
            />
            {errors.DiaChi && (
              <p className="text-red-500 text-sm">{errors.DiaChi.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="font-medium">Tỉnh/Thành phố</Label>
              <select
                id="city"
                className="w-full px-3 py-2 border border-input rounded-md"
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Chọn thành phố</option>
                {mockThanhPho.map((city: {IdThanhPho: string, TenThanhPho: string}) => (
                  <option key={city.IdThanhPho} value={city.IdThanhPho}>
                    {city.TenThanhPho}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="font-medium">Quận/Huyện</Label>
              <select
                id="district"
                className="w-full px-3 py-2 border border-input rounded-md"
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCity}
              >
                <option value="">
                  {selectedCity ? "Chọn quận/huyện" : "Vui lòng chọn thành phố trước"}
                </option>
                {availableDistricts.map((district) => (
                  <option key={district.IdQuan} value={district.IdQuan}>
                    {district.TenQuan}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward" className="font-medium">Phường/Xã</Label>
              <select
                id="ward"
                className={`w-full px-3 py-2 border rounded-md ${errors.IdPhuong ? "border-red-500" : "border-input"}`}
                onChange={(e) => setValue("IdPhuong", e.target.value)}
                disabled={!selectedDistrict}
              >
                <option value="">
                  {selectedDistrict ? "Chọn phường/xã" : "Vui lòng chọn quận/huyện trước"}
                </option>
                {availableWards.map((ward) => (
                  <option key={ward.IdPhuong} value={ward.IdPhuong}>
                    {ward.TenPhuong}
                  </option>
                ))}
              </select>
              {errors.IdPhuong && (
                <p className="text-red-500 text-sm">{errors.IdPhuong.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUpload" className="font-medium">Minh chứng cơ sở</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className={errors.MinhChung ? "border-red-500" : ""}
              />
              {proofFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProofFile(null);
                    setValue("MinhChung", "");
                  }}
                >
                  Xóa
                </Button>
              )}
            </div>
            {errors.MinhChung && (
              <p className="text-red-500 text-sm">{errors.MinhChung.message as string}</p>
            )}
            <p className="text-sm text-gray-500">Tải lên giấy tờ liên quan đến cơ sở tình nguyện của bạn (PDF, JPEG, PNG).</p>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
    </form>
  );
} 
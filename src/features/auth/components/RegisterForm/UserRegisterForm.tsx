"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRegisterFormData, userRegisterSchema } from "@/features/auth/schemas/register-schemas";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AuthService } from "@/features/auth/services/auth-service";
import { toast } from "sonner";
import { mockNhomMau } from "@/mock/users";
import { THANHPHO, QUAN, PHUONG } from "@/types/location";
import { locationService } from "@/shared/services/locationService";
import { useRouter } from "next/navigation";
import React from "react";

interface UserRegisterFormProps {
  onSuccess?: () => void;
  initialCities?: THANHPHO[];
}

function UserRegisterFormComponent({ onSuccess, initialCities = [] }: UserRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [cities, setCities] = useState<THANHPHO[]>(initialCities);
  const [availableDistricts, setAvailableDistricts] = useState<QUAN[]>([]);
  const [availableWards, setAvailableWards] = useState<PHUONG[]>([]);
  const [isLoading, setIsLoading] = useState({
    cities: false,
    districts: false,
    wards: false
  });
  
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      HoTen: "",
      Email: "",
      SDT: "",
      MatKhau: "",
      XacNhanMatKhau: "",
      NgaySinh: "",
      GioiTinh: "1", // 1: Nam, 0: Nữ
      CCCD: "",
      MaNhomMau: "",
      tenDiaChi: "",
      IdPhuong: "",
      MaVaiTro: "ROLE_DONOR" as const, // Mặc định là người hiến máu
    },
  });

  // Lấy danh sách thành phố khi component mount (chỉ khi không có initialCities)
  useEffect(() => {
    // Nếu đã có initialCities từ server, không cần fetch lại
    if (initialCities && initialCities.length > 0) {
      setCities(initialCities);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(prev => ({ ...prev, cities: true }));
      try {
        const citiesData = await locationService.getCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành phố:", error);
        toast.error("Không thể tải danh sách thành phố");
      } finally {
        setIsLoading(prev => ({ ...prev, cities: false }));
      }
    };
    
    fetchCities();
  }, [initialCities]);

  // Update available districts when city changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedCity) {
        setAvailableDistricts([]);
        setSelectedDistrict("");
        setAvailableWards([]);
        setValue("IdPhuong", "");
        return;
      }

      setIsLoading(prev => ({ ...prev, districts: true }));
      try {
        const districtsData = await locationService.getDistricts(selectedCity);
        setAvailableDistricts(districtsData);
        setSelectedDistrict("");
        setAvailableWards([]);
        setValue("IdPhuong", "");
      } catch (error) {
        console.error(`Lỗi khi lấy danh sách quận cho thành phố ${selectedCity}:`, error);
        toast.error("Không thể tải danh sách quận/huyện");
      } finally {
        setIsLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [selectedCity, setValue]);

  // Update available wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setAvailableWards([]);
        setValue("IdPhuong", "");
        return;
      }

      setIsLoading(prev => ({ ...prev, wards: true }));
      try {
        const wardsData = await locationService.getWards(selectedDistrict);
        setAvailableWards(wardsData);
        setValue("IdPhuong", "");
      } catch (error) {
        console.error(`Lỗi khi lấy danh sách phường cho quận ${selectedDistrict}:`, error);
        toast.error("Không thể tải danh sách phường/xã");
      } finally {
        setIsLoading(prev => ({ ...prev, wards: false }));
      }
    };

    fetchWards();
  }, [selectedDistrict, setValue]);

  const onSubmit: SubmitHandler<UserRegisterFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Đảm bảo có MaVaiTro
      const registerData = {
        ...data,
        MaVaiTro: "ROLE_DONOR" as const,
      };

      // Gọi service để đăng ký
      const user = await AuthService.register(registerData);
      
      // Cập nhật trạng thái đăng nhập
      await registerUser(registerData);
      
      toast.success("Đăng ký thành công");
      
      // Chuyển hướng đến trang chính sau khi đăng ký thành công
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
      // Gọi callback thành công nếu có (cho khả năng tương thích ngược)
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại, vui lòng thử lại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Thông tin cá nhân
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="HoTen" className="font-medium">Họ và tên</Label>
            <Input
              id="HoTen"
              type="text"
              placeholder="Nguyễn Văn A"
              {...register("HoTen")}
              className={errors.HoTen ? "border-red-500" : ""}
            />
            {errors.HoTen && (
              <p className="text-red-500 text-sm">{errors.HoTen.message as string}</p>
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
            <Label htmlFor="CCCD" className="font-medium">CCCD/CMND</Label>
            <Input
              id="CCCD"
              type="text"
              placeholder="012345678901"
              {...register("CCCD")}
              className={errors.CCCD ? "border-red-500" : ""}
            />
            {errors.CCCD && (
              <p className="text-red-500 text-sm">{errors.CCCD.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="NgaySinh" className="font-medium">Ngày sinh</Label>
            <Input
              id="NgaySinh"
              type="date"
              {...register("NgaySinh")}
              className={errors.NgaySinh ? "border-red-500" : ""}
            />
            {errors.NgaySinh && (
              <p className="text-red-500 text-sm">{errors.NgaySinh.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Giới tính</Label>
            <RadioGroup
              defaultValue="1"
              onValueChange={(value) => setValue("GioiTinh", value as "1" | "0")}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="male" />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="female" />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </RadioGroup>
            {errors.GioiTinh && (
              <p className="text-red-500 text-sm">{errors.GioiTinh.message as string}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border my-4"></div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="MaNhomMau" className="font-medium">Nhóm máu (nếu biết)</Label>
          <select 
            id="MaNhomMau"
            className={`w-full px-3 py-2 border rounded-md ${errors.MaNhomMau ? "border-red-500" : "border-input"}`}
            onChange={(e) => setValue("MaNhomMau", e.target.value)}
          >
            <option value="">Không biết</option>
            {mockNhomMau.map((type) => (
              <option key={type.MaNhomMau} value={type.MaNhomMau}>
                {type.MoTaNhomMau}
              </option>
            ))}
          </select>
          {errors.MaNhomMau && (
            <p className="text-red-500 text-sm">{errors.MaNhomMau.message as string}</p>
          )}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Thông tin địa chỉ
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="font-medium">Tỉnh/Thành phố</Label>
              <select
                id="city"
                className="w-full px-3 py-2 border border-input rounded-md"
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={isLoading.cities}
              >
                <option value="">
                  {isLoading.cities ? "Đang tải..." : "Chọn thành phố"}
                </option>
                {cities.map((city) => (
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
                disabled={!selectedCity || isLoading.districts}
              >
                <option value="">
                  {isLoading.districts 
                    ? "Đang tải..." 
                    : selectedCity 
                      ? "Chọn quận/huyện" 
                      : "Vui lòng chọn thành phố trước"}
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
                disabled={!selectedDistrict || isLoading.wards}
              >
                <option value="">
                  {isLoading.wards 
                    ? "Đang tải..." 
                    : selectedDistrict 
                      ? "Chọn phường/xã" 
                      : "Vui lòng chọn quận/huyện trước"}
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
            <Label htmlFor="tenDiaChi" className="font-medium">Số nhà, đường</Label>
            <Input
              id="tenDiaChi"
              type="text"
              placeholder="Số 123, Đường ABC"
              {...register("tenDiaChi")}
              className={errors.tenDiaChi ? "border-red-500" : ""}
            />
            {errors.tenDiaChi && (
              <p className="text-red-500 text-sm">{errors.tenDiaChi.message as string}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Thông tin đăng nhập
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="col-span-1 md:col-span-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </div>
    </form>
  );
}

export const UserRegisterForm = React.memo(UserRegisterFormComponent); 
import * as z from "zod";
import { BLOOD_DONATION_AGE_RANGE } from "@/lib/constants";
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

/**
 * Validate mật khẩu trùng khớp
 */
const validatePasswordMatch = (data: any) => {
  if (data.MatKhau !== data.XacNhanMatKhau) {
    return {
      message: "Mật khẩu không khớp",
      path: ["XacNhanMatKhau"]
    };
  }
  return true;
};

/**
 * Schema đăng ký cho người dùng thông thường (người hiến máu)
 * Khớp với RegisterData trong auth/types
 */
export const userRegisterSchema = z.object({
  HoTen: z.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  Email: z.string()
    .email("Email không hợp lệ")
    .regex(emailRegex, "Email không đúng định dạng"),
  MatKhau: z.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
  XacNhanMatKhau: z.string()
    .min(1, "Vui lòng xác nhận mật khẩu"),
  SDT: z.string()
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  NgaySinh: z.string()
    .refine((dob) => {
      if (!dob) return false;
      const date = new Date(dob);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      const isValidDate = !isNaN(date.getTime());
      
      return isValidDate && 
        age >= BLOOD_DONATION_AGE_RANGE.MIN && 
        age <= BLOOD_DONATION_AGE_RANGE.MAX;
    }, `Tuổi phải từ ${BLOOD_DONATION_AGE_RANGE.MIN} đến ${BLOOD_DONATION_AGE_RANGE.MAX}`),
  GioiTinh: z.enum(["1", "0"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  CCCD: z.string()
    .min(9, "CCCD không hợp lệ")
    .max(12, "CCCD không hợp lệ")
    .regex(/^[0-9]+$/, "CCCD chỉ được chứa số"),
  MaNhomMau: z.string().optional(),
  tenDiaChi: z.string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
  IdPhuong: z.string({
    required_error: "Vui lòng chọn phường/xã",
  }),
  MaVaiTro: z.enum(["ROLE_DONOR"] as const),
}).superRefine(validatePasswordMatch);

/**
 * Schema đăng ký cho trưởng cơ sở tình nguyện
 * Khớp với VolunteerCenterRegisterData trong auth/types
 */
export const volunteerCenterRegisterSchema = z.object({
  TenCoSoTinhNguyen: z.string()
    .min(5, "Tên cơ sở phải có ít nhất 5 ký tự")
    .max(100, "Tên cơ sở không được vượt quá 100 ký tự"),
  DiaChi: z.string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
  IdPhuong: z.string({
    required_error: "Vui lòng chọn phường/xã",
  }),
  MinhChung: z.any(), // Cho phép cả string, File và null
  Email: z.string()
    .email("Email không hợp lệ")
    .regex(emailRegex, "Email không đúng định dạng"),
  SDT: z.string()
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  UserName: z.string().optional(), // Trường này sẽ được tự động tạo từ Email
  NguoiPhuTrach: z.string().optional(), // Trường này sẽ được tự động gán bằng HoTen
  MatKhau: z.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
  XacNhanMatKhau: z.string()
    .min(1, "Vui lòng xác nhận mật khẩu"),
  MaVaiTro: z.enum(["ROLE_VOLUNTEER_MANAGER"] as const).optional(),
}).superRefine(validatePasswordMatch);

// Định nghĩa kiểu dữ liệu từ schema
export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
export type VolunteerCenterRegisterFormData = z.infer<typeof volunteerCenterRegisterSchema>; 
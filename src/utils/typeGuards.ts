import { AuthUser } from "@/features/auth/types";
import { NGUOIDUNG, COSOTINHNGUYEN } from "@/types";

/**
 * Kiểm tra xem user có phải là đối tượng NGUOIDUNG hay không
 * @param user Đối tượng người dùng cần kiểm tra
 * @returns Boolean cho biết đây có phải là đối tượng NGUOIDUNG không
 */
export function isNguoiDung(user: AuthUser | null): user is NGUOIDUNG {
  return user !== null && user.MaVaiTro !== "ROLE_VOLUNTEER_MANAGER";
}

/**
 * Kiểm tra xem user có phải là đối tượng COSOTINHNGUYEN hay không
 * @param user Đối tượng người dùng cần kiểm tra
 * @returns Boolean cho biết đây có phải là đối tượng COSOTINHNGUYEN không
 */
export function isCoSoTinhNguyen(user: AuthUser | null): user is COSOTINHNGUYEN {
  return user !== null && user.MaVaiTro === "ROLE_VOLUNTEER_MANAGER";
} 
import { redirect } from 'next/navigation';

/**
 * Chuyển hướng người dùng đến trang danh sách đăng ký
 */
export default function MedicalStaffPage() {
  // Redirect tự động đến trang quản lý đăng ký hiến máu
  redirect('/medical-staff/registrations');
} 
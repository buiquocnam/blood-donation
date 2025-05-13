import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "sonner";

/**
 * Hook để kiểm tra trạng thái đăng nhập và chuyển hướng sang trang đăng nhập nếu cần
 */
export function useAuthCheck() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  /**
   * Kiểm tra trạng thái đăng nhập trước khi chuyển hướng đến trang được bảo vệ
   * @param targetPath Đường dẫn cần chuyển đến
   * @param options Tùy chọn thêm
   * @returns true nếu đã đăng nhập, false nếu chưa đăng nhập
   */
  const checkAuthAndRedirect = (
    targetPath: string,
    options: {
      showToast?: boolean;
      toastMessage?: string;
    } = {}
  ) => {
    const { showToast = true, toastMessage = "Vui lòng đăng nhập để tiếp tục" } = options;

    // Kiểm tra nếu đang tải
    if (isLoading) {
      return false;
    }

    // Nếu chưa đăng nhập, chuyển đến trang đăng nhập với redirect URL
    if (!isAuthenticated) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(targetPath)}`;

      if (showToast) {
        toast.info(toastMessage);
      }

      try {
        router.push(loginUrl);
      } catch (error) {
        console.error("Lỗi khi chuyển hướng:", error);
        toast.error("Có lỗi xảy ra khi chuyển hướng. Vui lòng tải lại trang.");
      }
      
      return false;
    }

    return true;
  };

  /**
   * Xử lý đăng ký sự kiện
   * @param eventId ID của sự kiện
   * @returns true nếu đã chuyển hướng thành công
   */
  const handleEventRegistration = (eventId: string) => {
    try {
      const registrationPath = `/events/register?eventId=${eventId}`;
      
      // Kiểm tra đăng nhập trước khi chuyển hướng
      const isAuth = checkAuthAndRedirect(registrationPath);
      
      if (isAuth) {
        router.push(registrationPath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Lỗi xử lý đăng ký sự kiện:", error);
      return false;
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    checkAuthAndRedirect,
    handleEventRegistration,
  };
} 
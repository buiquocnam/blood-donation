import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </span>
              <span className="text-lg font-bold">BloodDonate</span>
            </Link>
            <p className="text-sm text-gray-600">
              Hệ thống quản lý hiến máu giúp kết nối người hiến máu với các cơ sở y tế, 
              mang lại hy vọng và sự sống cho những người cần truyền máu.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-gray-600 hover:text-gray-900">
                  Sự kiện hiến máu
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Tiện Ích</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-gray-600 hover:text-gray-900">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Bảng điều khiển
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                  Hồ sơ cá nhân
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Liên Hệ</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Địa chỉ:</strong> 123 Đường Giải Phóng, Q.Hai Bà Trưng, Hà Nội
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Điện thoại:</strong> 024 3633 6688
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> contact@blooddonate.vn
              </p>
            </address>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} BloodDonate. Bản quyền thuộc về BloodDonate.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
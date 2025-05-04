# Hệ Thống Quản Lý Hiến Máu

Nền tảng toàn diện để quản lý hiến máu, kết nối người hiến máu, nhân viên y tế và ngân hàng máu.

## Tính năng theo vai trò người dùng

- **Khách vãng lai**: Xem thông tin, đăng ký tài khoản
- **Người hiến máu**: Hiến máu, xem lịch sử hiến máu và quản lý hồ sơ
- **Nhân viên y tế**: Duyệt đăng ký hiến máu, cập nhật trạng thái hiến máu
- **Bác sĩ**: Quản lý hồ sơ sức khỏe người hiến máu và tài liệu hiến máu
- **Trưởng cơ sở tình nguyện**: Đăng ký trung tâm, tổ chức các đợt hiến máu
- **Giám đốc ngân hàng máu**: Quản lý kho máu, phát hành thông báo và tạo báo cáo
- **Quản trị viên**: Quản lý tài khoản người dùng và cài đặt hệ thống

## Công nghệ sử dụng

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS cho phong cách
  - Shadcn UI cho các thành phần
  - React Hook Form với Zod cho quản lý biểu mẫu
  - TanStack Query cho việc lấy dữ liệu
  - Zustand cho quản lý trạng thái

## Cấu trúc dự án

Dự án tuân theo kiến trúc mô-đun dựa trên tính năng:

```
src/
├── app/ - Next.js App Router
├── components/ - Các thành phần dùng chung
├── features/ - Các mô-đun tính năng
│   ├── auth/ - Xác thực
│   ├── donor/ - Tính năng người hiến máu
│   ├── medical-staff/ - Tính năng nhân viên y tế
│   ├── doctor/ - Tính năng bác sĩ
│   ├── volunteer-center/ - Tính năng cơ sở tình nguyện
│   ├── blood-bank/ - Tính năng ngân hàng máu
│   └── admin/ - Tính năng quản trị viên
├── lib/ - Thư viện tiện ích
└── types/ - Các loại dữ liệu dùng chung
```

Mỗi mô-đun tính năng được tổ chức như sau:

```
features/[tên-tính-năng]/
├── components/ - Các thành phần UI
├── hooks/ - Các hook tùy chỉnh
├── services/ - Các cuộc gọi API
├── store/ - Zustand store
├── types/ - Các loại dữ liệu TypeScript
├── utils/ - Các hàm tiện ích
└── index.ts - API công khai
```

## Bắt đầu

1. Clone repository
2. Cài đặt các phụ thuộc:
   ```
   npm install
   ```
3. Chạy máy chủ phát triển:
   ```
   npm run dev
   ```
4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn

## Hướng dẫn phát triển

- Tuân theo các quy ước TypeScript và duy trì an toàn kiểu dữ liệu
- Sử dụng kiến trúc dựa trên tính năng và tránh phụ thuộc vòng
- Viết bài kiểm tra cho các thành phần và chức năng
- Tuân theo cấu trúc thư mục đã thiết lập để tổ chức nhất quán
- Sử dụng các thành phần dùng chung cho các phần tử UI phổ biến
- Sử dụng Zustand để quản lý trạng thái toàn cục
- Sử dụng React Hook Form với Zod để xác thực biểu mẫu

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

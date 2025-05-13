import { ReactNode } from 'react';

/**
 * Layout cho các trang quản trị
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 
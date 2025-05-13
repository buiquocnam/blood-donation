import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * Trang dashboard của bác sĩ
 */
export default function DoctorDashboardPage() {
  return (
    <main className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý hiến máu</CardTitle>
            <CardDescription>
              Quản lý và cập nhật thông tin sức khỏe của người hiến máu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Khám sức khỏe, đánh giá và cập nhật trạng thái cho người hiến máu tại các sự kiện đang diễn ra.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/doctor/events" className="w-full">
              <Button className="w-full flex items-center justify-between">
                <span>Xem sự kiện đang diễn ra</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thống kê hiến máu</CardTitle>
            <CardDescription>
              Xem thống kê về hiến máu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Thống kê về số lượng người hiến máu, các trường hợp không đủ điều kiện và lượng máu thu được.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full flex items-center justify-between" disabled>
              <span>Đang phát triển</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu hướng dẫn</CardTitle>
            <CardDescription>
              Hướng dẫn sử dụng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hướng dẫn chi tiết cách sử dụng các tính năng trong hệ thống quản lý hiến máu.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full flex items-center justify-between" disabled>
              <span>Đang phát triển</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
} 
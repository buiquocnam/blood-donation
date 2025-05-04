

import { BloodTypeStatsCard } from "@/features/blood-bank";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatisticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Thống kê Hiến máu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhóm máu</CardTitle>
            <CardDescription>
              Biểu đồ phân bố các nhóm máu trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BloodTypeStatsCard />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lượng máu hiến</CardTitle>
            <CardDescription>
              Tổng lượng máu hiến theo thời gian
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Biểu đồ đang được cập nhật...
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan sự kiện</CardTitle>
          <CardDescription>
            Thống kê sự kiện hiến máu theo trạng thái
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Biểu đồ đang được cập nhật...
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
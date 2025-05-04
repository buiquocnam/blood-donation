import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Heart, Calendar, Users, MapPin, Info, Droplet } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-red-50 to-red-100">
        <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Hiến máu cứu người - <span className="text-red-600">Nghĩa cử cao đẹp</span>
            </h1>
            <p className="text-gray-600 md:text-xl">
              Một đơn vị máu có thể cứu sống ba người. Tham gia hiến máu ngay hôm nay và trở thành người hùng thầm lặng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/register">Đăng ký hiến máu</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/events">Xem sự kiện</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-20 -z-10"></div>
              <img
                src="/images/blood-donation.png"
                alt="Hiến máu cứu người"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Thông tin hiến máu */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Tại sao nên hiến máu?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Hiến máu là một hành động nhân đạo giúp cứu sống những người đang cần máu để điều trị bệnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Heart className="h-6 w-6 text-red-600 mb-2" />
              <CardTitle>Cứu sống nhiều người</CardTitle>
              <CardDescription>
                Một đơn vị máu có thể giúp cứu sống đến 3 người trong các tình huống nguy cấp.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Máu được tách thành các thành phần khác nhau như hồng cầu, tiểu cầu và huyết tương, giúp điều trị nhiều bệnh nhân với các nhu cầu khác nhau.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-6 w-6 text-red-600 mb-2" />
              <CardTitle>Lợi ích sức khỏe</CardTitle>
              <CardDescription>
                Hiến máu định kỳ giúp cơ thể sản xuất tế bào máu mới và cải thiện sức khỏe tim mạch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Quá trình hiến máu giúp giảm lượng sắt dư thừa, kích thích cơ thể sản xuất tế bào máu mới và có thể giảm nguy cơ mắc bệnh tim mạch.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="h-6 w-6 text-red-600 mb-2" />
              <CardTitle>Kiểm tra sức khỏe miễn phí</CardTitle>
              <CardDescription>
                Khi hiến máu, bạn được kiểm tra các chỉ số sức khỏe và xét nghiệm máu miễn phí.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Trước khi hiến máu, bạn sẽ được kiểm tra huyết áp, mạch, nhiệt độ, nồng độ hemoglobin và các bệnh lây qua đường máu.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quy trình hiến máu */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Quy trình hiến máu</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Hiến máu là một quy trình đơn giản, an toàn và nhanh chóng chỉ mất khoảng 30-45 phút.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">1</div>
              <h3 className="font-semibold text-lg">Đăng ký</h3>
              <p className="text-sm text-gray-600">
                Điền thông tin cá nhân và lịch sử sức khỏe vào mẫu đăng ký.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">2</div>
              <h3 className="font-semibold text-lg">Khám sàng lọc</h3>
              <p className="text-sm text-gray-600">
                Được kiểm tra huyết áp, mạch, nhiệt độ và xét nghiệm máu cơ bản.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">3</div>
              <h3 className="font-semibold text-lg">Hiến máu</h3>
              <p className="text-sm text-gray-600">
                Quá trình hiến máu chỉ mất khoảng 10-15 phút, an toàn và ít đau.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">4</div>
              <h3 className="font-semibold text-lg">Nghỉ ngơi</h3>
              <p className="text-sm text-gray-600">
                Nghỉ ngơi và ăn nhẹ sau khi hiến máu để phục hồi sức khỏe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sự kiện sắp tới */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Sự kiện hiến máu sắp tới</h2>
            <p className="text-muted-foreground mt-2">
              Tham gia các sự kiện hiến máu gần bạn
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/events">Xem tất cả sự kiện</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event 1 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Sắp diễn ra
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-2">Ngày hội hiến máu tình nguyện</CardTitle>
              <CardDescription>20/06/2023 • 8:00 - 16:00</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Trường Đại học Bách khoa Hà Nội</span>
              </div>
              <p className="text-sm text-gray-600">
                Chương trình hiến máu tình nguyện do Đoàn Thanh niên tổ chức nhằm khuyến khích tinh thần hiến máu trong sinh viên.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </CardFooter>
          </Card>

          {/* Event 2 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Sắp diễn ra
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-2">Hiến máu nhân đạo</CardTitle>
              <CardDescription>25/06/2023 • 7:30 - 17:00</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Viện Huyết học và Truyền máu Trung ương</span>
              </div>
              <p className="text-sm text-gray-600">
                Chương trình hiến máu thường xuyên tại Viện Huyết học, phục vụ nhu cầu máu cho các bệnh viện trong khu vực.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </CardFooter>
          </Card>

          {/* Event 3 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Khẩn cấp
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-2">Hiến máu cứu người</CardTitle>
              <CardDescription>Ngay hôm nay • 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Bệnh viện Bạch Mai</span>
              </div>
              <p className="text-sm text-gray-600">
                Cần gấp máu nhóm O và A cho các ca phẫu thuật khẩn cấp. Các tình nguyện viên có thể đến hiến máu bất kỳ lúc nào.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Hiến máu ngay</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Kêu gọi hành động */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Droplet className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Trở thành người hiến máu ngay hôm nay</h2>
          <p className="max-w-2xl mx-auto mb-8 text-red-100">
            Hiến máu là một hành động cao đẹp, giúp cứu sống những người đang cần máu để điều trị bệnh.
            Hãy trở thành một phần của cộng đồng hiến máu và lan tỏa tình người.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-red-50 border-white" asChild>
              <Link href="/auth/register">Đăng ký hiến máu</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-red-700" asChild>
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 
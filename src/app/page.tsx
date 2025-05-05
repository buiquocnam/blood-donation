import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Hệ Thống Quản Lý
                <span className="text-primary block">Hiến Máu</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Nền tảng kết nối người hiến máu, nhân viên y tế và ngân hàng máu.
                Mỗi giọt máu hiến tặng, một cuộc đời được cứu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg">
                  <Link href="/auth/register">Đăng Ký Ngay</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/about">Tìm Hiểu Thêm</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative h-[350px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Hiến máu cứu người"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Tại sao chọn chúng tôi?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 text-center hover:shadow-md transition-shadow duration-normal">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dễ dàng đăng ký</h3>
              <p className="text-muted-foreground">
                Đăng ký hiến máu chỉ trong vài phút. Giao diện thân thiện, dễ sử dụng.
              </p>
            </Card>
            
            {/* Feature 2 */}
            <Card className="p-6 text-center hover:shadow-md transition-shadow duration-normal">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý lịch sử</h3>
              <p className="text-muted-foreground">
                Theo dõi lịch sử hiến máu của bạn và nhận thông báo về các sự kiện sắp tới.
              </p>
            </Card>
            
            {/* Feature 3 */}
            <Card className="p-6 text-center hover:shadow-md transition-shadow duration-normal">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">An toàn và Bảo mật</h3>
              <p className="text-muted-foreground">
                Thông tin của bạn được bảo vệ an toàn và chỉ được sử dụng cho mục đích hiến máu.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-accent-foreground">Tác động của chúng tôi</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {statItem("5.000+", "Người hiến máu")}
            {statItem("120+", "Sự kiện hiến máu")}
            {statItem("3.500+", "Đơn vị máu")}
            {statItem("10.000+", "Người được cứu")}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng cứu sống người khác?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Hãy tham gia cộng đồng những người hiến máu và giúp đỡ những người cần máu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-white text-primary hover:bg-accent border-white"
            >
              <Link href="/auth/register">Đăng Ký Là Người Hiến Máu</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-primary-foreground hover:opacity-90 text-primary"
            >
              <Link href="/events">Xem Sự Kiện Hiến Máu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function để tạo stat item
function statItem(number: string, label: string) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-primary mb-2">{number}</p>
      <p className="text-accent-foreground">{label}</p>
    </div>
  );
}

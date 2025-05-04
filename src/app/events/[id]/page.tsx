"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Mail,
  Phone,
  User,
  ArrowLeft,
  CheckCircle,
  Info,
  Droplet
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";

// Dữ liệu mẫu cho các sự kiện
const events = [
  {
    id: "1",
    title: "Hiến máu tình nguyện tại Đại học Bách Khoa Hà Nội",
    date: "20/08/2023",
    time: "08:00",
    endTime: "17:00",
    location: "Đại học Bách Khoa Hà Nội, Hai Bà Trưng, Hà Nội",
    status: "active",
    registrations: 120,
    organizer: "Viện Huyết học - Truyền máu Trung ương",
    maxParticipants: 200,
    description: "Chương trình hiến máu nhân đạo được tổ chức tại Đại học Bách Khoa Hà Nội nhằm góp phần bổ sung nguồn máu cho điều trị và cứu chữa bệnh nhân. Tham gia hiến máu là nghĩa cử cao đẹp, thể hiện tinh thần tương thân tương ái, sẻ chia với cộng đồng.",
    requirements: "- Người khỏe mạnh, từ 18-60 tuổi\n- Cân nặng: Nam ≥ 50kg, Nữ ≥ 45kg\n- Không mắc các bệnh truyền nhiễm\n- Không sử dụng rượu, bia trước khi hiến máu\n- Mang theo CMND/CCCD",
    image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    contactPerson: "Nguyễn Văn A",
    contactPhone: "0987654321",
    contactEmail: "contact@vienhuyet.org.vn",
    notes: "Mỗi người tham gia sẽ được kiểm tra sức khỏe miễn phí, nhận giấy chứng nhận và quà tặng sau khi hiến máu."
  }
];

// Map trạng thái sự kiện sang tiếng Việt và màu sắc
const statusMap: Record<string, { text: string; color: string }> = {
  active: { text: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  upcoming: { text: "Sắp diễn ra", color: "bg-blue-100 text-blue-800" },
  completed: { text: "Đã kết thúc", color: "bg-gray-100 text-gray-800" },
  cancelled: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Tìm sự kiện theo ID
  const event = events.find((event) => event.id === id);
  
  // Xử lý đăng ký tham gia sự kiện
  const handleRegister = () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }
    
    setIsRegistering(true);
    
    // Giả lập gọi API đăng ký
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
      toast.success("Đăng ký tham gia sự kiện thành công!");
    }, 1000);
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Sự kiện không tồn tại</h1>
          <p className="text-gray-600 mb-6">
            Rất tiếc, sự kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button asChild>
            <Link href="/events">Quay lại danh sách sự kiện</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/events" className="text-sm text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách sự kiện
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusMap[event.status]?.color || "bg-gray-100"}`}>
                {statusMap[event.status]?.text || event.status}
              </span>
              <span className="text-gray-600 text-sm flex items-center">
                <Droplet className="h-4 w-4 mr-1 text-red-500" />
                Tất cả các nhóm máu
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-red-500" />
                <span>{event.date}</span>
                <span className="mx-2">|</span>
                <Clock className="h-5 w-5 mr-2 text-red-500" />
                <span>{event.time} - {event.endTime}</span>
              </div>

              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-500" />
                <span>Đăng ký: {event.registrations} / {event.maxParticipants} người</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{ width: `${(event.registrations / event.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-3">Mô tả sự kiện</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>

            {event.requirements && (
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-3">Yêu cầu tham gia</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="whitespace-pre-line">{event.requirements}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {event.notes && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-3">Thông tin bổ sung</h2>
                <p className="whitespace-pre-line">{event.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký tham gia</CardTitle>
            </CardHeader>
            <CardContent>
              {event.status === "active" || event.status === "upcoming" ? (
                isRegistered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-800 mb-1">Đã đăng ký thành công!</p>
                    <p className="text-sm text-green-600 mb-3">
                      Cảm ơn bạn đã đăng ký tham gia sự kiện hiến máu này.
                    </p>
                    <Link 
                      href="/profile" 
                      className="text-sm text-green-700 underline font-medium"
                    >
                      Xem lịch sử đăng ký
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Đăng ký tham gia sự kiện hiến máu để giúp đỡ những người đang cần máu.
                    </p>
                    {event.registrations >= event.maxParticipants ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="font-medium text-yellow-800">
                          Đã đạt giới hạn đăng ký!
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Sự kiện này đã đạt số lượng đăng ký tối đa.
                        </p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={handleRegister}
                        disabled={isRegistering}
                      >
                        {isRegistering ? "Đang xử lý..." : "Đăng ký tham gia"}
                      </Button>
                    )}
                  </div>
                )
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="font-medium text-gray-800">
                    Sự kiện đã kết thúc!
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Sự kiện này đã diễn ra hoặc đã hủy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đơn vị tổ chức</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-4">{event.organizer}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <span>{event.contactPerson}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <span>{event.contactPhone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-blue-600 hover:underline">
                  <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chia sẻ sự kiện</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Tham gia sự kiện hiến máu: ${event.title}`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                    </svg>
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(`Sự kiện hiến máu: ${event.title}`)}&body=${encodeURIComponent(`Xem thông tin và đăng ký tham gia sự kiện hiến máu tại: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`} 
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Đã sao chép liên kết vào clipboard");
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
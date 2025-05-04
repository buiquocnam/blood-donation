import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sự kiện hiến máu - Hệ Thống Quản Lý Hiến Máu",
  description: "Danh sách các sự kiện hiến máu sắp diễn ra.",
};

// Dữ liệu mẫu cho các sự kiện
const events = [
  {
    id: "1",
    title: "Hiến máu tình nguyện tại Đại học Bách Khoa Hà Nội",
    date: "20/08/2023",
    time: "08:00 - 17:00",
    location: "Đại học Bách Khoa Hà Nội, Hai Bà Trưng, Hà Nội",
    image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    status: "Đang diễn ra",
  },
  {
    id: "2",
    title: "Ngày hội hiến máu - Giọt hồng yêu thương",
    date: "15/09/2023",
    time: "07:30 - 16:30",
    location: "Trung tâm Hội nghị Quốc gia, Nam Từ Liêm, Hà Nội",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61adc7a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    status: "Sắp diễn ra",
  },
  {
    id: "3",
    title: "Chương trình hiến máu tình nguyện - Sẻ chia giọt máu, trao đời sự sống",
    date: "10/10/2023",
    time: "08:00 - 16:00",
    location: "Viện Huyết học - Truyền máu Trung ương, Hà Nội",
    image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    status: "Sắp diễn ra",
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Sự kiện hiến máu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dưới đây là danh sách các sự kiện hiến máu sắp diễn ra. Hãy tham gia và góp phần cứu sống những người cần máu.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-gray-700">Lọc theo:</span>
              <select className="border rounded-md px-3 py-1.5 text-sm">
                <option>Tất cả</option>
                <option>Sắp diễn ra</option>
                <option>Đang diễn ra</option>
              </select>
              <select className="border rounded-md px-3 py-1.5 text-sm">
                <option>Tất cả địa điểm</option>
                <option>Hà Nội</option>
                <option>TP. Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
              </select>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm sự kiện..."
                className="border rounded-md px-3 py-1.5 pl-8 w-full md:w-64"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <Link href={`/events/${event.id}`} className="md:w-1/3 relative h-64 md:h-auto block">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Link>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/events/${event.id}`}>
                    <h2 className="text-xl font-bold hover:text-red-600 transition-colors">{event.title}</h2>
                  </Link>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    event.status === "Đang diễn ra" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date} | {event.time}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/events/${event.id}`}>Xem chi tiết</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/events/${event.id}`}>Đăng ký tham gia</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy sự kiện phù hợp với bạn?</p>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Đăng ký để nhận thông báo về các sự kiện mới</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 
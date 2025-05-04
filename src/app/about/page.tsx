import Image from "next/image";

export const metadata = {
  title: "Giới thiệu - Hệ Thống Quản Lý Hiến Máu",
  description: "Thông tin về hệ thống quản lý hiến máu và sứ mệnh của chúng tôi.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Về Hệ Thống Hiến Máu</h1>
        
        <div className="prose max-w-none">
          <p className="lead text-lg mb-8">
            Hệ Thống Hiến Máu là một nền tảng toàn diện được thiết kế để kết nối những người
            hiến máu, các cơ sở y tế, cơ sở tình nguyện, và ngân hàng máu trên toàn quốc.
            Mục tiêu của chúng tôi là làm cho quá trình hiến máu trở nên dễ dàng, hiệu quả
            và được tổ chức tốt hơn.
          </p>
          
          <div className="my-8 relative h-80 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1615461066841-6116e61adc7a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Hiến máu cứu người"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Sứ mệnh của chúng tôi</h2>
          <p>
            Sứ mệnh của chúng tôi là giúp tăng số lượng người hiến máu và cải thiện chuỗi
            cung ứng máu tại Việt Nam. Chúng tôi tin rằng không ai nên thiếu máu khi cần,
            và việc hiến máu nên là một trải nghiệm thuận tiện và đáng nhớ.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Cách chúng tôi hoạt động</h2>
          <p>
            Hệ thống của chúng tôi phục vụ nhiều đối tượng khác nhau trong quá trình hiến máu:
          </p>
          
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Người hiến máu:</strong> Dễ dàng đăng ký hiến máu, theo dõi lịch sử hiến máu, và nhận thông báo khi có sự kiện hiến máu gần đó.</li>
            <li><strong>Nhân viên y tế:</strong> Quản lý đăng ký hiến máu, cập nhật thông tin người hiến, và theo dõi trạng thái hiến máu.</li>
            <li><strong>Bác sĩ:</strong> Xem lịch sử sức khỏe của người hiến máu và ghi lại các thông tin y tế quan trọng.</li>
            <li><strong>Cơ sở tình nguyện:</strong> Tổ chức các sự kiện hiến máu và quản lý tình nguyện viên.</li>
            <li><strong>Ngân hàng máu:</strong> Theo dõi lượng máu hiến và quản lý việc phân phối máu.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Tham gia cùng chúng tôi</h2>
          <p>
            Hãy tham gia cùng chúng tôi trong sứ mệnh cứu sống người bệnh thông qua hiến máu.
            Cho dù bạn là người hiến máu, nhân viên y tế, hay đại diện của một cơ sở tình nguyện,
            chúng tôi đều có các công cụ và nguồn lực để hỗ trợ bạn.
          </p>
          
          <div className="bg-red-50 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-red-600 mb-2">Bạn biết không?</h3>
            <p className="text-gray-800">
              Một người hiến máu có thể cứu sống đến 3 người! Mỗi 2 giây lại có một người cần
              máu, và một lần hiến máu là đủ để tạo ra sự khác biệt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
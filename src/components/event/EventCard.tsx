"use client"

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTimeOnly } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2,
  Calendar as CalendarFull
} from "lucide-react";
import { DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from "@/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuthCheck } from "@/features/public/hooks/useAuthCheck";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: DANGKITOCHUCHIENMAU_WithRelations;
  role?: "user" | "staff" | "doctor" | "admin";
  onStaffAction?: (event: DANGKITOCHUCHIENMAU_WithRelations) => void;
}

const STATUS_CONFIG = {
  [TrangThaiSuKien.SAP_DIEN_RA]: { 
    variant: "default" as const, 
    text: "Sắp diễn ra", 
    className: "bg-blue-500" 
  },
  [TrangThaiSuKien.DANG_DIEN_RA]: { 
    variant: "default" as const, 
    text: "Đang diễn ra", 
    className: "bg-green-500" 
  },
  [TrangThaiSuKien.DA_HOAN_THANH]: { 
    variant: "secondary" as const, 
    text: "Đã hoàn thành", 
    className: "" 
  }
};

export function EventCard({ event, role = "user", onStaffAction }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { isAuthenticated, isLoading } = useAuthCheck();
  const router = useRouter();

  const {
    ThongBao,
    NgayDang: startDate,
    NgaySua: endDate,
    CoSoTinhNguyen,
    IDCoSoTinhNguyen,
    NgayDangKi,
    SoLuongDK,
    SoLuongDDK,
    IdSuKien,
    TrangThaiSuKien: status
  } = event;

  // Derived values
  const eventTitle = ThongBao?.TieuDe || `Sự kiện hiến máu ${IdSuKien}`;
  const location = CoSoTinhNguyen?.TenCoSoTinhNguyen || IDCoSoTinhNguyen || "Không xác định";
  const description = ThongBao?.NoiDung || "Sự kiện hiến máu nhân đạo";
  const registrationTime = formatTimeOnly(NgayDangKi);
  const registrationPercent = SoLuongDK > 0 ? (SoLuongDDK / SoLuongDK) * 100 : 0;
  const isEventAvailable = [TrangThaiSuKien.SAP_DIEN_RA, TrangThaiSuKien.DANG_DIEN_RA].includes(status);
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { 
    variant: "outline" as const, 
    text: "Không xác định", 
    className: "" 
  };

  // Event handlers
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Đã bỏ lưu sự kiện" : "Đã lưu sự kiện");
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events/${IdSuKien}`;
    const shareData = {
      title: eventTitle,
      text: description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Đã sao chép liên kết vào clipboard');
      }
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
      toast.error('Không thể chia sẻ liên kết');
    }
  };

  const handleRegister = () => {
    setIsRegistering(true);
    
    try {
      const registrationPath = `/events/register?eventId=${IdSuKien}`;
      
      if (!isAuthenticated) {
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(registrationPath)}`;
        toast.info("Vui lòng đăng nhập để đăng ký tham gia sự kiện", {
          duration: 3000,
          action: {
            label: "Đăng nhập",
            onClick: () => router.push(loginUrl)
          }
        });
        return;
      }
      
      router.push(registrationPath);
    } catch (error) {
      console.error("Lỗi khi đăng ký sự kiện:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStaffAction = () => {
    if (onStaffAction) {
      onStaffAction(event);
    } else {
      router.push(`/medical-staff/events/${IdSuKien}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-medium mb-2">
                  <Link href={`/events/${IdSuKien}`} className="hover:text-primary">
                    {eventTitle}
                  </Link>
                </h3>
                <Badge
                  variant={statusConfig.variant}
                  className={statusConfig.className}
                >
                  {statusConfig.text}
                </Badge>
              </div>
              
              {role === "user" && (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={handleBookmark}
                    title={isBookmarked ? "Bỏ lưu" : "Lưu sự kiện này"}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} 
                    />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={handleShare}
                    title="Chia sẻ sự kiện"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <EventInfoItem
                icon={<CalendarFull className="h-5 w-5 text-primary" />}
                label="Ngày diễn ra"
                value={
                  <>
                    {formatDate(startDate)}
                    {endDate && endDate !== startDate && (
                      <> - {formatDate(endDate)}</>
                    )}
                  </>
                }
              />
              
              <EventInfoItem
                icon={<Clock className="h-5 w-5 text-primary" />}
                label="Thời gian đăng ký"
                value={registrationTime}
              />
            
              <EventInfoItem
                icon={<MapPin className="h-5 w-5 text-primary" />}
                label="Địa điểm"
                value={location}
              />
              
              <EventInfoItem
                icon={<Users className="h-5 w-5 text-primary" />}
                label="Đã đăng ký"
                value={
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground flex justify-between">
                      <span>Đã đăng ký</span>
                      <span className="font-medium">{SoLuongDDK}/{SoLuongDK}</span>
                    </p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(registrationPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                }
              />
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </CardContent>
        </div>

        <CardFooter className="px-8 py-6 bg-muted/5">
          {role === "user" ? (
            <Button 
              onClick={handleRegister}
              disabled={!isEventAvailable || isRegistering || isLoading}
              className="relative overflow-hidden group w-full"
              title={!isEventAvailable ? "Sự kiện này không còn nhận đăng ký" : ""}
            >
              {isRegistering ? (
                <LoadingSpinner text="Đang xử lý..." />
              ) : (
                <RegisterButton isAuthenticated={isAuthenticated} />
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleStaffAction}
              className="relative overflow-hidden group w-full"
            >
              <span className="relative z-10">Xem đăng ký</span>
              <span className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Extracted components
const EventInfoItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="bg-primary/10 p-1.5 rounded shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium line-clamp-1">{value}</div>
    </div>
  </div>
);

const LoadingSpinner = ({ text }: { text: string }) => (
  <span className="flex items-center">
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    {text}
  </span>
);

const RegisterButton = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <>
    {!isAuthenticated && (
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
      </span>
    )}
    <span className="relative z-10">Đăng ký tham gia</span>
    <span className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
  </>
);
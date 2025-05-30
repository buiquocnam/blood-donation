"use client"

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatDateOnly, formatTimeOnly } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  ChevronRight,
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
  variant?: "default" | "compact";
  role?: "user" | "staff" | "doctor" | "admin";
  onStaffAction?: (event: DANGKITOCHUCHIENMAU_WithRelations) => void;
}

export function EventCard({ event, variant = "default", role = "user", onStaffAction }: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { handleEventRegistration, isAuthenticated, isLoading } = useAuthCheck();
  const router = useRouter();


  // Get status badge color and variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case TrangThaiSuKien.SAP_DIEN_RA:
        return { variant: "default" as const, text: "Sắp diễn ra", className: "bg-blue-500" };
      case TrangThaiSuKien.DANG_DIEN_RA:
        return { variant: "default" as const, text: "Đang diễn ra", className: "bg-green-500" };
      case TrangThaiSuKien.DA_HOAN_THANH:
        return { variant: "secondary" as const, text: "Đã hoàn thành", className: "" };
      default:
        return { variant: "outline" as const, text: "Không xác định", className: "" };
    }
  };

  // Thông tin của sự kiện - Lấy từ dữ liệu quan hệ nếu có
  const eventTitle = event.ThongBao?.TieuDe || `Sự kiện hiến máu ${event.IdSuKien}`;
  const startDate = event.NgayDang;
  const endDate = event.NgaySua;
  const location = event.CoSoTinhNguyen?.TenCoSoTinhNguyen || event.IDCoSoTinhNguyen || "Không xác định";
  const description = event.ThongBao?.NoiDung || "Sự kiện hiến máu nhân đạo";
  const registrationTime = formatTimeOnly(event.NgayDangKi);


  // Calculate registration percentage
  const registrationPercent = event.SoLuongDK > 0 
    ? (event.SoLuongDDK / event.SoLuongDK) * 100 
    : 0;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Đã bỏ lưu sự kiện" : "Đã lưu sự kiện");
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/events/${event.IdSuKien}`;

    if (navigator.share) {
      navigator.share({
        title: eventTitle,
        text: description,
        url: shareUrl,
      }).catch(error => {
        console.error('Lỗi khi chia sẻ:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Đã sao chép liên kết vào clipboard');
      }).catch(err => {
        console.error('Lỗi khi sao chép liên kết:', err);
        toast.error('Không thể sao chép liên kết');
      });
    }
  };

  // Handle registration click with enhanced authentication check
  const onRegisterClick = () => {
    setIsRegistering(true);
    
    try {
      // Get the event registration path
      const registrationPath = `/events/register?eventId=${event.IdSuKien}`;
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Create a login URL with the registration path as the redirect URL
        const loginUrl = `/auth/login?redirect=${encodeURIComponent(registrationPath)}`;
        
        // Show toast notification
        toast.info("Vui lòng đăng nhập để đăng ký tham gia sự kiện", {
          duration: 3000,
          action: {
            label: "Đăng nhập",
            onClick: () => router.push(loginUrl)
          }
        });
        
        setIsRegistering(false);
        return;
      }
      
      // User is authenticated, redirect to registration
      router.push(registrationPath);
    } catch (error) {
      console.error("Lỗi khi đăng ký sự kiện:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle staff action click
  const onStaffActionClick = () => {
    if (onStaffAction) {
      onStaffAction(event);
    } else {
      // Default behavior if no callback is provided
      router.push(`/medical-staff/registrations/${event.IdSuKien}`);
    }
  };

  // Compact variant
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium line-clamp-2">
                  <Link href={`/events/${event.IdSuKien}`} className="hover:text-primary">
                    {eventTitle}
                  </Link>
                </h3>
                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {formatDate(startDate)}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span className="line-clamp-1">{location}</span>
                </div>
              </div>
              <Badge
                variant={getStatusBadge(event.TrangThaiSuKien).variant}
                className={getStatusBadge(event.TrangThaiSuKien).className}
              >
                {getStatusBadge(event.TrangThaiSuKien).text}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Kiểm tra xem sự kiện có sẵn sàng để đăng ký không
  const isEventAvailable = event.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA || 
                          event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA;

  // Default variant
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium mb-2">
                  <Link href={`/events/${event.IdSuKien}`} className="hover:text-primary">
                    {eventTitle}
                  </Link>
                </h3>
                <Badge
                  variant={getStatusBadge(event.TrangThaiSuKien).variant}
                  className={getStatusBadge(event.TrangThaiSuKien).className}
                >
                  {getStatusBadge(event.TrangThaiSuKien).text}
                </Badge>
              </div>
              <div className="flex gap-2">
                {role === "user" && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="bg-primary/10 p-1.5 rounded mr-3">
                  <CalendarFull className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày diễn ra</p>
                  <p className="font-medium">
                    {formatDate(startDate)}
                    {endDate && endDate !== startDate && (
                      <> - {formatDate(endDate)}</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="bg-primary/10 p-1.5 rounded mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian đăng ký</p>
                  <p className="font-medium">{registrationTime}</p>
                </div>
              </div>
            
              <div className="flex items-center text-sm">
                <div className="bg-primary/10 p-1.5 rounded mr-3">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa điểm</p>
                  <p className="font-medium line-clamp-1">{location}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="bg-primary/10 p-1.5 rounded mr-3">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground flex justify-between">
                    <span>Đã đăng ký</span>
                    <span className="font-medium">{event.SoLuongDDK}/{event.SoLuongDK}</span>
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(registrationPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </CardContent>
        </div>
        <CardFooter className="px-6 py-4 flex justify-between">
          {role === "user" ? (
            <Button 
              onClick={onRegisterClick}
              disabled={!isEventAvailable || isRegistering || isLoading}
              className="relative overflow-hidden group"
              title={!isEventAvailable ? "Sự kiện này không còn nhận đăng ký" : ""}
            >
              {isRegistering ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <>
                  {!isAuthenticated && <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>}
                  <span className="relative z-10">Đăng ký tham gia</span>
                  <span className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={onStaffActionClick}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Xem đăng ký</span>
              <span className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
} 
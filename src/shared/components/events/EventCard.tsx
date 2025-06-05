'use client';

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
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { DANGKITOCHUCHIENMAU_RESPONSE, DANGKITOCHUCHIENMAU_WithRelations, TrangThaiSuKien } from '@/types';
import { EVENT_STATUS_CONFIG } from '@/shared/constants/events';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { UserRole } from '@/features/auth/types';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export interface EventCardProps {
  event: DANGKITOCHUCHIENMAU_RESPONSE;
  actorPath?: string;
  showActions?: boolean;
  onAction?: (action: string, eventId: string) => void;
  showDetailLink?: boolean;
  role?: "user" | "staff" | "doctor" | "admin";
  onStaffAction?: (event: DANGKITOCHUCHIENMAU_WithRelations) => void;
}

type Role = keyof typeof UserRole;

export function EventCard({ 
  event,
}: EventCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const {
    THONGBAODKTOCHUC,
    NgayDang: startDate,
    NgaySua: endDate,
    COSOTINHNGUYEN,
    NgayDangKi,
    TinhTrangDK,
    SoLuongDK,
    SoLuongDDK,
    IdSuKien,
    TrangThaiSuKien: status
  } = event;

  // Derived values
  const eventTitle = THONGBAODKTOCHUC?.TieuDe || `Sự kiện hiến máu ${IdSuKien}`;
  const description = THONGBAODKTOCHUC?.NoiDung || "Sự kiện hiến máu nhân đạo";
  const location = COSOTINHNGUYEN?.TenCoSoTinhNguyen || COSOTINHNGUYEN?.IDCoSoTinhNguyen || "Không xác định";
  const registrationTime = formatTimeOnly(NgayDangKi);
  const registrationPercent = SoLuongDK > 0 ? (SoLuongDDK / SoLuongDK) * 100 : 0;
  const isEventAvailable = [TrangThaiSuKien.SAP_DIEN_RA, TrangThaiSuKien.DANG_DIEN_RA].includes(status as TrangThaiSuKien);
  const statusConfig = EVENT_STATUS_CONFIG[status as keyof typeof EVENT_STATUS_CONFIG] || { 
    variant: "outline" as const, 
    text: "Không xác định", 
    className: "" 
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu sự kiện");
      return;
    }
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

  const handleNavigate = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.MaVaiTro === UserRole.ROLE_DONOR) {
      console.log('Đăng ký hiến máu');
      router.push(`/events/${IdSuKien}/register`);
    } else if (user?.MaVaiTro === UserRole.ROLE_MEDICAL_STAFF) {
      console.log('Quản lý đăng ký');
      router.push(`/medical-staff/events/${IdSuKien}/registrations`);
    } else if (user?.MaVaiTro === UserRole.ROLE_DOCTOR) {
      router.push(`/doctor/events/${IdSuKien}`);
    } else {
      router.push(`/events/${IdSuKien}`);
    }
  };

  const getActionButton = () => {
    if (!isAuthenticated) {
      return {
        text: "Đăng nhập để tiếp tục",
        disabled: false
      };
    }

    switch (user?.MaVaiTro) {
      case UserRole.ROLE_DONOR:
        return {
          text: "Đăng ký hiến máu",
          disabled: !isEventAvailable
        };
      case UserRole.ROLE_MEDICAL_STAFF:
        return {
          text: "Quản lý đăng ký",
          disabled: false
        };
      case UserRole.ROLE_DOCTOR:
        return {
          text: "Quản lý sự kiện",
          disabled: false
        };
      default:
        return {
          text: "Xem chi tiết",
          disabled: false
        };
    }
  };

  const actionButton = getActionButton();

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
        <div className="relative overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-medium mb-2">
                  <Link 
                    href={`/events/${IdSuKien}`} 
                    className="hover:text-primary transition-colors inline-flex items-center group"
                  >
                    {eventTitle}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </h3>
                <Badge
                  variant={statusConfig.variant}
                  className={`${statusConfig.className} transition-all duration-300 hover:opacity-80`}
                >
                  {statusConfig.text}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:scale-110"
                  onClick={handleBookmark}
                  title={isBookmarked ? "Bỏ lưu" : "Lưu sự kiện này"}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${isBookmarked ? "fill-primary text-primary" : ""}`} 
                  />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:scale-110"
                  onClick={handleShare}
                  title="Chia sẻ sự kiện"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <EventInfoItem
                icon={<CalendarIcon className="h-5 w-5 text-primary" />}
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
          <Button 
            onClick={handleNavigate}
            disabled={actionButton.disabled}
            className="relative w-full group transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center">
              {actionButton.text}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

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
    <div className="bg-primary/10 p-1.5 rounded shrink-0 transition-colors hover:bg-primary/20">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="font-medium line-clamp-1">{value}</div>
    </div>
  </div>
); 
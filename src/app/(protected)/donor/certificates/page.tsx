"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Calendar, Download, FileText, Loader2, Search, UserCircle } from "lucide-react";
import { useDonationCertificates } from "@/features/donor/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { GIAYCHUNGNHAN } from "@/types/events";
import { formatDate } from '@/utils';

export default function CertificatesPage() {
  const { data: certificates = [ ], isLoading } = useDonationCertificates();
  const [searchQuery, setSearchQuery] = useState("");

  // Function để lọc giấy chứng nhận
  const filteredCertificates = certificates.filter(cert => {
    if (!searchQuery) return true;
    
    // Convert date to string for searching
    const certDate = cert.NgayCap ? new Date(cert.NgayCap).toLocaleDateString('vi-VN') : '';
    
    return (
      cert.IdGiayChungNhan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certDate.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Giấy chứng nhận hiến máu</h2>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã chứng nhận, ngày cấp..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-5 w-1/2 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Không tìm thấy giấy chứng nhận</h3>
          {searchQuery ? (
            <p className="text-muted-foreground max-w-md mx-auto">
              Không tìm thấy giấy chứng nhận nào phù hợp với từ khóa "{searchQuery}". Hãy thử tìm kiếm lại.
            </p>
          ) : (
            <p className="text-muted-foreground max-w-md mx-auto">
              Bạn chưa có giấy chứng nhận hiến máu nào. Giấy chứng nhận sẽ được cấp sau khi bạn hoàn thành hiến máu.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <CertificateCard key={cert.IdGiayChungNhan} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CertificateCardProps {
  certificate: GIAYCHUNGNHAN;
}

function CertificateCard({ certificate }: CertificateCardProps) {
  // Bật mở hộp thoại tải xuống file
  const handleDownload = () => {
    // Tạo mẫu file chứng nhận để tải xuống (trong thực tế sẽ tải API)
    const dummyContent = `
      GIẤY CHỨNG NHẬN HIẾN MÁU
      --------------------------
      Mã giấy chứng nhận: ${certificate.IdGiayChungNhan}
      Người hiến máu: ${certificate.MaNguoiDung}
      Ngày cấp: ${formatDate(certificate.NgayCap)}
      
      Chúng tôi xác nhận người hiến máu đã tham gia hiến máu tình nguyện.
      Xin chân thành cảm ơn!
    `;
    
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chung_nhan_hien_mau_${certificate.IdGiayChungNhan}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-yellow-500" />
          Giấy chứng nhận hiến máu
        </CardTitle>
        <CardDescription>Mã: {certificate.IdGiayChungNhan}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <UserCircle className="mr-2 h-4 w-4 text-blue-500" />
          <span>Người hiến: {certificate.MaNguoiDung}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-green-500" />
          <span>Ngày cấp: {formatDate(certificate.NgayCap)}</span>
        </div>
        <div className="flex items-center text-sm">
          <FileText className="mr-2 h-4 w-4 text-purple-500" />
          <span>Sự kiện: {certificate.IdSuKienHienMau || "Không có thông tin"}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Tải chứng nhận
        </Button>
      </CardFooter>
    </Card>
  );
} 
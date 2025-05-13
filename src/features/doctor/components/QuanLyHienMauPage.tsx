'use client';

import { useState } from 'react';
import { useQuanLyHienMau } from '../hooks';
import { DanhSachDangKy } from './DanhSachDangKy';
import { ChiTietDangKyModal } from './ChiTietDangKyModal';
import { 
  DANGKIHIENMAU_WithRelations, 
  CapNhatSucKhoe, 
  TabBacSi 
} from '../types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
/**
 * Props cho component QuanLyHienMauPage
 */
interface QuanLyHienMauPageProps {
  idSuKien: string;
  tenSuKien: string;
}

/**
 * Trang quản lý hiến máu cho bác sĩ
 */
export function QuanLyHienMauPage({ idSuKien, tenSuKien }: QuanLyHienMauPageProps) {
  const [activeTab, setActiveTab] = useState<TabBacSi>(TabBacSi.CHO_KHAM);
  const [selectedDangKy, setSelectedDangKy] = useState<DANGKIHIENMAU_WithRelations | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sử dụng hook để quản lý hiến máu
  const {
    choKhamQuery,
    daHienMauQuery,
    khongDuDieuKienQuery,
    capNhatSucKhoeMutation
  } = useQuanLyHienMau(idSuKien);

  /**
   * Xử lý khi click vào xem chi tiết
   */
  const handleXemChiTiet = (dangKy: DANGKIHIENMAU_WithRelations) => {
    setSelectedDangKy(dangKy);
    setIsModalOpen(true);
  };

  /**
   * Xử lý khi cập nhật sức khỏe
   */
  const handleCapNhatSucKhoe = async (data: CapNhatSucKhoe) => {
    try {
      await capNhatSucKhoeMutation.mutateAsync(data);
      toast.success('Đã cập nhật thông tin sức khỏe thành công');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin sức khỏe');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý hiến máu: {tenSuKien}</CardTitle>
          <CardDescription>
            Quản lý và cập nhật thông tin sức khỏe của người hiến máu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={TabBacSi.CHO_KHAM} 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabBacSi)}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value={TabBacSi.CHO_KHAM}>Chờ khám sức khỏe</TabsTrigger>
              <TabsTrigger value={TabBacSi.DA_HIEN_MAU}>Đã hiến máu</TabsTrigger>
              <TabsTrigger value={TabBacSi.KHONG_DU_DIEU_KIEN}>Không đủ điều kiện</TabsTrigger>
            </TabsList>

            <TabsContent value={TabBacSi.CHO_KHAM}>
              <DanhSachDangKy
                title="Danh sách chờ khám sức khỏe"
                description="Danh sách người đã được duyệt, cần khám sức khỏe trước khi hiến máu"
                danhSach={choKhamQuery.data || []}
                isLoading={choKhamQuery.isLoading}
                onClickXemChiTiet={handleXemChiTiet}
              />
            </TabsContent>

            <TabsContent value={TabBacSi.DA_HIEN_MAU}>
              <DanhSachDangKy
                title="Danh sách đã hiến máu"
                description="Danh sách người đã hiến máu thành công"
                danhSach={daHienMauQuery.data || []}
                isLoading={daHienMauQuery.isLoading}
                onClickXemChiTiet={handleXemChiTiet}
              />
            </TabsContent>

            <TabsContent value={TabBacSi.KHONG_DU_DIEU_KIEN}>
              <DanhSachDangKy
                title="Danh sách không đủ điều kiện"
                description="Danh sách người không đủ điều kiện hiến máu"
                danhSach={khongDuDieuKienQuery.data || []}
                isLoading={khongDuDieuKienQuery.isLoading}
                onClickXemChiTiet={handleXemChiTiet}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ChiTietDangKyModal
        open={isModalOpen}
        dangKy={selectedDangKy}
        onClose={() => setIsModalOpen(false)}
        onCapNhatSucKhoe={handleCapNhatSucKhoe}
        isLoading={capNhatSucKhoeMutation.isPending}
      />
    </div>
  );
} 
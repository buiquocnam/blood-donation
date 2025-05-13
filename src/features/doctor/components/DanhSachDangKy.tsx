'use client';

import { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DANGKIHIENMAU_WithRelations } from '../types';
import { Badge } from '@/components/ui/badge';
import { 
  TrangThaiDangKy, 
  TrangThaiHienMau, 
  TrangThaiSucKhoe 
} from '@/types/common';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Props cho component DanhSachDangKy
 */
interface DanhSachDangKyProps {
  title: string;
  description?: string;
  danhSach: DANGKIHIENMAU_WithRelations[];
  isLoading: boolean;
  onClickXemChiTiet: (dangKy: DANGKIHIENMAU_WithRelations) => void;
}

/**
 * Component hiển thị danh sách đăng ký hiến máu
 */
export function DanhSachDangKy({ 
  title, 
  description, 
  danhSach, 
  isLoading, 
  onClickXemChiTiet 
}: DanhSachDangKyProps) {
  
  /**
   * Render badge trạng thái đăng ký
   */
  const renderTrangThaiDangKy = (trangThai: TrangThaiDangKy) => {
    switch (trangThai) {
      case TrangThaiDangKy.CHO_DUYET:
        return <Badge variant="outline">Chờ duyệt</Badge>;
      case TrangThaiDangKy.DA_DUYET:
        return <Badge variant="success">Đã duyệt</Badge>;
      case TrangThaiDangKy.TU_CHOI:
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
  
  /**
   * Render badge trạng thái hiến máu
   */
  const renderTrangThaiHienMau = (trangThai: TrangThaiHienMau) => {
    switch (trangThai) {
      case TrangThaiHienMau.CHO_HIEN:
        return <Badge variant="outline">Chờ hiến</Badge>;
      case TrangThaiHienMau.DA_HOAN_THANH:
        return <Badge variant="success">Đã hiến</Badge>;
      case TrangThaiHienMau.TU_CHOI:
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
  
  /**
   * Render badge trạng thái sức khỏe
   */
  const renderTrangThaiSucKhoe = (trangThai: TrangThaiSucKhoe) => {
    switch (trangThai) {
      case TrangThaiSucKhoe.CHUA_DANH_GIA:
        return <Badge variant="outline">Chưa đánh giá</Badge>;
      case TrangThaiSucKhoe.DU_DIEU_KIEN:
        return <Badge variant="success">Đủ điều kiện</Badge>;
      case TrangThaiSucKhoe.KHONG_DU_DIEU_KIEN:
        return <Badge variant="destructive">Không đủ điều kiện</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
  
  /**
   * Format ngày giờ
   */
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Không xác định';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Đang tải...</p>
          </div>
        ) : danhSach.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đăng ký</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái đơn</TableHead>
                <TableHead>Trạng thái hiến</TableHead>
                <TableHead>Trạng thái SK</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {danhSach.map((dangKy) => (
                <TableRow key={dangKy.MaDKiHienMau}>
                  <TableCell className="font-medium">{dangKy.MaDKiHienMau}</TableCell>
                  <TableCell>{dangKy.NguoiHienMau?.HoTen || 'Không xác định'}</TableCell>
                  <TableCell>{formatDate(dangKy.NgayDangKi)}</TableCell>
                  <TableCell>{renderTrangThaiDangKy(dangKy.TrangThaiDonDK)}</TableCell>
                  <TableCell>{renderTrangThaiHienMau(dangKy.TrangThaiHienMau)}</TableCell>
                  <TableCell>{renderTrangThaiSucKhoe(dangKy.TTSKKhamSangLoc)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onClickXemChiTiet(dangKy)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DANGKIHIENMAU_WithRelations, TrangThaiDangKy, TrangThaiHienMau } from '@/types';
import { formatDate } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Mail, MapPin, Phone, User2 } from 'lucide-react';
import { RegistrationResponse } from '../types';

interface RegistrationDetailDialogProps {
  registration: RegistrationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: TrangThaiDangKy) => void;
  onBloodDonationStatusChange?: (id: string, status: TrangThaiHienMau) => void;
}

export function RegistrationDetailDialog({
  registration,
  isOpen,
  onClose,
  onStatusChange,
  onBloodDonationStatusChange
}: RegistrationDetailDialogProps) {
  if (!registration) return null;

  const isPending = registration.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết đăng ký hiến máu</DialogTitle>
              <DialogDescription className="text-base">
                Thông tin chi tiết về đăng ký hiến máu của {registration.NGUOIHIENMAU?.HoTen || 'Chưa cập nhật'}
              </DialogDescription>
            </div>
            <Badge 
              variant={registration.TrangThaiDonDK === TrangThaiDangKy.CHO_DUYET ? 'secondary' : 
                registration.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET ? 'success' : 'destructive'}
              className="text-sm px-4 py-1"
            >
              {registration.TrangThaiDonDK}
            </Badge>
          </div>
          <Separator />
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="grid gap-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Họ tên</div>
                    <div className="font-medium">{registration.NGUOIHIENMAU?.HoTen}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </div>
                    <div className="font-medium">{registration.NGUOIHIENMAU?.Email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Số điện thoại
                    </div>
                    <div className="font-medium">{registration.NGUOIHIENMAU?.SDT}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" /> Ngày sinh
                    </div>
                    <div className="font-medium">{formatDate(registration.NGUOIHIENMAU?.NgaySinh)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Giới tính</div>
                    <div className="font-medium">{registration.NGUOIHIENMAU?.GioiTinh ? 'Nam' : 'Nữ'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Địa chỉ
                    </div>
                    <div className="font-medium">{registration.NGUOIHIENMAU?.tenDiaChi}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  Thông tin sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Đã từng hiến máu</div>
                      <div className="font-medium">{registration.DaTungHienMau ? 'Có' : 'Không'}</div>
                    </div>
                    {registration.TienSuBenh && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Tiền sử bệnh</div>
                        <div className="font-medium">{registration.TienSuBenh}</div>
                      </div>
                    )}
                  </div>

                  {registration.MacBenhHienTai && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Bệnh hiện tại</div>
                      <div className="font-medium p-3 bg-muted rounded-lg">{registration.MacBenhHienTai}</div>
                    </div>
                  )}

                  <Separator className="my-2" />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Lịch sử sức khỏe</h4>
                    {registration.ThongTin12ThangQua && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">12 tháng qua</div>
                        <div className="font-medium p-3 bg-muted rounded-lg">{registration.ThongTin12ThangQua}</div>
                      </div>
                    )}
                    {registration.ThongTin6ThangQua && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">6 tháng qua</div>
                        <div className="font-medium p-3 bg-muted rounded-lg">{registration.ThongTin6ThangQua}</div>
                      </div>
                    )}
                    {registration.ThongTin1ThangQua && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">1 tháng qua</div>
                        <div className="font-medium p-3 bg-muted rounded-lg">{registration.ThongTin1ThangQua}</div>
                      </div>
                    )}
                    {registration.ThongTin14NgayQua && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">14 ngày qua</div>
                        <div className="font-medium p-3 bg-muted rounded-lg">{registration.ThongTin14NgayQua}</div>
                      </div>
                    )}
                  </div>

                  {registration.Thuoc7Ngay && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Thuốc đã dùng 7 ngày qua</div>
                      <div className="font-medium p-3 bg-muted rounded-lg">{registration.Thuoc7Ngay}</div>
                    </div>
                  )}

                  {registration.ThongTinPhuNu12ThangQua && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Thông tin phụ nữ 12 tháng qua</div>
                      <div className="font-medium p-3 bg-muted rounded-lg">{registration.ThongTinPhuNu12ThangQua}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {isPending ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    Xác nhận đăng ký
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onStatusChange(registration.MaDKiHienMau, TrangThaiDangKy.DA_DUYET)}
                      disabled={registration.TrangThaiDonDK === TrangThaiDangKy.DA_DUYET}
                      className="flex-1"
                    >
                      Xác nhận đăng ký
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => onStatusChange(registration.MaDKiHienMau, TrangThaiDangKy.TU_CHOI)}
                      disabled={registration.TrangThaiDonDK === TrangThaiDangKy.TU_CHOI}
                      className="flex-1"
                    >
                      Từ chối đăng ký
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    Trạng thái hiến máu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Trạng thái hiện tại:</div>
                      <Badge variant={registration.TrangThaiHienMau === TrangThaiHienMau.DA_HIEN ? 'success' : 
                        registration.TrangThaiHienMau === TrangThaiHienMau.TU_CHOI ? 'destructive' : 'secondary'}>
                        {registration.TrangThaiHienMau || TrangThaiHienMau.CHO_HIEN}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => onBloodDonationStatusChange?.(registration.MaDKiHienMau, TrangThaiHienMau.DA_HIEN)}
                        disabled={registration.TrangThaiHienMau === TrangThaiHienMau.DA_HIEN}
                        className="flex-1"
                      >
                        Đã hiến máu
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => onBloodDonationStatusChange?.(registration.MaDKiHienMau, TrangThaiHienMau.TU_CHOI)}
                        disabled={registration.TrangThaiHienMau === TrangThaiHienMau.TU_CHOI}
                        className="flex-1"
                      >
                        Không đến hiến
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 
"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle } from "lucide-react";
import { DANGKITOCHUCHIENMAU_WithRelations, DANHMUCDVMAU } from "@/types/events";
import { TrangThaiSuKien } from "@/types/common";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

// Schema cho form đăng ký hiến máu
export const donationFormSchema = z.object({
  idSuKienHienMau: z.string().min(1, "Vui lòng chọn sự kiện hiến máu"),
  idDanhMucDVHienMau: z.string().min(1, "Vui lòng chọn đơn vị hiến máu"),
  daTungHienMau: z.boolean(),
  chieuCao: z.number().min(100, "Chiều cao tối thiểu là 100cm").max(250, "Chiều cao tối đa là 250cm").optional(),
  canNang: z.number().min(40, "Cân nặng tối thiểu là 40kg").max(200, "Cân nặng tối đa là 200kg").optional(),
  tienSuBenh: z.string().optional(),
  macBenhHienTai: z.string().optional(),
  thongTin12ThangQua: z.string().optional(),
  thongTin6ThangQua: z.string().optional(),
  thongTin1ThangQua: z.string().optional(),
  thongTin14NgayQua: z.string().optional(),
  thuoc7Ngay: z.string().optional(),
  thongTinPhuNu12ThangQua: z.string().optional(),
  ghiChu: z.string().optional(),
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export interface DonationUnit {
  id: string;
  name: string;
  amount: number;
}

export interface DonationRegistrationFormProps {
  defaultEventId?: string;
  events: DANGKITOCHUCHIENMAU_WithRelations[];
  units: DANHMUCDVMAU[];
  isRegistering: boolean;
  onSubmit: (values: DonationFormValues) => Promise<void>;
  onCancel: () => void;
}

type FormField = keyof DonationFormValues;

export function DonationRegistrationForm({
  defaultEventId,
  events,
  units,
  isRegistering,
  onSubmit,
  onCancel,
}: DonationRegistrationFormProps) {
  // Style cho hiệu ứng highlight lỗi
  const [touchedFields, setTouchedFields] = useState<Record<FormField, boolean>>({} as Record<FormField, boolean>);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const formRefs = useRef<Record<FormField, HTMLDivElement | null>>({} as Record<FormField, HTMLDivElement | null>);
  
  // Tạo form
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      idSuKienHienMau: defaultEventId || "",
      idDanhMucDVHienMau: "DM001",
      daTungHienMau: false,
      chieuCao: 170,
      canNang: 65,
      tienSuBenh: "Không có tiền sử bệnh nào đáng kể",
      macBenhHienTai: "Không mắc bệnh gì hiện tại",
      thongTin12ThangQua: "Sức khỏe ổn định trong 12 tháng qua",
      thongTin6ThangQua: "Không có vấn đề sức khỏe nào trong 6 tháng qua",
      thongTin1ThangQua: "Không có vấn đề sức khỏe nào trong 1 tháng qua",
      thongTin14NgayQua: "Sức khỏe tốt trong 14 ngày qua",
      thuoc7Ngay: "Không sử dụng thuốc gì trong 7 ngày qua",
      thongTinPhuNu12ThangQua: "",
      ghiChu: "",
    },
    mode: "onChange",
  });

  const { formState } = form;
  const { errors } = formState;
  
  // Đánh dấu trường là đã chạm khi mất focus
  const handleBlur = (fieldName: FormField) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
    
    // Kích hoạt xác thực cho trường này
    form.trigger(fieldName);
  };

  // Hàm tiện ích để áp dụng kiểu lỗi cho các trường form
  const applyErrorStyle = (fieldName: FormField) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName] || showAllErrors;
    
    return hasError && isTouched
      ? "border-red-500 focus-visible:ring-red-500 animate-shake"
      : "";
  };
  
  // Hàm xử lý gửi form
  const handleFormSubmit = async (values: DonationFormValues) => {
    // Nếu có lỗi, hiển thị tất cả lỗi và cuộn đến lỗi đầu tiên
    if (Object.keys(errors).length > 0) {
      setShowAllErrors(true);
      
      // Tìm trường đầu tiên có lỗi và cuộn đến đó
      const errorFields = Object.keys(errors) as FormField[];
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];
        const errorRef = formRefs.current[firstErrorField];
        
        if (errorRef) {
          errorRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          toast.error("Vui lòng kiểm tra và điền đầy đủ thông tin", {
            description: `Có lỗi ở trường "${firstErrorField}"`,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          });
        }
      }
      
      return;
    }
    
    // Gửi form
    await onSubmit(values);
  };

  // Lọc sự kiện chỉ bao gồm sự kiện sắp diễn ra hoặc đang diễn ra
  const availableEvents = events.filter(event => 
    event.TrangThaiSuKien === TrangThaiSuKien.SAP_DIEN_RA || 
    event.TrangThaiSuKien === TrangThaiSuKien.DANG_DIEN_RA
  );

  // Hàm trợ giúp để đặt refs mà không trả về giá trị
  const setFormRef = (field: FormField) => (el: HTMLDivElement | null) => {
    formRefs.current[field] = el;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Thông tin đăng ký</CardTitle>
            <CardDescription>Chọn sự kiện và đơn vị hiến máu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="idSuKienHienMau"
              render={({ field }) => (
                <FormItem ref={setFormRef("idSuKienHienMau")}>
                  <FormLabel>Sự kiện hiến máu <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("idSuKienHienMau");
                      handleBlur("idSuKienHienMau");
                    }}
                    defaultValue={field.value}
                    disabled={isRegistering}
                  >
                    <FormControl>
                      <SelectTrigger className={applyErrorStyle("idSuKienHienMau")}>
                        <SelectValue placeholder="Chọn sự kiện hiến máu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableEvents.length === 0 ? (
                        <div className="px-2 py-4 text-center">
                          <p className="text-sm text-muted-foreground">Không có sự kiện nào</p>
                        </div>
                      ) : (
                        availableEvents.map((event) => (
                          <SelectItem key={event.IdSuKien} value={event.IdSuKien}>
                            {event.ThongBao?.TieuDe || `Sự kiện hiến máu ${event.IdSuKien}`} - {event.CoSoTinhNguyen?.TenCoSoTinhNguyen || 'Không xác định'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {(errors.idSuKienHienMau && (touchedFields.idSuKienHienMau || showAllErrors)) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormMessage />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idDanhMucDVHienMau"
              render={({ field }) => (
                <FormItem ref={setFormRef("idDanhMucDVHienMau")}>
                  <FormLabel>Đơn vị hiến máu <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.trigger("idDanhMucDVHienMau");
                      handleBlur("idDanhMucDVHienMau");
                    }}
                    defaultValue={field.value}
                    disabled={isRegistering}
                  >
                    <FormControl>
                      <SelectTrigger className={applyErrorStyle("idDanhMucDVHienMau")}>
                        <SelectValue placeholder="Chọn đơn vị hiến máu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.length === 0 ? (
                        <div className="px-2 py-4 text-center">
                          <p className="text-sm text-muted-foreground">Không có đơn vị hiến máu nào</p>
                        </div>
                      ) : (
                        units.map((unit) => (
                          <SelectItem key={unit.IdDanhMucDVHienMau} value={unit.IdDanhMucDVHienMau}>
                            {unit.SoLuongMau} ml
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {(errors.idDanhMucDVHienMau && (touchedFields.idDanhMucDVHienMau || showAllErrors)) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormMessage />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daTungHienMau"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isRegistering}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đã từng hiến máu trước đây</FormLabel>
                    <FormDescription>
                      Đánh dấu nếu bạn đã từng hiến máu trước đây
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin sức khỏe cơ bản</CardTitle>
            <CardDescription>Nhập thông tin chiều cao, cân nặng của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="chieuCao"
                render={({ field }) => (
                  <FormItem ref={setFormRef("chieuCao")}>
                    <FormLabel>Chiều cao (cm) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập chiều cao (cm)"
                        value={field.value ?? ""}
                        onBlur={() => handleBlur("chieuCao")}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                          // Đối với trường số, xác thực khi thay đổi để cung cấp phản hồi ngay lập tức
                          form.trigger("chieuCao");
                        }}
                        className={applyErrorStyle("chieuCao")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.chieuCao && (touchedFields.chieuCao || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canNang"
                render={({ field }) => (
                  <FormItem ref={setFormRef("canNang")}>
                    <FormLabel>Cân nặng (kg) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập cân nặng (kg)"
                        value={field.value ?? ""}
                        onBlur={() => handleBlur("canNang")}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                          // Đối với trường số, xác thực khi thay đổi để cung cấp phản hồi ngay lập tức
                          form.trigger("canNang");
                        }}
                        className={applyErrorStyle("canNang")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.canNang && (touchedFields.canNang || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin sức khỏe</CardTitle>
            <CardDescription>Cung cấp thông tin về tình trạng sức khỏe của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="tienSuBenh"
                render={({ field }) => (
                  <FormItem ref={setFormRef("tienSuBenh")}>
                    <FormLabel>Tiền sử bệnh <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin về tiền sử bệnh của bạn"
                        {...field}
                        onBlur={() => handleBlur("tienSuBenh")}
                        className={applyErrorStyle("tienSuBenh")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.tienSuBenh && (touchedFields.tienSuBenh || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="macBenhHienTai"
                render={({ field }) => (
                  <FormItem ref={setFormRef("macBenhHienTai")}>
                    <FormLabel>Bệnh hiện tại <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin về bệnh hiện tại của bạn nếu có"
                        {...field}
                        onBlur={() => handleBlur("macBenhHienTai")}
                        className={applyErrorStyle("macBenhHienTai")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.macBenhHienTai && (touchedFields.macBenhHienTai || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <Separator className="my-4" />
              <h3 className="font-medium">Thông tin sức khỏe gần đây</h3>

              <FormField
                control={form.control}
                name="thongTin12ThangQua"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thongTin12ThangQua")}>
                    <FormLabel>Thông tin sức khỏe 12 tháng qua <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin sức khỏe 12 tháng qua"
                        {...field}
                        onBlur={() => handleBlur("thongTin12ThangQua")}
                        className={applyErrorStyle("thongTin12ThangQua")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thongTin12ThangQua && (touchedFields.thongTin12ThangQua || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thongTin6ThangQua"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thongTin6ThangQua")}>
                    <FormLabel>Thông tin sức khỏe 6 tháng qua <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin sức khỏe 6 tháng qua"
                        {...field}
                        onBlur={() => handleBlur("thongTin6ThangQua")}
                        className={applyErrorStyle("thongTin6ThangQua")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thongTin6ThangQua && (touchedFields.thongTin6ThangQua || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thongTin1ThangQua"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thongTin1ThangQua")}>
                    <FormLabel>Thông tin sức khỏe 1 tháng qua <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin sức khỏe 1 tháng qua"
                        {...field}
                        onBlur={() => handleBlur("thongTin1ThangQua")}
                        className={applyErrorStyle("thongTin1ThangQua")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thongTin1ThangQua && (touchedFields.thongTin1ThangQua || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thongTin14NgayQua"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thongTin14NgayQua")}>
                    <FormLabel>Thông tin sức khỏe 14 ngày qua <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin sức khỏe 14 ngày qua"
                        {...field}
                        onBlur={() => handleBlur("thongTin14NgayQua")}
                        className={applyErrorStyle("thongTin14NgayQua")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thongTin14NgayQua && (touchedFields.thongTin14NgayQua || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thuoc7Ngay"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thuoc7Ngay")}>
                    <FormLabel>Thuốc đã dùng 7 ngày qua <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập thông tin về thuốc đã dùng trong 7 ngày qua"
                        {...field}
                        onBlur={() => handleBlur("thuoc7Ngay")}
                        className={applyErrorStyle("thuoc7Ngay")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thuoc7Ngay && (touchedFields.thuoc7Ngay || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thongTinPhuNu12ThangQua"
                render={({ field }) => (
                  <FormItem ref={setFormRef("thongTinPhuNu12ThangQua")}>
                    <FormLabel>Thông tin dành cho phụ nữ (12 tháng qua)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dành cho phụ nữ: thai nghén, sinh đẻ, cho con bú trong 12 tháng qua"
                        {...field}
                        onBlur={() => handleBlur("thongTinPhuNu12ThangQua")}
                        className={applyErrorStyle("thongTinPhuNu12ThangQua")}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <AnimatePresence>
                      {(errors.thongTinPhuNu12ThangQua && (touchedFields.thongTinPhuNu12ThangQua || showAllErrors)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ghiChu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Thông tin khác bạn muốn chia sẻ"
                        {...field}
                        disabled={isRegistering}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isRegistering}
            type="button"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isRegistering}>
            {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký hiến máu
          </Button>
        </div>
      </form>
    </Form>
  );
}

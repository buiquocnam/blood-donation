"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Info, Droplet, Heart, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  useBloodDonationUnits, 
  useDonationEvents, 
  useRegisterDonation 
} from "@/features/donor/hooks";
import { 
  DonationRegistrationForm, 
  DonationFormValues 
} from "@/features/donor/components/DonationRegistrationForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DonationRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const { data: events = [], isLoading: isLoadingEvents } = useDonationEvents();
  const { data: units = [], isLoading: isLoadingUnits } = useBloodDonationUnits();
  const { mutate: register, isPending: isRegistering, isSuccess: success, error: registrationError } = useRegisterDonation();
  
  // Effect khi đăng ký thành công
  useEffect(() => {
    if (success) {
      toast.success("Đăng ký hiến máu thành công!");
      router.push("/donor/history/registrations");
    }
  }, [success, router]);
  
  // Effect khi có lỗi đăng ký
  useEffect(() => {
    if (registrationError) {
      setSubmissionError("Đã xảy ra lỗi khi đăng ký. Vui lòng kiểm tra lại thông tin và thử lại.");
    }
  }, [registrationError]);

  // Xử lý đăng ký khi gửi form
  const handleSubmit = async (values: DonationFormValues) => {
    setSubmissionError(null);
    try {
      await register(values);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setSubmissionError("Đã xảy ra lỗi khi đăng ký. Vui lòng kiểm tra lại thông tin và thử lại.");
    }
  };

  // Xử lý hủy đăng ký
  const handleCancel = () => {
    router.push("/events");
  };

  const isLoading = isLoadingEvents || isLoadingUnits;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2 hover:bg-primary/10">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Đăng ký hiến máu
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-semibold">Hướng dẫn đăng ký hiến máu</AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground">
                Vui lòng cung cấp thông tin chính xác để đảm bảo quá trình hiến máu diễn ra an toàn. 
                Các trường có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc phải điền.
              </AlertDescription>
            </Alert>
          </motion.div>
          
          {submissionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DonationRegistrationForm
                defaultEventId={eventId || undefined}
                events={events}
                units={units}
                isRegistering={isRegistering}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
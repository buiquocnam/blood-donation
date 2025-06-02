'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils";
import { FeedbackDetailDialogProps } from "../types";
import { TrangThaiFeedback } from "../types";
import { useState } from "react";
import { Mail, User2, CalendarClock } from "lucide-react";

export function FeedbackDetailDialog({
  feedback,
  isOpen,
  onClose,
  onStatusChange,
  onReply,
}: FeedbackDetailDialogProps) {
  const [replyContent, setReplyContent] = useState("");

  if (!feedback) return null;

  const handleSubmit = () => {
    if (!replyContent.trim()) return;
    onReply(feedback.MaFeedback, replyContent);
    onStatusChange(feedback.MaFeedback, TrangThaiFeedback.DA_XU_LY);
    setReplyContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Chi tiết phản hồi</DialogTitle>
              <DialogDescription className="text-base">
                Phản hồi từ {feedback.NGUOIDUNG?.HoTen || "Người dùng"}
              </DialogDescription>
            </div>
            <Badge variant={
              feedback.TrangThai === TrangThaiFeedback.DA_XU_LY ? "success" : "secondary"
            }>
              {feedback.TrangThai}
            </Badge>
          </div>
          <Separator />
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User2 className="h-4 w-4" />
                <span>{feedback.NGUOIDUNG?.HoTen}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{feedback.NGUOIDUNG?.Email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>{formatDate(feedback.ThoiGian)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Nội dung phản hồi</h4>
              <div className="rounded-lg bg-muted p-4">
                {feedback.NoiDung}
              </div>
            </div>

            {feedback.TraLoi && (
              <div className="space-y-2">
                <h4 className="font-medium">Phản hồi của nhân viên</h4>
                <div className="rounded-lg bg-muted p-4">
                  {feedback.TraLoi}
                </div>
              </div>
            )}

            {feedback.TrangThai === TrangThaiFeedback.CHO_XU_LY && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Nhập nội dung phản hồi..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onClose}>
                    Hủy
                  </Button>
                  <Button onClick={handleSubmit} disabled={!replyContent.trim()}>
                    Gửi phản hồi
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
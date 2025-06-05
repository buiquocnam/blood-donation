'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrangThaiFeedback } from "../types";
import { FeedbackResponse } from "../types";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarClock, MessageCircle, User2 } from "lucide-react";
import { FeedbackDetailDialog } from "./FeedbackDetailDialog";

interface FeedbackListProps {
  feedbacks: FeedbackResponse[];
  onStatusChange: (id: string, status: TrangThaiFeedback) => void;
  onReply: (id: string, reply: string) => void;
}

export function FeedbackList({
  feedbacks,
  onStatusChange,
  onReply,
}: FeedbackListProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);

  const pendingFeedbacks = feedbacks.filter(
    (feedback) => feedback.TrangThai === TrangThaiFeedback.CHO_XU_LY
  );

  const processedFeedbacks = feedbacks.filter(
    (feedback) => feedback.TrangThai === TrangThaiFeedback.DA_XU_LY
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="h-8 px-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chờ xử lý: {pendingFeedbacks.length}
          </Badge>
          <Badge variant="outline" className="h-8 px-4 flex items-center gap-2">
            <User2 className="h-4 w-4" />
            Đã xử lý: {processedFeedbacks.length}
          </Badge>
        </div>
      </div>

      <Card>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người gửi</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.MaFeedback}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{feedback.NGUOIDUNG?.HoTen}</span>
                      <span className="text-sm text-muted-foreground">
                        {feedback.NGUOIDUNG?.Email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      {feedback.NoiDung}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(feedback.ThoiGian)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      feedback.TrangThai === TrangThaiFeedback.DA_XU_LY ? 'success' : 'secondary'
                    }>
                      {feedback.TrangThai}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      <FeedbackDetailDialog
        feedback={selectedFeedback}
        isOpen={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onStatusChange={onStatusChange}
        onReply={onReply}
      />
    </div>
  );
} 
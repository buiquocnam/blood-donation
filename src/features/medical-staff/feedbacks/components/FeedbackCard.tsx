'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackCardProps } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const FeedbackCard = ({ feedback, onReplySubmit }: FeedbackCardProps) => {
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsReplying(true);
      await onReplySubmit(reply);
      setReply('');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">
            {feedback.DangKyHienMau?.IdNguoiHienMau || 'Người dùng ẩn danh'}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(feedback.NgayPhanHoi), {
              addSuffix: true,
              locale: vi
            })}
          </div>
        </div>
      </CardHeader>
      {/* <CardContent className="space-y-4">
        <p className="text-sm">{feedback.TinhTrangMoTa}</p>
        {feedback.TraLoi && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Phản hồi của nhân viên:</p>
            <p className="mt-1 text-sm">{feedback.TraLoi}</p>
          </div>
        )}
      </CardContent> */}
      {/* {!feedback.TraLoi && (
        <CardFooter className="flex flex-col space-y-4">
          <Textarea
            placeholder="Nhập phản hồi của bạn..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!reply.trim() || isReplying}
            className="w-full"
          >
            {isReplying ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        </CardFooter>
      )} */}
    </Card>
  );
}; 
"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApply } from "@/hooks/use-student";
import { getErrorMessage } from "@/lib/helpers";

const MAX_LENGTH = 5000;

export function ApplyDialog({ job, open, onOpenChange, onApplied }) {
  const [coverLetter, setCoverLetter] = useState("");
  const apply = useApply();

  function submit() {
    apply.mutate(
      { jobId: job.id, coverLetter: coverLetter.trim() },
      {
        onSuccess: () => {
          toast.success("Ứng tuyển thành công! Nhà tuyển dụng sẽ xem hồ sơ của bạn.");
          setCoverLetter("");
          onOpenChange(false);
          onApplied?.();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          // 409: already applied
          if (error?.response?.status === 409) {
            onOpenChange(false);
            onApplied?.();
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !apply.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ứng tuyển: {job.title}</DialogTitle>
          <DialogDescription>
            Hồ sơ của bạn (họ tên, trường, kỹ năng, link CV) sẽ được gửi tới {job.companyName}. Hãy chắc chắn bạn đã
            cập nhật hồ sơ cá nhân.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="cover-letter">Thư giới thiệu (không bắt buộc)</Label>
          <Textarea
            id="cover-letter"
            rows={6}
            maxLength={MAX_LENGTH}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Giới thiệu ngắn về bản thân và lý do bạn phù hợp với vị trí này..."
          />
          <p className="text-right text-xs text-muted-foreground">
            {coverLetter.length}/{MAX_LENGTH}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={apply.isPending} onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={apply.isPending} onClick={submit}>
            {apply.isPending ? <Loader2 className="animate-spin" /> : <Send />}
            Gửi hồ sơ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

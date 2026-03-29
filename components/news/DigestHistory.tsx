"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  history: Array<{ digestDate: string }>;
  currentDate: string;
}

export function DigestHistory({ history, currentDate }: Props) {
  const router = useRouter();

  if (history.length <= 1) return null;

  return (
    <Select value={currentDate} onValueChange={(v) => router.push(`/news?date=${v}`)}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="選擇日期" />
      </SelectTrigger>
      <SelectContent>
        {history.map((h) => (
          <SelectItem key={h.digestDate} value={h.digestDate}>
            {h.digestDate}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

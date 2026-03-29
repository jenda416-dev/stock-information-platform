"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FILTERS = [
  { label: "全部", value: "" },
  { label: "股癌 YouTube", value: "youtube_gooaye" },
];

export function KolFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("slug") ?? "";

  return (
    <Tabs value={current} onValueChange={(v) => router.push(v ? `/kol?slug=${v}` : "/kol")}>
      <TabsList>
        {FILTERS.map((f) => (
          <TabsTrigger key={f.value} value={f.value}>
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

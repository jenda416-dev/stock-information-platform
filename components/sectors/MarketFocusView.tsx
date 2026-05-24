import { SectorCard } from "./SectorCard";
import { adminDb } from "@/lib/firebase/admin";
import type { SectorResearchDoc } from "@/lib/firebase/collections";

export async function MarketFocusView() {
  const snap = await adminDb.collection("sectorResearch").get();

  const sectors: SectorResearchDoc[] = [];
  snap.forEach((doc) => {
    const raw = doc.data() as Record<string, unknown>;
    const updated =
      typeof raw.updated === "string"
        ? raw.updated
        : (raw.updated as { toDate?: () => Date } | undefined)?.toDate?.()?.toISOString?.()?.slice(0, 10) ?? "";
    sectors.push({ ...(raw as unknown as SectorResearchDoc), updated });
  });

  sectors.sort((a, b) => b.updated.localeCompare(a.updated));

  const isOdd = sectors.length % 2 !== 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {sectors.map((research, index) => (
        <SectorCard
          key={research.sectorId}
          research={research}
          isLast={index === sectors.length - 1}
          isOdd={isOdd}
        />
      ))}
    </div>
  );
}

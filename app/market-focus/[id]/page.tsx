import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectorDetailView } from "@/components/sectors/SectorDetailView";
import { adminDb } from "@/lib/firebase/admin";
import type { SectorResearchDoc } from "@/lib/firebase/collections";
import { stripSectorSuffix } from "@/lib/utils";
export async function generateStaticParams() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    const snap = await adminDb.collection("sectorResearch").get();
    return snap.docs.map((doc) => ({ id: doc.id }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

async function fetchResearch(id: string): Promise<SectorResearchDoc | null> {
  const snap = await adminDb.collection("sectorResearch").doc(id).get();
  if (!snap.exists) return null;
  const raw = snap.data() as Record<string, unknown>;
  const updated =
    typeof raw.updated === "string"
      ? raw.updated
      : (raw.updated as { toDate?: () => Date } | undefined)?.toDate?.()?.toISOString?.()?.slice(0, 10) ?? "";
  return { ...(raw as unknown as SectorResearchDoc), updated };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const research = await fetchResearch(id);
  if (!research) return {};
  return {
    title: `${stripSectorSuffix(research.name)} | 產業板塊`,
    description: research.overview?.slice(0, 100) ?? `${stripSectorSuffix(research.name)} 族群成分股清單`,
  };
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const research = await fetchResearch(id);
  if (!research) notFound();

  return <SectorDetailView research={research} />;
}

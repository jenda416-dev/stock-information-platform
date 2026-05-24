import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { SectorResearchDoc, SectorResearchCategory, SectorResearchStock } from "../lib/firebase/collections";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const SECTORS_DIR =
  "/Users/alexchen/Desktop/Coding Chicken/Obsidian/股癌文字摘要/raw/產業板塊";

function parseSectorContent(
  content: string
): Pick<SectorResearchDoc, "overview" | "categories"> {
  const sections = content.split(/(?=\n## )/);

  let overview = "";
  const categories: SectorResearchCategory[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed.startsWith("## ")) continue;

    const nlIdx = trimmed.indexOf("\n");
    const heading = nlIdx === -1 ? trimmed : trimmed.slice(0, nlIdx).trim();
    const body = nlIdx === -1 ? "" : trimmed.slice(nlIdx + 1).trim();

    if (heading === "## 概述") {
      overview = body.replace(/^---\s*$/gm, "").trim();
      continue;
    }

    const catMatch = heading.match(/^## (.+?)｜(.+)$/);
    if (!catMatch) continue;
    const [, tier, name] = catMatch;

    const stockSplit = body.split(/(?=\n### )/);
    const description = stockSplit[0].replace(/^---\s*$/gm, "").trim();
    const stocks: SectorResearchStock[] = [];

    for (let i = 1; i < stockSplit.length; i++) {
      const stockSection = stockSplit[i].trim();
      const snl = stockSection.indexOf("\n");
      const stockHeading =
        snl === -1 ? stockSection : stockSection.slice(0, snl).trim();
      const stockBody = snl === -1 ? "" : stockSection.slice(snl + 1);

      // ### {market} {code}｜{name}｜受惠{benefit}｜{n}星
      const stockMatch = stockHeading.match(
        /^### (.+?) (.+?)｜(.+?)｜受惠(.+?)｜(\d+)星$/
      );
      if (!stockMatch) continue;

      const [, market, code, stockName, benefit, starsStr] = stockMatch;

      const points = stockBody
        .split("\n")
        .filter((l) => /^\d+\. /.test(l.trim()))
        .map((l) => l.trim().replace(/^\d+\. /, ""));

      stocks.push({
        code,
        name: stockName,
        market,
        benefit: benefit as SectorResearchStock["benefit"],
        stars: parseInt(starsStr, 10),
        points,
      });
    }

    categories.push({ tier, name, description, stocks });
  }

  return { overview, categories };
}

async function syncSectorResearch() {
  const files = readdirSync(SECTORS_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("找不到任何 .md 檔案");
    return;
  }

  console.log(`找到 ${files.length} 個族群研究筆記\n`);

  for (const file of files) {
    const raw = readFileSync(join(SECTORS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    const sectorId = data.sector_id as number | undefined;
    if (!sectorId) {
      console.warn(`[skip] ${file}：frontmatter 缺少 sector_id`);
      continue;
    }

    const name = (data.name as string | undefined) ?? file.replace(".md", "");
    const updated =
      (data.updated as string | undefined) ??
      new Date().toISOString().slice(0, 10);

    console.log(`[${name}] sector_id: ${sectorId}`);

    const { overview, categories } = parseSectorContent(content);
    const stockCount = categories.reduce((acc, c) => acc + c.stocks.length, 0);
    console.log(`  → ${categories.length} 個類別，${stockCount} 筆個股資料`);

    const doc: SectorResearchDoc = {
      sectorId,
      name,
      overview,
      updated,
      categories,
    };

    await db.collection("sectorResearch").doc(String(sectorId)).set(doc);
    console.log(`  ✓ 已寫入 Firestore sectorResearch/${sectorId}\n`);
  }

  console.log("Done");
}

syncSectorResearch().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

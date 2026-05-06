import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateSectionCards } from "../lib/ai/summarizeVideo";
import { generateAudioFromText } from "../lib/ai/generateAudio";
import { uploadAudioToStorage } from "../lib/firebase/storage";

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

const GUID = "pP-JU2PCDnU";
const TITLE =
  "派對還沒結束！從被動元件復甦、CPU/ASIC 狂飆到 AI Slop 帶來的軟體洗牌戰";

const SUMMARY = `標題： 派對還沒結束！從被動元件復甦、CPU/ASIC 狂飆到 AI Slop 帶來的軟體洗牌戰

前言
本集主委除了閒聊瘦身與功能性訓練帶來的身心進化，核心直指當前極度狂熱的多頭市場操作策略。透過拆解被動元件的供需失衡、CPU/ASIC 在 AI 浪潮中的資金擴散效應，以及精準點評「AI Slop（AI 垃圾內容）」現象對軟硬體板塊的實質衝擊，為投資人提供了一套「在派對狂歡中保持清醒，但絕不提早離席」的實戰羅盤。

核心重點

[00:09:40] 沉寂已久的被動元件復甦訊號：
別以為 AI 只有 GPU 在爽，被動元件（如 MLCC）受惠於 AI 伺服器的高階需求，供需已經開始吃緊。雖然高階產能多被日韓大廠（村田、三星電機）吃下，但台廠有望迎來傳統消費電子的「訂單排擠效應」，重演類似 2018 年的供需緊俏。出貨交期拉長就是底層資金蠢動、準備漲價的第一把火。

[00:12:15] 推理算力大爆發，CPU 與 ASIC 重返榮耀：
Agentic AI 與推理工作負載（Inferencing Workloads）急遽攀升，結構性推升了 Server CPU 的需求，AMD 與 Intel 的法說皆驗證了這個趨勢。同時，資金大舉湧入 ASIC 族群，如高度綁定 Amazon 的世芯 (3661) 與綁定 Google 的創意 (3443)，顯示市場資金正從單一 GPU 擴散至整個 CSP 大廠定製化晶片的生態系。

[00:19:30] AI Slop 氾濫與純度軟體股的價值重估：
生成式 AI 的普及帶來了大量粗製濫造的「AI 垃圾內容 (AI Slop)」。企業端絕對無法容忍「Garbage in, garbage out」的模糊算力去處理財會或法遵。因此，能精準對接企業數據、降低 AI Slop 風險的軟體巨頭（如 Palantir）價值隨之凸顯。不要輕信「AI 會取代所有軟體」的市場幹話，有實質獲利支撐的軟體廠依然是剛需。

[00:24:35] 硬體並非護身符，議價能力才是本體：
點破市場迷思——不是做硬體就一定穩賺。缺乏採購優勢與定價權的工業電腦 (IPC) 廠，在記憶體與板卡成本雙漲的夾擊下，拿不到料又無法轉嫁成本，極易出現財報暴雷。投資硬體必須看清供應鏈中的話語權，否則只是在賺心酸的代工錢。

[00:27:00] 一軍與二軍的估值輪動與派對哲學：
盤面斜率極陡，但不要去預測高點。當一軍（如聯發科、光通訊）估值預期打滿、股價開始「軟屌」進入橫盤消化時，資金會自動漫溢至位階較低、基本面準備復甦的二軍（如進入上升週期的矽晶圓、產能滿載的成熟製程晶圓代工）。保持彈性，靈活在梯隊間切換才是持盈保泰的正解。

潛在標的盤點
被動元件族群 (如國巨 2327 等)： 高階 MLCC 缺貨帶來的低階產能排擠效應發酵中，交期拉長已成為潛在報價上漲的前置指標。

伺服器 CPU / ASIC 晶片 (AMD、創意 3443、世芯-KY 3661)： AI 推理帶動 CPU 剛需；世芯受惠 AWS Trainium 晶片、創意受惠 Google 專案，皆為 CSP 巨頭自研晶片趨勢下的核心軍火商。

大市值 IC 設計 (聯發科 2454)： 本波超乎預期的猛獸，目前估值已將未來的想像空間充分反映，即將進入高檔震盪的業績驗證期。

企業級軟體 (Palantir、CrowdStrike)： 具備對抗 AI Slop 雜訊、提供精準企業數據決策能力的純軟體廠，用實際財報數字打臉看空論述。

半導體復甦二軍 (環球晶 6488、世界先進 5347)： 環球晶的矽晶圓正處於週期谷底準備復甦；世界先進受惠成熟製程廠房產能高利用率。屬於資金從漲多一軍撤出後的潛在伏兵。

關鍵金句
「我不想在派對結束前就走出去。我寧願等到派對開到一半，警察突襲臨檢，發現旁邊一堆牛鬼蛇神沒帶證件一起被帶回派出所。就算吃到回檔受了傷，我也要一路搭到出長黑 K 再來調整。」

在極端狂熱的多頭行情中，過早預設高點或提早下車只會面臨賣飛的焦慮。不如緊盯產業基本面與財報數據，利用資金在一軍與二軍之間的輪動來保護獲利，捏捏自己的軟蛋，把槓桿控好，然後享受這場泡沫直到舞曲結束的那一刻。`;

async function main() {
  console.log("🔍 找 EP659 文件...");
  const snap = await db
    .collection("kolPosts")
    .where("guid", "==", GUID)
    .limit(1)
    .get();
  if (snap.empty) {
    console.error("找不到 EP659");
    process.exit(1);
  }
  const docRef = snap.docs[0].ref;

  console.log("🃏 生成板塊分析卡片...");
  const cards = await generateSectionCards(SUMMARY, TITLE);
  console.log(`  → 生成 ${cards.length} 張卡片`);
  cards.forEach((c, i) =>
    console.log(`    [${i + 1}] ${c.title} (${c.adviceKeyword})`)
  );

  console.log("🎵 生成 TTS 語音...");
  const audioBuffer = await generateAudioFromText(SUMMARY);
  let audioUrl: string | null = null;
  if (audioBuffer) {
    audioUrl = await uploadAudioToStorage(audioBuffer, GUID);
    console.log("  → 上傳完成:", audioUrl);
  } else {
    console.log("  → TTS 失敗，跳過");
  }

  await docRef.update({
    title: TITLE,
    translatedContent: SUMMARY,
    sectionCards: cards.length ? cards : null,
    audioUrl: audioUrl ?? null,
  });

  console.log("✅ EP659 更新完成！");
}

main().catch(console.error);

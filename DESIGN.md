# Design System

## 色彩系統

使用 OKLch 色彩空間，定義在 `app/globals.css`。

```
Light Mode:
--background:        oklch(1 0 0)               白色
--foreground:        oklch(0.145 0 0)            近黑
--primary:           oklch(0.476 0.185 264)      藍色
--card:              oklch(0.99 0.003 264)        近白
--muted:             oklch(0.96 0.005 264)        淺灰藍
--muted-foreground:  oklch(0.52 0.02 264)        中灰

Dark Mode:
--background:        oklch(0.13 0.018 264)       極深藍
--foreground:        oklch(0.96 0.008 264)        近白
--primary:           oklch(0.623 0.214 259.8)    亮藍
--card:              oklch(0.25 0.02 264)         深藍灰
--muted:             oklch(0.27 0.022 264)        略淺深藍
```

> 個別元件若需要更深的卡片背景（例如需與 tag 形成對比），在該元件加 `dark:bg-[oklch(0.20_0.02_264)]`，不要改全域 `--card`。

### 台股顏色慣例（與歐美相反）

| 狀態 | 文字 | 背景 |
|------|------|------|
| 上漲（多） | `text-red-500 dark:text-red-400` | `bg-red-100 dark:bg-red-900/40` |
| 下跌（空） | `text-emerald-600 dark:text-emerald-400` | `bg-emerald-100 dark:bg-emerald-900/40` |
| 中性 | `text-muted-foreground` | `bg-muted` |

---

## 字體排版

字體：Geist Sans（`--font-geist-sans`），全站 `antialiased`。

| 層級 | Class |
|------|-------|
| 頁面標題 | `text-lg sm:text-xl font-bold leading-snug` |
| Section 標題 | `text-base font-semibold` |
| 卡片子標題 | `text-[15px] font-bold leading-snug` |
| 內文 | `text-[15px] leading-[1.8] text-foreground/80` |
| 次要內文 | `text-sm leading-relaxed text-foreground/80` |
| 標籤 / 時間戳 | `text-xs text-muted-foreground` |
| Monospace（時間軸按鈕） | `text-[11px] font-mono font-semibold` |

---

## 版面寬度規則

- 首頁 / Nav：`max-w-5xl mx-auto px-4`
- 次頁面（`/kol`、`/news`、`/earnings` 等）：`max-w-2xl mx-auto px-4`
- 新增頁面或修改 nav 時需確認寬度一致

---

## 響應式斷點

Mobile-first。使用 `sm:` / `md:` / `lg:`。

- `sm:` (640px)：tablet，次要調整
- `md:` (768px)：desktop，Nav 切換（`hidden md:flex` / `md:hidden`）
- `lg:` (1024px)：大版型，例如側欄 grid `grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]`

---

## 元件樣式規範

### Section 標題

左側 primary 色條：

```tsx
<div className="flex items-center gap-2">
  <div className="w-0.5 h-5 rounded-full bg-primary" aria-hidden="true" />
  <h2 className="text-base font-semibold">標題</h2>
</div>
```

### 卡片

- Hover：`hover:shadow-md transition-all duration-200`，禁止 `-translate-y-*` 或 `shadow-xl`
- 左側色條：`border-l-4`，顏色依漲跌（紅 / 綠 / 預設）
- 頂部 glow line：`h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent`
- 圖片 overlay ring：`ring-1 ring-inset ring-black/10 dark:ring-white/10`

### Tags（關鍵字標籤）

```
inline-flex items-center gap-0.5 text-[12px] font-medium px-2 py-0.5 rounded bg-muted/70 text-muted-foreground
```

`#` 符號加 `opacity-40`。不用 `bg-blue-*` 或 inline style border。

### CTA 按鈕

Solid primary：`bg-primary text-primary-foreground`，不用 outline 或 ghost。

### Badge / 小標籤

```
inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground
```

帶顏色版（漲跌）：`bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400`

### 時間軸按鈕（Markdown 內嵌）

```
inline font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors cursor-pointer
```

### 可展開區塊標題列（SectionCardList）

```
w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left
bg-[#113153] hover:bg-[#17406a] dark:bg-primary/20 dark:hover:bg-primary/30
```

文字用 `text-white`，chevron 加 `transition-transform duration-200` 搭配旋轉。

### Markdown 內文樣式

定義在 `components/kol/MarkdownContent.tsx`：

| 元素 | Class |
|------|-------|
| h2 | `text-[17px] font-bold mt-6 mb-3 first:mt-0` |
| h3 | `text-[15px] font-semibold mt-5 mb-2` |
| p | `text-[15px] leading-[1.8] text-foreground/80 mb-4` |
| blockquote | `rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 px-5 py-4` |
| code | `text-xs font-mono bg-muted px-1.5 py-0.5 rounded` |
| hr | `my-4 border-border/50` |

---

## 互動狀態

- 過渡預設：`transition-all duration-200` 或 `transition-colors`
- 快速過渡：`duration-100`（進度條等）
- Hover 文字連結：`hover:text-primary/80 transition-colors`
- Focus：`focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Disabled：`disabled:opacity-50 disabled:cursor-not-allowed`

---

## Loading / Empty 狀態

- Skeleton：`h-4 w-24 rounded bg-muted animate-pulse`
- 文字 Loading：`py-4 text-center text-sm text-muted-foreground`，訊息「載入中...」
- Empty：`text-center py-16 text-muted-foreground`
- Error：`text-center py-12 text-muted-foreground` + 重新載入連結

---

## Icon 規範

- 不使用 emoji，改用 inline SVG
- 固定尺寸：`w-3 h-3` / `w-4 h-4` / `w-5 h-5`，根據情境選擇
- 裝飾性 icon 加 `aria-hidden="true"`
- 顏色繼承父層：`currentColor`
- Flex 排列時加 `flex-shrink-0`

---

## Dark Mode

- Class-based：`.dark` 加在 `<html>`
- 偵測順序：`localStorage` → `prefers-color-scheme`
- 切換邏輯在 `app/layout.tsx` inline script（避免閃白）
- 禁止在元件內直接讀 `localStorage`

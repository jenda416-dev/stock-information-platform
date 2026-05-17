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

## Spacing Scale

Tailwind v4 spacing scale，1 unit = 4px。

| Token | px | 用途 |
|-------|----|------|
| `0.5` | 2px | 細分隔線、icon 微偏移 |
| `1` | 4px | icon 與文字之間的 gap |
| `1.5` | 6px | inline code padding（`px-1.5`） |
| `2` | 8px | tag / badge padding（`px-2 py-0.5`） |
| `3` | 12px | 次要元素 padding |
| `3.5` | 14px | SectionCardList 按鈕垂直 padding（`py-3.5`） |
| `4` | 16px | **卡片 padding**、container `px-4`（主要單位） |
| `5` | 20px | blockquote padding（`px-5`） |
| `6` | 24px | section 間 flex gap |
| `8` | 32px | 頁面垂直節奏 |
| `12` | 48px | error / empty state 留白（`py-12`） |
| `16` | 64px | 大 empty state（`py-16`） |

**原則**：
- 卡片內 padding 預設 `p-4`，資訊密集版面改 `px-4 py-3`
- section 之間的間距用 `gap-6` 或 `gap-8`，不用 `gap-10` 以上
- inline 元素（tag、badge）padding 固定 `px-2 py-0.5`

---

## 響應式斷點

Mobile-first。使用 `sm:` / `md:` / `lg:`。

- `sm:` (640px)：tablet，次要調整
- `md:` (768px)：desktop，Nav 切換（`hidden md:flex` / `md:hidden`）
- `lg:` (1024px)：大版型，例如側欄 grid `grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]`

---

## Shadow & Elevation Scale

| 層級 | Class | 使用時機 |
|------|-------|---------|
| 無陰影 | — | 靜止卡片（用 border 或 bg 色差製造層次） |
| sm | `shadow-sm` | 輕微浮起、資訊密集型卡片靜止狀態 |
| md | `shadow-md` | **卡片 hover 狀態**（配合 `transition-all duration-200`） |
| lg | `shadow-lg` | Dropdown、Popover、Modal 等浮層元件 |
| xl 以上 | 禁止 | 視覺太重，不符合設計語言 |

Dark mode 下陰影較不明顯，以 `bg-card` 與 `bg-muted` 的色差製造層次，不要加更深的陰影補償。

---

## 元件樣式規範

### Border Radius Scale

| Class | rem / px | 使用場景 |
|-------|----------|---------|
| `rounded` | 0.25rem / 4px | Tag、時間軸按鈕、inline code |
| `rounded-md` | 0.375rem / 6px | Button、Input 等表單元件 |
| `rounded-lg` | 0.5rem / 8px | Card、一般容器 |
| `rounded-xl` | 0.75rem / 12px | Blockquote、特殊強調區塊 |
| `rounded-2xl` | 1rem / 16px | 大型圖片容器、Featured card |
| `rounded-full` | 9999px | Badge、Avatar、色條、進度條 |

同一頁面混用的 radius 種類不超過 3 種。

---

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

| Token | ms | 使用時機 |
|-------|----|---------|
| `duration-150` | 150ms | 按鈕 press（`active:scale-[0.97]`） |
| `duration-200` | 200ms | 一般 hover（顏色、陰影、透明度）— 預設 |
| `duration-300` | 300ms | 展開／收合動畫（`grid-rows`、`opacity`） |

- Easing 統一用 Tailwind 預設（`ease-in-out`），展開動畫才明確加
- 禁止 `hover:-translate-y-*`，改用 `hover:shadow-md` 表現懸浮感
- Property utility：`transition-colors`（單一色屬性）/ `transition-all`（同時跑多屬性）/ `transition-transform`（縮放、位移）
- Hover 文字連結：`hover:text-primary/80 transition-colors`
- Focus：`focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Disabled：`disabled:opacity-50 disabled:cursor-not-allowed`

### Component States 對照表

| 元件 | 預設 | Hover | Focus | Active | Disabled |
|------|------|-------|-------|--------|---------|
| CTA Button | `bg-primary text-primary-foreground` | `opacity-90` | `focus-visible:ring-[3px]` | `opacity-80` | `opacity-50 cursor-not-allowed` |
| Ghost / Link | `text-foreground/80` | `text-primary/80` | `focus-visible:ring-[3px]` | `text-primary` | `opacity-50 cursor-not-allowed` |
| Card | `shadow-none` | `shadow-md` | — | — | — |
| Input | `border-border` | `border-border` | `border-ring ring-[3px] ring-ring/50` | — | `opacity-50 cursor-not-allowed` |

---

## 表單元件

### 共用基礎 class

```
rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground
placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50
transition-shadow duration-150
disabled:opacity-50 disabled:cursor-not-allowed
```

### 狀態變化

| 狀態 | 差異 |
|------|------|
| 預設 | 基礎 class |
| 錯誤 | `border-destructive` + focus: `ring-destructive/40` |
| 停用 | `disabled:opacity-50 disabled:cursor-not-allowed` |

### Select

加 `appearance-none pr-8 cursor-pointer`，搭配絕對定位的 ChevronIcon（`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground`）。

### Textarea

加 `resize-y min-h-[96px]`。

### Label

`text-sm font-medium`，加 `htmlFor` 對應 input `id`（可及性）。錯誤訊息放 input 下方，用 `text-xs text-destructive`。

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

---

## Do's & Don'ts

收集各 section 散落的禁止事項，集中參考。

### 禁止（Don't）

| 類別 | 禁止行為 | 原因 |
|------|---------|------|
| 動畫 | `hover:-translate-y-*` | 浮起感太強，不符設計語言 |
| 陰影 | `shadow-xl` 或更大 | 視覺過重 |
| 色彩 | tag 用 `bg-blue-*` 或 inline style border | 破壞色彩系統一致性 |
| 按鈕 | CTA 用 outline 或 ghost variant | 主要行動按鈕需 solid primary |
| 色彩 token | 直接改全域 `--card` | 應在元件層加 `dark:bg-[...]` 覆蓋 |
| Dark mode | 在元件內直接讀 `localStorage` | 應由 layout.tsx 的 inline script 處理 |
| Icon | 使用 emoji | 改用 inline SVG，確保跨平台一致 |

### 推薦（Do）

| 類別 | 推薦做法 |
|------|---------|
| 卡片 hover | `hover:shadow-md transition-all duration-200` |
| 色彩調整 | 在元件加 `dark:bg-[oklch(...)]`，不動全域 token |
| 裝飾性 icon | 加 `aria-hidden="true"` |
| 台股漲跌色 | 紅色（多）/ 綠色（空），參考色彩系統表格 |
| 版面寬度 | 次頁面統一 `max-w-2xl`，首頁 `max-w-5xl` |

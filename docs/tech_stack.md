# 技術スタック選定 - Utagaki

## フロントエンド

- **Framework**: **Next.js (App Router)**
  - SPA としてサクサク動く操作感を実現。
  - SEO よりもアプリライクな挙動（PWA 化視野）を重視。
- **Language**: TypeScript
- **Styling**: **Tailwind CSS**
  - 和風カラーのカスタム設定 (`tailwind.config.js`)。
  - 縦書き対応 (`writing-mode`) のユーティリティ活用。
- **State Management**: React Context / Hooks (必要に応じて Zustand 等)
- **Font**: Google Fonts (Noto Serif JP, Shippori Mincho, Yuji Syuku)

## バックエンド / インフラ

- **BaaS (Backend as a Service)**: **Supabase** (または Firebase)
  - **Supabase**推奨理由:
    - PostgreSQL ベースでリレーショナルデータ（ユーザー、投稿、返信、マッチング）の管理がしやすい。
    - Auth (LINE/Google/Email) 対応。
    - Realtime 機能でチャット実装が可能。
    - Storage で画像（プロフィール、身分証）管理が可能。
- **Hosting**: **Vercel**
  - Next.js との親和性、デプロイの容易さ。

## 開発ツール・ライブラリ案

- **UI Components**:
  - `framer-motion`: 「御簾が上がる」「川が流れる」などのアニメーション実装用。
  - `shadcn/ui` (Radix UI): ベースコンポーネントとして使用し、スタイルを和風にオーバーライド。
- **Icon**:
  - Lucide React (標準的だが、和風アイコンは別途 SVG アセットが必要になる可能性あり)。
- **Date Handling**:
  - `date-fns`: 24 時間制限などの時刻管理。

## データモデル概略 (Supabase 想定)

- `users`: ユーザー情報 (id, nickname, avatar_type, photo_url(private), is_verified, etc.)
- `verses`: 上の句 (id, user_id, content, theme, expires_at)
- `replies`: 下の句 (id, verse_id, user_id, content)
- `matches`: マッチング成立 (id, verse_id, reply_id, woman_id, man_id, created_at)
- `messages`: チャット (id, match_id, sender_id, content, created_at)

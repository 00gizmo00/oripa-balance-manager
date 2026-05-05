# オリパ収支管理 MVP

Next.js + Supabase + TypeScript + Tailwind CSS で作成した、個人用のポケカ・オリパ収支管理アプリです。

このアプリでは、カードごとの原価は管理しません。  
原価として扱うのは `spend_logs` に登録した「オリパアプリごとの課金ログ合計」のみです。

## この MVP でできること

- ダッシュボードで以下を確認
  - 総課金額
  - 売却総額 `売却価格 - 手数料 - 送料`
  - 所持カード相場合計
  - 総合収支 `売却総額 + 所持カード相場合計 - 総課金額`
  - オリパアプリ別課金額
- オリパアプリ CRUD
- 課金ログ CRUD
- カード CRUD
- 売却履歴登録
- 店舗価格メモ登録
- カード検索
- 所持中 / 売却済フィルター
- スマホではカード型 UI
- PC ではテーブル UI
- 画像未登録時のプレースホルダー表示

## 重要な前提

- ログイン機能は未実装です
- `SUPABASE_SERVICE_ROLE_KEY` は使いません
- Vercel / ローカルともに使う環境変数は以下の 2 つだけです
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase RLS は MVP では有効化しません
- 自動相場取得と OCR は未実装です
- `.env.local` 未設定でも画面は落ちません
  - その場合は Supabase 未接続バナーが表示され、CRUD は動きません

## 技術構成

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- shadcn/ui 風コンポーネント構成
- lucide-react
- date-fns

## ローカルセットアップ手順

### 1. 依存関係をインストール

```bash
npm install
```

### 2. `.env.local` を用意

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Windows PowerShell の場合:

```powershell
Copy-Item .env.example .env.local
```

そのあと `.env.local` を開いて、上の 2 つを自分の Supabase プロジェクトの値に置き換えてください。

補足:

- `NEXT_PUBLIC_SUPABASE_URL`
  - Supabase ダッシュボードの `Project Settings` → `Data API` で確認できます
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - 同じ画面の `Project API keys` にある `anon public` キーです
- `SUPABASE_SERVICE_ROLE_KEY`
  - この MVP では不要です。設定しないでください

### 3. Supabase に SQL を実行

このアプリは、`supabase/migrations/20260501_000001_init.sql` の内容を Supabase 側に適用すると動きます。

初心者向けの手順:

1. [Supabase](https://supabase.com/) にログイン
2. プロジェクトを作成する
3. 左メニューの `SQL Editor` を開く
4. `New query` を押す
5. このリポジトリの以下のファイルを開く

```text
supabase/migrations/20260501_000001_init.sql
```

6. ファイルの中身をすべてコピーして、Supabase の SQL Editor に貼り付ける
7. `Run` を押す
8. エラーが出なければ完了

この SQL で実行される内容:

- 必要テーブル作成
- `updated_at` 自動更新トリガー作成
- 基本インデックス作成
- RLS は設定しない

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

## 初回起動後に確認する操作手順

Supabase 接続後、以下の順で確認するとスムーズです。

### 1. ダッシュボードが表示されるか確認

- `http://localhost:3000` を開く
- エラー画面ではなく、ダッシュボードが表示されることを確認

### 2. オリパアプリを登録

- 左メニューの `アプリ管理` を開く
- 例: `DOPA!`, `日本トレカセンター` などを 1 件登録

### 3. 課金ログを登録

- 左メニューの `課金ログ` を開く
- 先ほど作ったアプリを選ぶ
- 金額、日付、必要ならメモを登録

### 4. カードを登録

- 左メニューの `カード管理` を開く
- カード名、枚数、現在相場、状態を登録
- 画像 URL が空でも保存でき、プレースホルダーが表示されることを確認

### 5. ダッシュボードの集計確認

- `ダッシュボード` に戻る
- 総課金額に課金ログが反映されていることを確認
- 所持カード相場合計にカードの `現在相場 × 枚数` が反映されていることを確認

### 6. 売却履歴を登録

- `カード管理` から任意のカードの `詳細` を開く
- `売却を登録` に金額、手数料、送料を入力して保存
- ダッシュボードの売却総額が `売却価格 - 手数料 - 送料` で更新されることを確認

### 7. 店舗価格メモを登録

- 同じカード詳細ページで `店舗価格メモを追加`
- 店舗名、買取価格、販売価格、日付を登録

### 8. 検索とフィルター確認

- `カード管理` でカード名検索を試す
- `所持中` / `売却済` フィルターを切り替える

## Vercel デプロイ手順

このプロジェクトは Vercel にデプロイできる構成です。  
本番でも使う環境変数は次の 2 つだけです。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1. GitHub に push する

まだ GitHub に上げていない場合は、まずリポジトリを作成して push します。

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPOSITORY.git
git push -u origin main
```

すでに Git リポジトリがある場合は、通常どおり以下で大丈夫です。

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

注意:

- `.env.local` はコミットしないでください
- このプロジェクトでは `.gitignore` に `.env.local` を含めています

### 2. Vercel で Import Project する

1. [Vercel](https://vercel.com/) にログイン
2. ダッシュボードで `Add New...` → `Project` を開く
3. `Import Git Repository` で GitHub アカウントを連携する
4. このリポジトリを選んで `Import` を押す
5. Framework Preset が `Next.js` になっていることを確認
6. Build Command / Output Directory は基本的に自動検出のままでよい
7. `Environment Variables` を設定する
8. `Deploy` を押す

### 3. Vercel の Environment Variables に入れる値

Vercel の Project Settings または初回 Import 画面で、以下の 2 つを登録します。

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

入れる値は `.env.local` と同じです。

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

おすすめ設定:

- `Production`
  - 設定する
- `Preview`
  - 設定する
- `Development`
  - 必要なら設定する

補足:

- 環境変数を変更しただけでは過去のデプロイには反映されません
- 値を変更したら Vercel で再デプロイしてください

### 4. デプロイ後に確認する操作手順

1. Vercel が発行した URL を開く
2. ダッシュボードが表示されることを確認
3. `アプリ管理` でオリパアプリを 1 件登録
4. `課金ログ` で課金を 1 件登録
5. `カード管理` でカードを 1 件登録
6. ダッシュボードの数値が更新されることを確認
7. カード詳細で売却履歴と店舗価格メモが登録できることを確認

### 5. スマホで開く方法

- デプロイ後に発行された Vercel の URL をスマホのブラウザで開く
- iPhone / Android どちらでも、通常のブラウザでアクセスできます
- 必要ならホーム画面にブックマーク追加して使ってください

### 6. エラー時に確認する場所

Vercel で問題が起きたときは、次を確認してください。

- Build 時に失敗した場合
  - Vercel プロジェクトの `Deployments` から対象デプロイを開く
  - `Build Logs` を確認する
- デプロイは成功したが画面でエラーになる場合
  - Vercel プロジェクトの `Logs` を確認する
- Supabase 接続が怪しい場合
  - `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` の値が正しいか確認
  - Supabase で SQL を実行済みか確認
  - RLS を有効にしていないか確認

## 本番運用時の注意点

- この MVP はログインなしで動かします
- RLS も有効化していないため、本番 URL を知っている人はデータにアクセスできる前提です
- 個人用・限定公開前提で使うか、公開範囲には注意してください
- 将来的に本格運用するなら、Auth と RLS の導入が必要です

## Vercel / 本番向けの設定メモ

- `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` だけで接続する構成です
- `SUPABASE_SERVICE_ROLE_KEY` は不要です
- `.env.local` はローカル専用で、Vercel にはコミットではなくダッシュボードから設定します
- OneDrive 対策の `.next-app` 出力は、ローカル Windows の `next dev` のときだけ有効です
- Vercel 上の本番ビルドでは標準の `.next` を使うため、OneDrive 対策が本番に悪影響を出さない構成にしています

## ページ構成

- `/`
  - ダッシュボード
- `/oripa-apps`
  - オリパアプリ管理
- `/spend-logs`
  - 課金ログ管理
- `/cards`
  - カード一覧、検索、登録、編集
- `/cards/[id]`
  - カード詳細、売却履歴、店舗価格メモ

## ディレクトリ概要

- `app/`
  - App Router のページ
- `components/`
  - UI、フォーム、一覧、ダッシュボード
- `lib/supabase/`
  - Supabase client、型、repository
- `supabase/migrations/`
  - 初期 SQL

## 動作確認済みコマンド

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

補足:

- OneDrive 配下のローカル Windows 環境では `next dev` の出力ファイルがロックされることがあるため、開発時だけ `.next-app` を使うようにしています
- Vercel 本番ビルドでは標準の `.next` を使います

## 今後の拡張候補

- Supabase Auth + RLS
- 自動相場取得
- OCR でカード登録補助
- CSV エクスポート
- 集計期間フィルター
## 2026-05 Additional Notes

- `cards.sold_at` was added to keep the date when a card became sold.
- For an existing Supabase project, run `supabase/migrations/20260505_000002_add_sold_at_to_cards.sql` in the SQL Editor.
- The dashboard now includes per-app profit analysis.
- The dashboard header now has a backup button that downloads the current data as JSON.

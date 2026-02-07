# backlog-cli

Backlog API を操作する CLI ツール。gh CLI のインターフェースを参考に設計。

## プロジェクト構成

- `packages/cli` — CLI 本体（citty ベース）
- `packages/api` — Backlog API クライアント
- `packages/config` — 設定管理（rc9 + arktype）
- `packages/tsconfigs` — 共有 TypeScript 設定
- `docs` — ドキュメントサイト（Astro + Starlight）

## 技術スタック

- ランタイム: Bun
- 言語: TypeScript
- CLI フレームワーク: citty
- 型バリデーション: arktype
- コード品質: Biome
- タスク実行: Turbo
- Git フック: Lefthook

## 開発ルール

- `bun install` で依存インストール
- `bun run dev` で開発モード
- `bun run build` でビルド
- `turbo type-checks` で型チェック
- Conventional Commits 形式でコミットメッセージを書く
- JSDoc は `.github/instructions/jsdoc.instructions.md` に従う
- Bun の利用は `.github/instructions/bun.instructions.md` に従う

## PLAN.md の運用

**PLAN.md はこのプロジェクトの実装計画書であり、常に最新の状態を保つこと。**

- 機能を実装したら、該当コマンドの「状態」を `未着手` → `実装中` → `完了` に更新する
- 新しいコマンドや引数を追加・変更した場合は PLAN.md にも反映する
- Phase の進捗サマリーテーブルも合わせて更新する
- 設計方針の変更があった場合は「設計原則」セクションを更新する
- PLAN.md と実装が乖離しないよう、対応のたびに確認・更新を行う

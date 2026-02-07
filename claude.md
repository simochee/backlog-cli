# backlog-cli

Backlog API を操作する CLI ツール。gh CLI のインターフェースを参考に設計。

## プロジェクト構成

Turborepo ベースのモノレポ。ライブラリは unjs エコシステムを優先して選定。

- `packages/cli` — CLI 本体（citty ベース、コマンドは遅延読み込み）
- `packages/api` — Backlog API クライアント（ofetch + ufo）
- `packages/config` — 設定管理（rc9 + arktype）
- `packages/tsconfigs` — 共有 TypeScript 設定
- `docs` — ドキュメントサイト（Astro + Starlight）

## 技術スタック

- ランタイム: Bun
- 言語: TypeScript
- CLI フレームワーク: citty (unjs)
- HTTP クライアント: ofetch (unjs)
- URL ユーティリティ: ufo (unjs)
- 設定ファイル: rc9 (unjs)
- ロギング: consola (unjs)
- 型バリデーション: arktype
- テスト: Vitest
- コード品質: Biome
- タスク実行: Turbo
- Git フック: Lefthook

## CLI コマンド構造

コマンドは `packages/cli/src/commands/` 以下にドメインごとのディレクトリで管理する。
各コマンドグループは `index.ts` でサブコマンドを遅延読み込み（`() => import(...)`）で登録する。

```
src/commands/
  auth/       — 認証管理（login, logout, status, token）
  config/     — CLI 設定（get, set, list）
  issue/      — 課題管理（list, view, create, edit, close, reopen, comment, status）
  project/    — プロジェクト管理（list, view, activities）
  api.ts      — 汎用 API リクエスト
```

新しいコマンドを追加する手順:
1. `commands/<group>/` にコマンドファイルを作成（`defineCommand` を使用）
2. グループの `index.ts` の `subCommands` に遅延 import を追加
3. 新しいグループの場合は `src/index.ts` にも追加

## API クライアント

`@repo/api` は `createClient()` で認証済み ofetch インスタンスを生成する。
API Key（クエリパラメータ）と OAuth 2.0（Bearer トークン）の両方に対応。

## 設定管理

`@repo/config` は `~/.backlogrc` ファイルでスペース情報と認証情報を管理する。
認証方式は `api-key` と `oauth` の判別型ユニオンで定義。

スペース解決の優先順位:
1. `--space` フラグ
2. `BACKLOG_SPACE` 環境変数
3. 設定ファイルの `defaultSpace`

## 開発ルール

- `bun install` で依存インストール
- `bun run dev` で開発モード
- `bun run build` でビルド
- `bun run type-check` で型チェック
- `bun run lint` でリント
- `bun run test` でテスト
- Conventional Commits 形式でコミットメッセージを書く
- JSDoc は `.github/instructions/jsdoc.instructions.md` に従う
- Bun の利用は `.github/instructions/bun.instructions.md` に従う

## テスト

Vitest を使用した単体テスト。Turborepo の `test` タスクで全パッケージを一括実行する。

```sh
bun run test                            # 全パッケージ
bun run test --filter=@repo/config      # 特定パッケージ
```

### テスト対象と優先度

| 優先度 | パッケージ | 対象モジュール | テスト観点 |
|---|---|---|---|
| 高 | `packages/config` | `types.ts` | arktype スキーマのバリデーション（有効/無効入力） |
| 高 | `packages/config` | `space.ts` | スペース管理ロジック（追加・削除・更新・解決） |
| 高 | `packages/config` | `config.ts` | 設定ファイル読み書きのバリデーション分岐 |
| 中 | `packages/api` | `client.ts` | 認証方式による ofetch 設定の検証 |
| 中 | `packages/cli` | `commands/config/get.ts` | `getNestedValue` のドット記法アクセス |
| 中 | `packages/cli` | `commands/config/set.ts` | `resolveKey` のエイリアス解決 |

### テストファイルの配置

ソースファイルと同ディレクトリにコロケーション方式で配置: `{source}.test.ts`

### テストの規約

- `describe` は関数名またはモジュール名
- `it` は日本語で期待する振る舞いを記述
- 副作用（ファイル I/O、環境変数）は `vi.mock` でモック化
- 詳細は `.github/instructions/testing.instructions.md` を参照

## PLAN.md の運用

**PLAN.md はこのプロジェクトの実装計画書であり、常に最新の状態を保つこと。**

- 機能を実装したら、該当コマンドの「状態」を `未着手` → `実装中` → `完了` に更新する
- 新しいコマンドや引数を追加・変更した場合は PLAN.md にも反映する
- Phase の進捗サマリーテーブルも合わせて更新する
- 設計方針の変更があった場合は「設計原則」セクションを更新する
- PLAN.md と実装が乖離しないよう、対応のたびに確認・更新を行う

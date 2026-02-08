# プロジェクトステータス

## 実装完了状況

**Phase 1〜4 の全 99 コマンド + `issue delete` の実装が完了**

- 認証管理（auth）
- 課題管理（issue）— delete 含む
- プルリクエスト管理（pr）
- プロジェクト管理（project）
- Git リポジトリ（repo）
- Wiki 管理（wiki）
- 通知管理（notification）
- ユーザー管理（user）
- チーム管理（team）
- スペース管理（space）
- カテゴリ管理（category）
- マイルストーン管理（milestone）
- 課題種別管理（issue-type）
- ステータス管理（status-type）
- Webhook 管理（webhook）
- スター（star）
- ウォッチ（watching）
- エイリアス（alias）
- ユーティリティコマンド（api, browse, completion, status）
- 設定管理（config）

## 未実装コマンド

詳細は [unimplemented-commands.md](./unimplemented-commands.md) を参照。

現在、以下の 6 コマンドを実装スコープ外としている：

- `issue comments` — `issue view --comments` で代替可能
- `issue count` — `issue list` で件数確認可能
- `issue attachments` — ファイル I/O が絡み実装が複雑
- `issue participants` — `issue view` で参加者情報確認可能
- `pr count` — `pr list` で件数確認可能
- `pr attachments` — ファイル I/O が絡み実装が複雑

## 関連ドキュメント

| ファイル                          | 内容                                             |
| --------------------------------- | ------------------------------------------------ |
| `../CLAUDE.md`                    | 開発ガイドライン・設計原則・テストルール         |
| `command-specifications.md`       | 全コマンドの引数・オプション・API マッピング詳細 |
| `command-overview.md`             | コマンドツリーと設計方針                         |
| `gh-backlog-mapping.md`           | gh CLI → backlog CLI のマッピング                |
| `backlog-api-reference.md`        | Backlog API エンドポイントリファレンス           |
| `agent-skills.md`                 | Agent Skills の設計構想                          |
| `unimplemented-commands.md`       | 未実装コマンドの検討記録                         |

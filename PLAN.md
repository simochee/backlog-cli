# backlog-cli 実装計画

> gh CLI のインターフェースを基準に、Backlog API を操作する CLI ツール。
>
> Phase 1〜4 の全コマンド実装が完了。詳細な仕様は `plans/` 配下を参照。

---

## 完了済み

| Phase    | 対象                                                                                     | サブコマンド数 | 状態 |
| -------- | ---------------------------------------------------------------------------------------- | -------------- | ---- |
| Phase 1  | MVP（auth, config, issue, project, api）                                                 | 19             | 完了 |
| Phase 2  | 開発者向け（pr, repo, notification, status, browse）                                     | 19             | 完了 |
| Phase 3  | 管理機能（wiki, user, team, category, milestone, issue-type, status-type, project 拡張） | 38             | 完了 |
| Phase 4  | 拡張機能（space, webhook, star, watching, alias, auth 拡張, completion）                 | 23             | 完了 |
| **合計** |                                                                                          | **99**         |      |

---

## 未実装（バックログ）

`plans/command-overview.md` に構想として記載されているが、実装スコープ外としたコマンド:

| コマンド             | 対応 API                                        | 備考                |
| -------------------- | ----------------------------------------------- | ------------------- |
| `issue delete`       | `DELETE /api/v2/issues/:issueIdOrKey`           | 課題の削除          |
| `issue comments`     | `GET /api/v2/issues/:issueIdOrKey/comments`     | コメント一覧表示    |
| `issue count`        | `GET /api/v2/issues/count`                      | 課題件数取得        |
| `issue attachments`  | `GET /api/v2/issues/:issueIdOrKey/attachments`  | 添付ファイル一覧    |
| `issue participants` | `GET /api/v2/issues/:issueIdOrKey/participants` | 参加者一覧          |
| `pr count`           | `GET .../pullRequests/count`                    | PR 件数取得         |
| `pr attachments`     | `GET .../pullRequests/:number/attachments`      | PR 添付ファイル一覧 |

---

## 関連ドキュメント

| ファイル                          | 内容                                             |
| --------------------------------- | ------------------------------------------------ |
| `claude.md`                       | 開発ガイドライン・設計原則・テストルール         |
| `plans/command-specifications.md` | 全コマンドの引数・オプション・API マッピング詳細 |
| `plans/command-overview.md`       | コマンドツリーと実装優先度                       |
| `plans/gh-backlog-mapping.md`     | gh CLI → backlog CLI のマッピング                |
| `plans/backlog-api-reference.md`  | Backlog API エンドポイントリファレンス           |

---

## TypeSpec パッケージリファクタリング

`@repo/backlog-api-typespec` → `@repo/api-spec` にリネームし、TypeSpec ベストプラクティスに沿ってディレクトリ構造を整理。

### 新ディレクトリ構造

```
packages/api-spec/
├── .gitignore
├── package.json                 # name: "@repo/api-spec"
├── tspconfig.yaml
├── main.tsp                     # エントリポイント（ルート固定、TypeSpec の制約）
│
├── models/
│   └── common.tsp               # 共有モデル/enum（エラー、ページネーション、IdName、Star 等）
│
├── issues/
│   ├── main.tsp                 # barrel import
│   ├── issues.tsp               # Issue CRUD (6 ops)
│   ├── comments.tsp             # Issue コメント (7 ops)
│   └── attachments.tsp          # Issue 添付/参加者/共有ファイル (8 ops)
│
├── projects/
│   ├── main.tsp                 # barrel import
│   ├── projects.tsp             # Project CRUD + メンバー + 管理者 (13 ops)
│   └── settings.tsp             # ステータス/課題種別/カテゴリ/バージョン/カスタムフィールド/共有ファイル (26 ops)
│
├── wiki/
│   ├── main.tsp                 # barrel import
│   ├── wikis.tsp                # Wiki CRUD (8 ops)
│   └── attachments.tsp          # Wiki 添付/共有ファイル (7 ops)
│
├── git/
│   ├── main.tsp                 # barrel import
│   └── git.tsp                  # リポジトリ/PR/PRコメント/PR添付 (12 ops)
│
├── space.tsp                    # Space 関連 (7 ops)
├── users.tsp                    # User 関連 (10 ops)
├── teams.tsp                    # Team 関連 (11 ops)
├── notifications.tsp            # 通知 (4 ops)
├── watching.tsp                 # ウォッチ (6 ops)
├── webhooks.tsp                 # Webhook (5 ops)
├── stars.tsp                    # スター (1 op)
└── misc.tsp                     # 優先度/完了理由/最近の閲覧/ライセンス/レート制限 (6 ops)
```

### 設計判断

- 複数ファイルが同じルートプレフィックスを共有するグループ（issues, projects, wiki）はディレクトリ化
- git/ は現在1ファイルだが最大（286行、4 interface）で将来分割の余地あり
- 単独ドメイン（space, users, teams 等）は1ファイルのためルートに配置
- models/common.tsp はオペレーションを持たない共有型定義なので models/ で役割を明示
- ディレクトリは `import "./issues"` で `issues/main.tsp` を自動ロード（TypeSpec 規約）

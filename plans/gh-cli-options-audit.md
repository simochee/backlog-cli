# gh CLI オプション監査レポート

> `gh` CLI の各コマンドオプションと `backlog` CLI の実装を比較し、不足・名称変更・追加のオプションをまとめる。
>
> 調査日: 2026-02-09
> 対象: gh CLI (cli.github.com/manual) vs backlog-cli (packages/cli/src/commands/)

---

## 凡例

| 記号 | 意味 |
| --- | --- |
| **共通** | gh CLI と backlog CLI の両方に存在するオプション |
| **名称変更** | 同等の機能だが、フラグ名やエイリアスが異なるもの |
| **gh のみ** | gh CLI にあるが backlog CLI に存在しないオプション |
| **backlog のみ** | backlog CLI 固有のオプション（Backlog API の要件に基づく追加） |
| **N/A** | Backlog に該当概念がなく、対応不要 |
| **検討** | 採用を検討すべきオプション |

---

## 全体的な差異パターン

### 1. gh CLI にあって backlog CLI に体系的に不足しているもの

| パターン | gh CLI | backlog CLI | 備考 |
| --- | --- | --- | --- |
| jq フィルタ | `--jq` / `-q` | なし | JSON 出力のフィルタリング。`--json` はあるが `--jq` がない |
| Go テンプレート | `--template` / `-t` | なし | 出力フォーマットのカスタマイズ。Go 固有のため不要だが、代替手段の検討余地あり |
| ファイルからの本文読み込み | `--body-file` / `-F` | なし（`"-"` で stdin 対応のみ） | `--body-file` は別ファイルからの読み込み。`"-"` 以外のファイルパス指定ができない |
| エディタ起動 | `--editor` / `-e` | なし | テキストエディタを開いて本文を入力 |
| ブラウザ URL 表示のみ | `--no-browser` / `-n` | なし | URL を表示するだけでブラウザを開かない |
| リポジトリ選択（継承） | `--repo` / `-R` | なし（`--space` でスペース選択のみ） | gh は全コマンドに `--repo` を継承。backlog は `--project`+`--repo` で個別対応 |

### 2. backlog CLI 固有の体系的パターン

| パターン | backlog CLI | 備考 |
| --- | --- | --- |
| スペース選択 | `--space` / `-s`（グローバル） | gh の `--hostname` / `-h` に相当 |
| プロジェクト選択 | `--project` / `-p`（コマンドローカル） | Backlog の階層構造に基づく |
| リポジトリ選択 | `--repo` / `-R`（PR コマンド） | Backlog ではプロジェクト内にリポジトリが複数存在 |
| 確認スキップ | `--confirm`（delete 系）/ `--yes` / `-y` | gh は `--yes` で統一、backlog は `--confirm` と `--yes` が混在 |
| ページネーション | `--offset` | gh はカーソルベース、backlog はオフセットベース |

---

## コマンド別詳細比較

### auth login

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--with-token` | `--with-token` | 共通 | |
| `--web` / `-w` | — | N/A | backlog は `--method` で認証方式を選択するため不要 |
| `--git-protocol` / `-p` | — | N/A | Backlog Git は別途認証 |
| `--scopes` / `-s` | — | N/A | Backlog OAuth にスコープ概念なし |
| `--clipboard` / `-c` | — | N/A | デバイスフロー不使用 |
| `--insecure-storage` | — | N/A | backlog は常にファイル保存 |
| `--skip-ssh-key` | — | N/A | SSH キー管理は対象外 |
| — | `--method` / `-m` | backlog のみ | `api-key` / `oauth` の選択 |
| — | `--client-id` | backlog のみ | OAuth Client ID |
| — | `--client-secret` | backlog のみ | OAuth Client Secret |

### auth logout

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--user` / `-u` | — | gh のみ | gh は1ホストに複数アカウント可。backlog は1スペース1認証 |

### auth status

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--show-token` / `-t` | `--show-token` | 名称変更 | backlog は `-t` エイリアスなし |
| `--active` / `-a` | — | gh のみ | gh は複数アカウント対応のため必要。backlog では不要 |
| `--json` | — | gh のみ / 検討 | auth status の JSON 出力 |
| `--jq` / `-q` | — | gh のみ | |
| `--template` | — | gh のみ | |

### auth token

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--user` / `-u` | — | gh のみ | 複数アカウント非対応のため不要 |

### auth refresh

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--scopes` / `-s` | — | N/A | Backlog OAuth にスコープ概念なし |
| `--remove-scopes` / `-r` | — | N/A | |
| `--reset-scopes` | — | N/A | |
| `--clipboard` / `-c` | — | N/A | |
| `--insecure-storage` | — | N/A | |

### auth switch

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--hostname` / `-h` | `--space` | 名称変更 | `-h` を廃止（help と競合するため） |
| `--user` / `-u` | — | gh のみ | backlog は1スペース1認証のため不要 |

---

### issue list

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--assignee` / `-a` | `--assignee` / `-a` | 共通 | |
| `--limit` / `-L` | `--limit` / `-L` | 共通 | デフォルト値が異なる: gh=30, backlog=20 |
| `--json` | `--json` | 共通 | |
| `--state` / `-s` | `--status` / `-S` | 名称変更 | フラグ名とエイリアスが異なる |
| `--search` / `-S` | `--keyword` / `-k` | 名称変更 | フラグ名とエイリアスが異なる |
| `--author` / `-A` | — | gh のみ / 検討 | Backlog API には `createdUserId` フィルタあり |
| `--label` / `-l` | — | gh のみ / 検討 | Backlog の「カテゴリ」で代替可能。API に `categoryId[]` パラメータあり |
| `--milestone` / `-m` | — | gh のみ / 検討 | Backlog API に `milestoneId[]` パラメータあり |
| `--web` / `-w` | — | gh のみ / 検討 | ブラウザで課題一覧を開く |
| `--mention` | — | gh のみ | Backlog にメンション検索 API なし |
| `--app` | — | N/A | GitHub App 固有 |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | — | gh のみ | backlog は `--project` で代替 |
| — | `--project` / `-p` | backlog のみ | プロジェクト指定 |
| — | `--status` / `-S` | backlog のみ | ステータス名でフィルタ（カンマ区切り対応） |
| — | `--type` / `-T` | backlog のみ | 課題種別フィルタ |
| — | `--priority` / `-P` | backlog のみ | 優先度フィルタ |
| — | `--created-since` | backlog のみ | 作成日 from |
| — | `--created-until` | backlog のみ | 作成日 to |
| — | `--updated-since` | backlog のみ | 更新日 from |
| — | `--updated-until` | backlog のみ | 更新日 to |
| — | `--due-since` | backlog のみ | 期限日 from |
| — | `--due-until` | backlog のみ | 期限日 to |
| — | `--sort` | backlog のみ | ソートキー |
| — | `--order` | backlog のみ | ソート順 |
| — | `--offset` | backlog のみ | ページネーション |

### issue view

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comments` / `-c` | `--comments` | 名称変更 | backlog は `-c` エイリアスなし |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--json` | `--json` | 共通 | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | — | gh のみ | |

### issue create

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--title` / `-t` | `--title` / `-t` | 共通 | |
| `--assignee` / `-a` | `--assignee` / `-a` | 共通 | |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--body` / `-b` | `--description` / `-d` | 名称変更 | フラグ名が異なる |
| `--project` / `-p` | `--project` / `-p` | 名称変更 | gh: GitHub Projects 追加, backlog: プロジェクト指定（意味が異なる） |
| `--body-file` / `-F` | — | gh のみ / 検討 | ファイルからの読み込み |
| `--editor` / `-e` | — | gh のみ / 検討 | エディタ起動 |
| `--label` / `-l` | — | gh のみ / 検討 | Backlog のカテゴリで代替可能 |
| `--milestone` / `-m` | — | gh のみ / 検討 | Backlog API に `milestoneId[]` パラメータあり |
| `--template` / `-T` | — | gh のみ | |
| `--recover` | — | gh のみ | |
| `--repo` / `-R` | — | gh のみ | |
| — | `--type` / `-T` | backlog のみ | 課題種別（必須） |
| — | `--priority` / `-P` | backlog のみ | 優先度（必須） |
| — | `--start-date` | backlog のみ | 開始日 |
| — | `--due-date` | backlog のみ | 期限日 |

### issue edit

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--title` / `-t` | `--title` / `-t` | 共通 | |
| `--body` / `-b` | `--description` / `-d` | 名称変更 | |
| `--add-assignee` | `--assignee` / `-a` | 名称変更 | gh は add/remove 分離、backlog は上書き |
| `--body-file` / `-F` | — | gh のみ / 検討 | |
| `--milestone` / `-m` | — | gh のみ / 検討 | |
| `--add-label` | — | gh のみ / 検討 | カテゴリで代替可能 |
| `--remove-assignee` | — | gh のみ | gh の add/remove パターン |
| `--add-project` | — | N/A | |
| `--remove-label` | — | gh のみ | |
| `--remove-milestone` | — | gh のみ | |
| `--remove-project` | — | N/A | |
| `--repo` / `-R` | — | gh のみ | |
| — | `--status` / `-S` | backlog のみ | ステータス変更 |
| — | `--type` / `-T` | backlog のみ | 課題種別変更 |
| — | `--priority` / `-P` | backlog のみ | 優先度変更 |
| — | `--comment` / `-c` | backlog のみ | 更新コメント |

### issue close

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comment` / `-c` | `--comment` / `-c` | 共通 | |
| `--reason` / `-r` | `--resolution` / `-r` | 名称変更 | gh: `completed` / `not planned`, backlog: 完了理由名 |
| `--repo` / `-R` | — | gh のみ | |

### issue reopen

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comment` / `-c` | `--comment` / `-c` | 共通 | |
| `--repo` / `-R` | — | gh のみ | |

### issue delete

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--yes` | `--yes` / `-y` | 名称変更 | backlog は `-y` エイリアスを追加 |
| `--repo` / `-R` | — | gh のみ | |

### issue comment

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--body` / `-b` | `--body` / `-b` | 共通 | |
| `--body-file` / `-F` | — | gh のみ / 検討 | ファイルからの読み込み |
| `--editor` / `-e` | — | gh のみ / 検討 | エディタ起動 |
| `--web` / `-w` | — | gh のみ / 検討 | ブラウザでコメント |
| `--edit-last` | — | gh のみ | 最後のコメントを編集 |
| `--delete-last` | — | gh のみ | 最後のコメントを削除 |
| `--create-if-none` | — | gh のみ | `--edit-last` と併用 |
| `--yes` | — | gh のみ | `--delete-last` の確認スキップ |
| `--repo` / `-R` | — | gh のみ | |

### issue status

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--json` | — | gh のみ / 検討 | JSON 出力 |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | — | gh のみ | |

---

### pr list

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--assignee` / `-a` | `--assignee` / `-a` | 共通 | |
| `--limit` / `-L` | `--limit` / `-L` | 共通 | デフォルト値が異なる: gh=30, backlog=20 |
| `--json` | `--json` | 共通 | |
| `--state` / `-s` | `--status` / `-S` | 名称変更 | |
| `--author` / `-A` | `--created-by` | 名称変更 | backlog はエイリアスなし |
| `--base` / `-B` | — | gh のみ / 検討 | ベースブランチでフィルタ |
| `--head` / `-H` | — | gh のみ | ヘッドブランチでフィルタ |
| `--draft` / `-d` | — | N/A | Backlog にドラフト PR なし |
| `--label` / `-l` | — | N/A | Backlog PR にラベルなし |
| `--search` / `-S` | — | gh のみ | |
| `--web` / `-w` | — | gh のみ / 検討 | |
| `--app` | — | N/A | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | gh: `OWNER/REPO` スコープ, backlog: リポジトリ名（意味が異なる） |
| — | `--project` / `-p` | backlog のみ | プロジェクト指定 |
| — | `--issue` | backlog のみ | 関連課題キーでフィルタ |
| — | `--offset` | backlog のみ | ページネーション |

### pr view

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comments` / `-c` | `--comments` | 名称変更 | backlog は `-c` エイリアスなし |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--json` | `--json` | 共通 | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

### pr create

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--title` / `-t` | `--title` / `-t` | 共通 | |
| `--body` / `-b` | `--body` / `-b` | 共通 | |
| `--base` / `-B` | `--base` / `-B` | 共通 | |
| `--assignee` / `-a` | `--assignee` / `-a` | 共通 | |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--head` / `-H` | `--branch` | 名称変更 | フラグ名が異なり、backlog はエイリアスなし |
| `--body-file` / `-F` | — | gh のみ / 検討 | |
| `--draft` / `-d` | — | N/A | Backlog にドラフト PR なし |
| `--dry-run` | — | gh のみ | |
| `--editor` / `-e` | — | gh のみ / 検討 | |
| `--fill` / `-f` | — | gh のみ / 検討 | コミット情報から自動入力 |
| `--fill-first` | — | gh のみ | |
| `--fill-verbose` | — | gh のみ | |
| `--label` / `-l` | — | N/A | |
| `--milestone` / `-m` | — | N/A | |
| `--no-maintainer-edit` | — | N/A | |
| `--reviewer` / `-r` | — | gh のみ / 検討 | Backlog PR にレビュアー API あり |
| `--template` / `-T` | — | gh のみ | |
| `--recover` | — | gh のみ | |
| `--project` / `-p` | `--project` / `-p` | 名称変更 | 意味が異なる |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--issue` | backlog のみ | 関連課題キー |

### pr edit

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--title` / `-t` | `--title` / `-t` | 共通 | |
| `--body` / `-b` | `--body` / `-b` | 共通 | |
| `--add-assignee` | `--assignee` / `-a` | 名称変更 | backlog は上書き方式 |
| `--base` / `-B` | — | gh のみ | ベースブランチ変更 |
| `--body-file` / `-F` | — | gh のみ / 検討 | |
| `--add-label` | — | N/A | |
| `--remove-label` | — | N/A | |
| `--add-project` | — | N/A | |
| `--remove-project` | — | N/A | |
| `--milestone` / `-m` | — | N/A | |
| `--remove-milestone` | — | N/A | |
| `--add-reviewer` | — | gh のみ / 検討 | |
| `--remove-reviewer` | — | gh のみ / 検討 | |
| `--remove-assignee` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |
| — | `--issue` | backlog のみ | 関連課題キー変更 |

### pr close

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comment` / `-c` | `--comment` / `-c` | 共通 | |
| `--delete-branch` / `-d` | — | gh のみ / 検討 | ブランチ自動削除 |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

### pr merge

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--body` / `-b` | `--comment` / `-c` | 名称変更 | gh はマージコミットメッセージ、backlog はコメント |
| `--merge` / `-m` | — | gh のみ | Backlog はマージ方式を API で選択しない |
| `--rebase` / `-r` | — | gh のみ | |
| `--squash` / `-s` | — | gh のみ | |
| `--subject` / `-t` | — | gh のみ | マージコミットのサブジェクト |
| `--delete-branch` / `-d` | — | gh のみ / 検討 | ブランチ自動削除 |
| `--auto` | — | gh のみ | 自動マージ |
| `--disable-auto` | — | gh のみ | |
| `--admin` | — | gh のみ | |
| `--author-email` / `-A` | — | gh のみ | |
| `--body-file` / `-F` | — | gh のみ | |
| `--match-head-commit` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

### pr reopen

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--comment` / `-c` | — | gh のみ / 検討 | backlog pr reopen にコメントオプションがない |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

### pr comment

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--body` / `-b` | `--body` / `-b` | 共通 | |
| `--body-file` / `-F` | — | gh のみ / 検討 | |
| `--editor` / `-e` | — | gh のみ / 検討 | |
| `--web` / `-w` | — | gh のみ | |
| `--edit-last` | — | gh のみ | |
| `--delete-last` | — | gh のみ | |
| `--create-if-none` | — | gh のみ | |
| `--yes` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

### pr comments

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| — | `--project` / `-p` | backlog のみ | gh CLI に `pr comments` サブコマンドなし（`pr view --comments` で代替） |
| — | `--repo` / `-R` | backlog のみ | |
| — | `--limit` / `-L` | backlog のみ | |

### pr status

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--conflict-status` / `-c` | — | gh のみ | マージコンフリクト状態の表示 |
| `--json` | — | gh のみ / 検討 | JSON 出力 |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| `--repo` / `-R` | `--repo` / `-R` | 名称変更 | 意味が異なる |
| — | `--project` / `-p` | backlog のみ | |

---

### project list (gh: repo list)

| gh CLI (`repo list`) | backlog CLI (`project list`) | 状態 | 備考 |
| --- | --- | --- | --- |
| `--limit` / `-L` | `--limit` / `-L` | 共通 | デフォルト値が異なる: gh=30, backlog=20 |
| `--json` | `--json` | 共通 | |
| `--archived` | `--archived` | 共通 | gh: アーカイブのみ表示, backlog: アーカイブを含む |
| `--visibility` | — | N/A | Backlog のプロジェクト公開は別概念 |
| `--fork` | — | N/A | |
| `--source` | — | N/A | |
| `--no-archived` | — | gh のみ | backlog は `--archived` のトグルのみ |
| `--language` / `-l` | — | N/A | |
| `--topic` | — | N/A | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| — | `--all` | backlog のみ | 管理者向け全プロジェクト表示 |

### project view (gh: repo view)

| gh CLI (`repo view`) | backlog CLI (`project view`) | 状態 | 備考 |
| --- | --- | --- | --- |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--json` | `--json` | 共通 | |
| `--branch` / `-b` | — | N/A | リポジトリ固有 |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |

### repo list

| gh CLI (`repo list`) | backlog CLI (`repo list`) | 状態 | 備考 |
| --- | --- | --- | --- |
| `--json` | `--json` | 共通 | |
| `--limit` / `-L` | — | gh のみ / 検討 | backlog repo list にページネーションなし |
| `--archived` | — | gh のみ | |
| `--visibility` | — | N/A | |
| `--language` / `-l` | — | N/A | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |

### repo view

| gh CLI (`repo view`) | backlog CLI (`repo view`) | 状態 | 備考 |
| --- | --- | --- | --- |
| `--web` / `-w` | `--web` | 名称変更 | backlog は `-w` エイリアスなし |
| `--json` | `--json` | 共通 | |
| `--branch` / `-b` | — | gh のみ | |
| `--jq` / `-q` | — | gh のみ | |
| `--template` / `-t` | — | gh のみ | |
| — | `--project` / `-p` | backlog のみ | |

### repo clone

| gh CLI (`repo clone`) | backlog CLI (`repo clone`) | 状態 | 備考 |
| --- | --- | --- | --- |
| `[<directory>]` (positional) | `--directory` / `-d` | 名称変更 | gh は位置引数、backlog はフラグ |
| `-- <gitflags>...` | — | gh のみ / 検討 | 追加 git フラグの転送 |
| `--upstream-remote-name` / `-u` | — | N/A | fork 概念なし |
| — | `--project` / `-p` | backlog のみ | |

---

### config get

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--host` | `--space` | 名称変更 | フラグ名が異なる |

### config set

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--host` | `--space` | 名称変更 | フラグ名が異なる |

### config list

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--host` | `--space` | 名称変更 | フラグ名が異なる |

---

### status

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--exclude` / `-e` | — | gh のみ / 検討 | リポジトリ除外フィルタ |
| `--org` / `-o` | — | gh のみ | gh は org 単位、backlog はスペース単位 |
| — | `--json` | backlog のみ | JSON 出力 |

### browse

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--wiki` / `-w` | `--wiki` | 名称変更 | backlog はエイリアスなし |
| `--settings` / `-s` | `--settings` | 名称変更 | backlog はエイリアスなし |
| `--no-browser` / `-n` | — | gh のみ / 検討 | URL を表示するだけ |
| `--branch` / `-b` | — | N/A | |
| `--commit` / `-c` | — | N/A | |
| `--actions` / `-a` | — | N/A | Backlog に CI/CD なし |
| `--releases` / `-r` | — | N/A | |
| `--projects` / `-p` | — | N/A | GitHub Projects 固有 |
| `--repo` / `-R` | — | gh のみ | |
| — | `--project` / `-p` | backlog のみ | プロジェクト指定 |
| — | `--issues` | backlog のみ | 課題一覧を開く |
| — | `--git` | backlog のみ | Git リポジトリページを開く |

### api

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--method` / `-X` | `--method` / `-X` | 共通 | |
| `--header` / `-H` | `--header` / `-H` | 共通 | |
| `--include` / `-i` | `--include` / `-i` | 共通 | |
| `--paginate` | `--paginate` | 共通 | |
| `--silent` | `--silent` | 共通 | |
| `--raw-field` / `-f` | `--field` / `-f` | 名称変更 | gh は `-f`(raw) と `-F`(typed) の2種、backlog は `-f` のみ |
| `--field` / `-F` | — | gh のみ / 検討 | 型付きフィールド（数値、ブール、ファイル） |
| `--jq` / `-q` | — | gh のみ / 検討 | レスポンスの jq フィルタ |
| `--template` / `-t` | — | gh のみ | |
| `--cache` | — | gh のみ | レスポンスキャッシュ |
| `--hostname` | — | gh のみ | backlog は `--space` グローバルオプションで代替 |
| `--input` | — | gh のみ | リクエストボディのファイル入力 |
| `--preview` / `-p` | — | N/A | GitHub API プレビュー固有 |
| `--slurp` | — | gh のみ | ページネーション結果のマージ |
| `--verbose` | — | gh のみ / 検討 | HTTP リクエスト/レスポンスの詳細表示 |

### alias set

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--shell` / `-s` | `--shell` | 名称変更 | backlog は `-s` エイリアスなし |
| `--clobber` | — | gh のみ / 検討 | 既存エイリアスの上書き許可 |

### alias list

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| （フラグなし） | （フラグなし） | 共通 | 完全一致 |

### alias delete

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--all` | — | gh のみ / 検討 | 全エイリアス一括削除 |

### completion

| gh CLI | backlog CLI | 状態 | 備考 |
| --- | --- | --- | --- |
| `--shell` / `-s` | `shell`（位置引数） | 名称変更 | gh はフラグ、backlog は位置引数。gh は `powershell` もサポート |

---

## エイリアス不足の一覧

gh CLI と同名のフラグを持つが、短縮エイリアスが不足しているもの:

| コマンド | フラグ | gh CLI エイリアス | backlog CLI エイリアス | 状態 |
| --- | --- | --- | --- | --- |
| `auth status` | `--show-token` | `-t` | なし | 不足 |
| `issue view` | `--comments` | `-c` | なし | 不足 |
| `issue view` | `--web` | `-w` | なし | 不足 |
| `issue create` | `--web` | `-w` | なし | 不足 |
| `pr view` | `--comments` | `-c` | なし | 不足 |
| `pr view` | `--web` | `-w` | なし | 不足 |
| `pr create` | `--web` | `-w` | なし | 不足 |
| `project view` | `--web` | `-w` | なし | 不足 |
| `repo view` | `--web` | `-w` | なし | 不足 |
| `browse` | `--wiki` | `-w` | なし | 不足 |
| `browse` | `--settings` | `-s` | なし | 不足 |
| `alias set` | `--shell` | `-s` | なし | 不足 |

---

## 確認スキップフラグの不統一

| コマンド | backlog CLI | gh CLI 相当 | 備考 |
| --- | --- | --- | --- |
| `issue delete` | `--yes` / `-y` | `--yes` | 一致（backlog は `-y` エイリアス追加） |
| `project delete` | `--confirm` | — | gh に `project delete` なし |
| `wiki delete` | `--confirm` | — | |
| `team delete` | `--confirm` | — | |
| `category delete` | `--confirm` | — | |
| `milestone delete` | `--confirm` | — | |
| `issue-type delete` | `--confirm` | — | |
| `status delete` | `--confirm` | — | |
| `webhook delete` | `--confirm` | — | |
| `watching delete` | `--confirm` | — | |

**問題点:** `issue delete` は `--yes` / `-y` だが、他の delete コマンドは `--confirm` を使用。フラグ名が統一されていない。gh CLI は `--yes` で統一している。

---

## 採用検討すべきオプション（優先度順）

### 優先度: 高

| オプション | 対象コマンド | 理由 |
| --- | --- | --- |
| `--web` / `-w`（エイリアス追加） | `issue view`, `issue create`, `pr view`, `pr create`, `project view`, `repo view` | gh CLI と同じエイリアスにするとユーザーの期待に合う |
| `--comments` / `-c`（エイリアス追加） | `issue view`, `pr view` | 同上 |
| `--body-file` / `-F` | `issue create`, `issue comment`, `pr create`, `pr comment` | ファイルからの本文読み込みは CI/自動化で有用 |
| 確認スキップフラグの統一 | 全 delete コマンド | `--yes` / `-y` に統一すべき |
| `--comment` / `-c` | `pr reopen` | gh CLI にはあるが backlog CLI にない。issue reopen にはある |

### 優先度: 中

| オプション | 対象コマンド | 理由 |
| --- | --- | --- |
| `--jq` / `-q` | `--json` を持つ全コマンド | JSON フィルタリングの利便性。ただし Bun 環境での jq 実装の検討が必要 |
| `--no-browser` / `-n` | `browse` | URL のみ表示はスクリプティングで有用 |
| `--editor` / `-e` | `issue create`, `issue comment`, `pr create`, `pr comment` | テキストエディタ起動は UX 向上 |
| `--verbose` | `api` | デバッグ用の HTTP 詳細表示 |
| `--author` フィルタ | `issue list` | Backlog API の `createdUserId` パラメータで対応可能 |
| `--category` フィルタ | `issue list`, `issue create` | Backlog API の `categoryId[]` パラメータで対応可能 |
| `--milestone` フィルタ | `issue list`, `issue create` | Backlog API の `milestoneId[]` パラメータで対応可能 |
| `--reviewer` | `pr create`, `pr edit` | Backlog PR API にレビュアー設定あり |
| `--fill` / `-f` | `pr create` | コミット情報からタイトル・本文を自動入力 |
| `--json` 出力 | `issue status`, `pr status` | ステータス表示の JSON 出力対応 |

### 優先度: 低

| オプション | 対象コマンド | 理由 |
| --- | --- | --- |
| `--clobber` | `alias set` | 既存エイリアスの上書き |
| `--all` | `alias delete` | 全エイリアス一括削除 |
| `--field` / `-F`（型付き） | `api` | 型付きフィールドは便利だが実装コスト高 |
| `--cache` | `api` | レスポンスキャッシュ |
| `--delete-branch` / `-d` | `pr close`, `pr merge` | Backlog API でブランチ削除が可能か要確認 |
| `--exclude` / `-e` | `status` | プロジェクト除外フィルタ |
| `-- <gitflags>` | `repo clone` | 追加 git フラグの転送 |

---

## まとめ

### 統計

| 分類 | 件数 |
| --- | --- |
| 完全一致のオプション | 約 25 件 |
| 名称変更（フラグ名またはエイリアスの違い） | 約 30 件 |
| gh CLI のみ（N/A: Backlog に概念なし） | 約 40 件 |
| gh CLI のみ（検討対象） | 約 25 件 |
| backlog CLI のみ（Backlog 固有の追加） | 約 35 件 |

### 主な所見

1. **エイリアスの不足が目立つ**: `--web`, `--comments`, `--show-token`, `--shell` 等、gh CLI で提供されている短縮エイリアスが backlog CLI で欠落している。低コストで改善可能。

2. **`--body-file` の欠如**: CI/自動化ワークフローで重要な「ファイルからの本文読み込み」機能が全体的に不足。`"-"` での stdin 対応はあるが、任意ファイルパスの指定ができない。

3. **確認スキップフラグの不統一**: `issue delete` は `--yes` / `-y`、他の delete は `--confirm`。gh CLI に合わせて `--yes` / `-y` に統一すべき。

4. **`--jq` 相当のフィルタ機能**: gh CLI の `--jq` は強力だが、実装には jq パーサーが必要。代替として `--json field1,field2` のフィールドフィルタが既に実装済み。

5. **PR reopen にコメントオプションがない**: `issue reopen` には `--comment` があるが、`pr reopen` にはない。gh CLI には `pr reopen --comment` がある。

6. **ステータス系コマンドの JSON 出力**: `issue status` と `pr status` に `--json` 出力がない。

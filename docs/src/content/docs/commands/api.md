---
title: backlog api
description: 認証済み API リクエストを実行する
---

```
backlog api <endpoint> [flags]
```

Backlog API に対して認証済みのリクエストを送信します。任意のエンドポイントにアクセスできます。

## 引数

| 引数         | 型     | 必須 | 説明                                   |
| ------------ | ------ | ---- | -------------------------------------- |
| `<endpoint>` | string | Yes  | API パス（例: `/api/v2/users/myself`） |

## オプション

| フラグ       | 短縮 | 型      | デフォルト | 説明                                            |
| ------------ | ---- | ------- | ---------- | ----------------------------------------------- |
| `--method`   | `-X` | string  | `GET`      | HTTP メソッド                                   |
| `--field`    | `-f` | string  | —          | リクエストフィールド（`key=value`、繰り返し可） |
| `--header`   | `-H` | string  | —          | 追加ヘッダー（繰り返し可）                      |
| `--include`  | `-i` | boolean | `false`    | レスポンスヘッダーを含める                      |
| `--paginate` |      | boolean | `false`    | ページネーションで全件取得                      |
| `--silent`   |      | boolean | `false`    | 出力を抑制                                      |

## フィールドの型変換

`--field` で指定した値は自動的に型変換されます。

- `key=123` → 数値
- `key=true` / `key=false` → 真偽値
- `key=text` → 文字列

## 使用例

```bash
# 自分のユーザー情報を取得
backlog api /api/v2/users/myself

# 課題を作成
backlog api /api/v2/issues -X POST \
  -f projectId=12345 \
  -f summary="新しい課題" \
  -f issueTypeId=67890 \
  -f priorityId=3

# ページネーションで全件取得
backlog api /api/v2/issues --paginate

# レスポンスヘッダーを表示
backlog api /api/v2/space -i
```

## 関連コマンド

- [auth token](/backlog-cli/commands/auth/token/)

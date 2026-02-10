---
title: backlog api
description: 認証済み API リクエストを実行する
---

```
backlog api <endpoint> [flags]
```

Backlog APIに対して認証済みのリクエストを送信します。任意のエンドポイントにアクセスできます。

## 引数

`<endpoint> <string>`
: APIパス（例: `/api/v2/users/myself`）

## オプション

`-X`, `--method <string>` (default "GET")
: HTTPメソッド

`-f`, `--field <string>`
: リクエストフィールド（key=value、繰り返し可）

`-H`, `--header <string>`
: 追加ヘッダー（繰り返し可）

`-i`, `--include`
: レスポンスヘッダーを含める

`--paginate`
: ページネーションで全件取得

`--silent`
: 出力を抑制

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

- [auth token](/commands/auth/token/)

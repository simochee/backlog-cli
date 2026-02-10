# v1 リリースロードマップ

## 概要

Phase 1〜4 の全 99 コマンド + `issue delete` の実装が完了し、CI/CD・ドキュメント・テストも整備済み。
本ドキュメントでは v1.0.0 リリースに向けて必要なタスクと推奨タスクを整理する。

---

## 1. リリースブロッカー（必須）

### 1.1 `engines` フィールドの追加

- [x] `packages/cli/package.json` に `"engines": { "node": ">=18" }` を追加済み

### 1.2 npm publish の E2E 検証

- [x] `npm pack --dry-run` でパッケージ内容を確認 — 4 ファイル（README.md, bin/backlog.mjs, dist/backlog.mjs, package.json）、108.8 kB
- [x] `backlog --help` / `backlog --version` の動作確認済み
- [x] `bin/backlog.mjs` → `dist/backlog.mjs` の参照パスが正しいことを確認
- [ ] release.yaml の `npm pkg delete` ステップで依存が消えてもバンドル済みバイナリが動くか（CI 上での検証が必要）

### 1.3 テストカバレッジの補完

- [x] `src/utils/argv.ts` — `extractSpaceArg` のテスト追加（12 テストケース）
- [x] `src/utils/oauth-callback.ts` — OAuth コールバックサーバーのテスト追加（8 テストケース）
- 全 112 ファイル・473 テスト合格

### 1.4 初回リリースバージョン戦略の決定

- [x] **B) `0.1.0` から開始** を採用。`.release-please-manifest.json` を `0.1.0` に更新済み
- 0.x でフィードバックを経て 1.0.0 に上げる方針

---

## 2. 強く推奨（v1 の品質を上げるもの）

### 2.1 CLI インターフェースの最終レビュー

v1 以降は Semantic Versioning により、CLI のインターフェース変更が破壊的変更となる。リリース前に以下を確認：

- [x] 全コマンドのフラグ名の一貫性（例: `--project` / `-p` が統一されているか）
- [ ] `--json` 出力のフィールド名が API レスポンスと一致しているか
- [ ] エラーメッセージの文言が統一されているか（日本語 / 英語の混在がないか）
- [ ] `--help` テキストの品質（description が分かりやすいか、examples があるか）
- [ ] exit code の一貫性（成功=0、認証エラー=1、引数エラー=1 等）
- [x] 削除確認フラグの統一: 全 delete コマンドを `--yes` / `-y` に統一済み（gh CLI 準拠）

### 2.2 Node.js バージョンマトリクスでの CI テスト

- [x] CI の test ジョブに Node.js 18, 20, 22, 24 のマトリクスを追加済み
- Codecov アップロードは Node.js 22 のみで実行（重複防止）

### 2.3 `process.exit()` の呼び出し箇所の監査

現在 27 ファイル・48 箇所で `process.exit()` を呼んでいる。CLI ツールとして exit は正常だが、以下を確認：

- [ ] exit code が適切か（認証エラー、バリデーションエラー等で区別するか）
- [ ] 不要な exit がないか（citty の `runMain` が自動的にハンドリングする箇所）

### 2.4 セキュリティレビュー

- [ ] OAuth の state パラメータが十分なエントロピーを持っているか
- [ ] `~/.backlogrc` のファイルパーミッションが適切か（600 等）
- [ ] API キーがログ出力に含まれないか（`consola.debug` 等）
- [ ] 依存パッケージの脆弱性チェック（`bun audit` / `npm audit`）

具体的な実施方法は本ドキュメント末尾の「付録: セキュリティレビュー実施ガイド」を参照。

### 2.5 `--no-input` フラグの実装（新規発見）

- [x] **実装完了**。`extractGlobalArgs` で `--no-input` を抽出し `BACKLOG_NO_INPUT=1` 環境変数で伝播
- [x] `promptRequired` で `--no-input` 時は引数未指定でエラー終了（メッセージで引数指定を案内）
- [x] `confirmOrExit` で `--no-input` 時は `--yes` なしでエラー終了
- [x] `auth logout` / `auth switch` の直接 `consola.prompt` 呼び出しにも `isNoInput()` チェック追加
- [x] 削除確認フラグを全コマンドで `--yes` / `-y` に統一（gh CLI 準拠）
- [x] テスト追加: `argv.test.ts`（18 テスト）、`prompt.test.ts`（16 テスト）

---

## 3. 推奨（あると良いもの）

### 3.1 CHANGELOG.md の初期生成

- [x] `CHANGELOG.md` を作成済み（0.1.0 の主要な変更を記載）

### 3.2 起動パフォーマンスの計測

- [x] 計測済み: `backlog --help` が **約 318ms**（Node.js 22、コールドスタート）
- サブコマンドの遅延読み込み（lazy import）が効果的に機能している
- バンドルサイズ: 380.1 kB（minified）

### 3.3 エラーメッセージの改善

- 認証未設定時のメッセージに `backlog auth login` コマンドの案内があるか
- ネットワークエラー時にリトライの案内があるか
- 存在しないサブコマンドを入力した際の typo サジェスション（citty が対応していれば）

### 3.4 シェル補完の動作検証

`backlog completion` コマンドが生成するスクリプトを、主要シェルで実際に動作確認：

- [ ] bash
- [ ] zsh
- [ ] fish（対応している場合）

### 3.5 ドキュメントサイトの最終確認

- [x] 全コマンドページの存在確認済み（129 ファイル）
- [x] パッケージ名 `@simochee/backlog-cli` の一貫性確認済み
- [x] プレースホルダーや TODO マーカーなし

**要対応（発見された問題）:**

- [ ] **内部リンクのパス修正**: 41 ファイル・141 箇所で `/backlog-cli/commands/...` を `/commands/...` に修正が必要（不要なベースパスプレフィックス）
- [x] **`issue delete` のドキュメント追加**: ドキュメントページ・サイドバーエントリ追加済み
- [ ] OpenAPI 仕様ファイルの生成確認（ビルド時に自動生成されるが、初回は `tsp compile` が必要）

### 3.6 `--no-input` フラグの全コマンド対応確認

- [x] 調査完了 → **2.5 に昇格**（未実装のため、リリース前の対応を強く推奨）

---

## 4. v1 以降に検討（スコープ外）

以下は v1 リリースには含めないが、v1.x で検討する項目：

| 項目 | 概要 |
|---|---|
| `issue attachments` / `pr attachments` | ファイルアップロード/ダウンロード対応 |
| プラグインシステム | サードパーティ拡張の仕組み |
| 設定ファイルのマイグレーション | `~/.backlogrc` のスキーマ変更時の自動マイグレーション |
| `backlog update` | セルフアップデートコマンド |
| Keyring 連携 | OS のキーチェーンに認証情報を保存 |
| オフラインキャッシュ | プロジェクト一覧等のキャッシュでオフライン操作対応 |

---

## リリース手順（案）

1. 上記のリリースブロッカーを全て解消
2. `main` ブランチで最終確認（CI green、テスト全通過）
3. release-please が v0.1.0 の Release PR を自動作成
4. Release PR をマージ → GitHub Release 作成 → npm 自動パブリッシュ
5. `npm install -g @simochee/backlog-cli` で動作確認
6. ドキュメントサイトの更新を確認
7. フィードバック収集後、v1.0.0 に向けて 2.x の残タスクを解消

---

## 付録: セキュリティレビュー実施ガイド

### A. OAuth state パラメータのエントロピー確認

**目的**: CSRF 攻撃を防ぐために state パラメータが推測不可能であること

**確認手順**:
1. `packages/cli/src/commands/auth/login.ts` で state の生成方法を確認
2. `crypto.randomUUID()` や `crypto.randomBytes()` 等の暗号学的に安全な乱数を使用しているか
3. state の長さが十分か（128 ビット以上推奨）

**不合格の場合**: `crypto.randomUUID()` に置き換え

### B. `~/.backlogrc` のファイルパーミッション確認

**目的**: 認証情報（API キー、OAuth トークン）が他ユーザーから読めないこと

**確認手順**:
1. `packages/config/src/config.ts` で `writeConfig` がパーミッションを設定しているか確認
2. rc9 ライブラリがデフォルトで適切なパーミッション（600）を設定しているか確認
3. 実際にファイルを作成して `ls -la ~/.backlogrc` で確認

**不合格の場合**: `writeConfig` 後に `fs.chmod(path, 0o600)` を追加

### C. API キーのログ漏洩チェック

**目的**: デバッグログや自エラーメッセージに API キーが含まれないこと

**確認手順**:
1. `consola.debug`, `consola.info`, `consola.error` の全呼び出しで出力内容を確認
2. API リクエストのエラーハンドリングで URL（API キーがクエリパラメータに含まれる）をそのまま表示していないか
3. ofetch のエラーオブジェクトに URL が含まれていないか

**不合格の場合**: ログ出力前に API キーをマスク処理

### D. 依存パッケージの脆弱性チェック

**目的**: 既知の脆弱性を持つ依存パッケージがないこと

**確認手順**:
```bash
cd packages/cli && npm audit --production
# または
bun audit
```

**不合格の場合**: 脆弱性の深刻度に応じて依存を更新またはパッチ適用

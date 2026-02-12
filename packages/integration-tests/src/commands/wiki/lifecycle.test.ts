import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("wiki lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let wikiId: string;

	afterAll(() => tracker.cleanupAll());

	it("Wiki ページ数を取得する", async () => {
		const result = await runCliJsonWithRetry<{ count: number }>(["wiki", "count", "-p", project]);
		expectSuccess(result);
		expect(typeof result.data.count).toBe("number");
	});

	it("Wiki ページを作成する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }>([
			"wiki",
			"create",
			"-p",
			project,
			"--name",
			testName,
			"--body",
			"integration test body",
		]);
		expectSuccess(result);
		expect(result.data.id).toBeDefined();
		wikiId = String(result.data.id);
		tracker.trackWiki(wikiId);
	});

	it("Wiki ページを表示する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }>(["wiki", "view", wikiId]);
		expectSuccess(result);
		expect(result.data.name).toBe(testName);
	});

	it("Wiki ページを編集する", async () => {
		const result = await runCliWithRetry([
			"wiki",
			"edit",
			wikiId,
			"--name",
			`${testName}-edited`,
			"--body",
			"updated body",
		]);
		expectSuccess(result);
	});

	it("Wiki ページの更新履歴を取得する", async () => {
		const result = await runCliWithRetry(["wiki", "history", wikiId, "--json"]);
		expectSuccess(result);
	});

	it("Wiki タグ一覧を取得する", async () => {
		const result = await runCliWithRetry(["wiki", "tags", "-p", project, "--json"]);
		expectSuccess(result);
	});

	it("Wiki ページの添付ファイル一覧を取得する", async () => {
		const result = await runCliWithRetry(["wiki", "attachments", wikiId, "--json"]);
		expectSuccess(result);
	});

	it("Wiki ページを削除する", async () => {
		const result = await runCliWithRetry(["wiki", "delete", wikiId, "--yes"]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});

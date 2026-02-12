import { afterAll, describe, expect, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("issue lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testTitle = `integration-test-${Date.now()}`;
	let issueKey: string;
	let issueTypeName: string;

	afterAll(() => tracker.cleanupAll());

	it("課題種別一覧から種別名を取得する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }[]>(["issue-type", "list", "-p", project]);
		expectSuccess(result);
		expect(result.data.length).toBeGreaterThan(0);
		issueTypeName = result.data[0]!.name;
	});

	it("課題を作成する", async () => {
		const result = await runCliJsonWithRetry<{ issueKey: string }>([
			"issue",
			"create",
			"-p",
			project,
			"--title",
			testTitle,
			"--type",
			issueTypeName,
		]);
		expectSuccess(result);
		expect(result.data.issueKey).toBeDefined();
		issueKey = result.data.issueKey;
		tracker.trackIssue(issueKey);
	});

	it("課題詳細を表示する", async () => {
		const result = await runCliJsonWithRetry<{ issueKey: string; summary: string }>(["issue", "view", issueKey]);
		expectSuccess(result);
		expect(result.data.issueKey).toBe(issueKey);
		expect(result.data.summary).toBe(testTitle);
	});

	it("課題を編集する", async () => {
		const result = await runCliWithRetry(["issue", "edit", issueKey, "--title", `${testTitle}-edited`]);
		expectSuccess(result);
	});

	it("課題にコメントする", async () => {
		const result = await runCliWithRetry(["issue", "comment", issueKey, "--body", "integration test comment"]);
		expectSuccess(result);
	});

	it("課題を完了にする", async () => {
		const result = await runCliWithRetry(["issue", "close", issueKey]);
		expectSuccess(result);
	});

	it("課題を再開する", async () => {
		const result = await runCliWithRetry(["issue", "reopen", issueKey]);
		expectSuccess(result);
	});

	it("課題を削除する", async () => {
		const result = await runCliWithRetry(["issue", "delete", issueKey, "--yes"]);
		expectSuccess(result);
		void tracker.cleanupAll();
	});
});

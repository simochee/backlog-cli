import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("watching lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testTitle = `integration-test-watching-${Date.now()}`;
	let issueKey: string;
	let issueTypeName: string;
	let watchingId: string;

	afterAll(() => tracker.cleanupAll());

	it("課題種別を取得する", async () => {
		const result = await runCliJsonWithRetry<{ name: string }[]>(["issue-type", "list", "-p", project]);
		expectSuccess(result);
		const firstIssueType = result.data[0];
		if (!firstIssueType) {
			throw new Error("Expected at least one issue type");
		}
		issueTypeName = firstIssueType.name;
	});

	it("ウォッチ対象の課題を作成する", async () => {
		requireDep(issueTypeName, "issueTypeName");
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
		issueKey = result.data.issueKey;
		tracker.trackIssue(issueKey);
	});

	it("ウォッチ一覧を取得する", async () => {
		const result = await runCliWithRetry(["watching", "list", "--json"]);
		expectSuccess(result);
	});

	it("課題をウォッチに追加する", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliJsonWithRetry<{ id: number }>(["watching", "add", "--issue", issueKey]);
		expectSuccess(result);
		expect(result.data.id).toBeDefined();
		watchingId = String(result.data.id);
	});

	it("ウォッチ詳細を表示する", async () => {
		requireDep(watchingId, "watchingId");
		const result = await runCliJsonWithRetry<{ id: number }>(["watching", "view", watchingId]);
		expectSuccess(result);
		expect(result.data.id).toBe(Number(watchingId));
	});

	it("ウォッチを既読にする", async () => {
		requireDep(watchingId, "watchingId");
		const result = await runCliWithRetry(["watching", "read", watchingId]);
		expectSuccess(result);
	});

	it("ウォッチを削除する", async () => {
		requireDep(watchingId, "watchingId");
		const result = await runCliWithRetry(["watching", "delete", watchingId, "--yes"]);
		expectSuccess(result);
	});
});

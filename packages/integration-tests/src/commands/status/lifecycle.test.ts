import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("status lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let statusId: string;
	let substituteStatusId: string;

	afterAll(() => tracker.cleanupAll());

	it("ステータス一覧を取得する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }[]>(["status", "list", "-p", project]);
		expectSuccess(result);
		expect(result.data.length).toBeGreaterThan(0);
		substituteStatusId = String(result.data[0]!.id);
	});

	it("ステータスを作成する", async () => {
		const result = await runCliWithRetry(["status", "create", "-p", project, "-n", testName, "--color", "#e30000"]);
		expectSuccess(result);
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["status", "list", "-p", project]);
		const created = listResult.data.find((s) => s.name === testName);
		expect(created).toBeDefined();
		statusId = String(created!.id);
		tracker.trackStatus(project, statusId, substituteStatusId);
	});

	it("ステータスを編集する", async () => {
		const result = await runCliWithRetry(["status", "edit", statusId, "-p", project, "-n", `${testName}-edited`]);
		expectSuccess(result);
	});

	it("ステータスを削除する", async () => {
		const result = await runCliWithRetry([
			"status",
			"delete",
			statusId,
			"-p",
			project,
			"--substitute-status-id",
			substituteStatusId,
			"--yes",
		]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});

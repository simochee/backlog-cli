import { afterAll, describe, it } from "vitest";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
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
		const firstStatus = result.data[0];
		if (!firstStatus) {
			throw new Error("Expected at least one status");
		}
		substituteStatusId = String(firstStatus.id);
	});

	it("ステータスを作成する", async () => {
		requireDep(substituteStatusId, "substituteStatusId");
		const result = await runCliWithRetry(["status", "create", "-p", project, "-n", testName, "--color", "#e30000"]);
		expectSuccess(result);
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["status", "list", "-p", project]);
		const created = listResult.data.find((s) => s.name === testName);
		if (!created) {
			throw new Error(`Expected status "${testName}" to be in list`);
		}
		statusId = String(created.id);
		tracker.trackStatus(project, statusId, substituteStatusId);
	});

	it("ステータスを編集する", async () => {
		requireDep(statusId, "statusId");
		const result = await runCliWithRetry(["status", "edit", statusId, "-p", project, "-n", `${testName}-edited`]);
		expectSuccess(result);
	});

	it("ステータスを削除する", async () => {
		requireDep(statusId, "statusId");
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
		void tracker.cleanupAll();
	});
});

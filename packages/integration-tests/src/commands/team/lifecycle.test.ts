import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("team lifecycle", () => {
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let teamId: string;

	afterAll(() => tracker.cleanupAll());

	it("チーム一覧を取得する", async () => {
		const result = await runCliWithRetry(["team", "list", "--json"]);
		expectSuccess(result);
	});

	it("チームを作成する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }>(["team", "create", "-n", testName]);
		expectSuccess(result);
		expect(result.data.id).toBeDefined();
		teamId = String(result.data.id);
		tracker.trackTeam(teamId);
	});

	it("チーム詳細を表示する", async () => {
		requireDep(teamId, "teamId");
		const result = await runCliJsonWithRetry<{ id: number; name: string }>(["team", "view", teamId]);
		expectSuccess(result);
		expect(result.data.name).toBe(testName);
	});

	it("チーム名を変更する", async () => {
		requireDep(teamId, "teamId");
		const result = await runCliWithRetry(["team", "edit", teamId, "-n", `${testName}-edited`]);
		expectSuccess(result);
	});

	it("チームを削除する", async () => {
		requireDep(teamId, "teamId");
		const result = await runCliWithRetry(["team", "delete", teamId, "--yes"]);
		expectSuccess(result);
		void tracker.cleanupAll();
	});
});

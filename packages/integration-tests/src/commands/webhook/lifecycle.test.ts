import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("webhook lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let webhookId: string;

	afterAll(() => tracker.cleanupAll());

	it("Webhook 一覧を取得する", async () => {
		const result = await runCliWithRetry(["webhook", "list", "-p", project, "--json"]);
		expectSuccess(result);
	});

	it("Webhook を作成する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }>([
			"webhook",
			"create",
			"-p",
			project,
			"-n",
			testName,
			"--hook-url",
			"https://example.com/webhook",
		]);
		expectSuccess(result);
		expect(result.data.id).toBeDefined();
		webhookId = String(result.data.id);
		tracker.trackWebhook(project, webhookId);
	});

	it("Webhook 詳細を表示する", async () => {
		requireDep(webhookId, "webhookId");
		const result = await runCliJsonWithRetry<{ id: number; name: string }>([
			"webhook",
			"view",
			webhookId,
			"-p",
			project,
		]);
		expectSuccess(result);
		expect(result.data.name).toBe(testName);
	});

	it("Webhook を編集する", async () => {
		requireDep(webhookId, "webhookId");
		const result = await runCliWithRetry(["webhook", "edit", webhookId, "-p", project, "-n", `${testName}-edited`]);
		expectSuccess(result);
	});

	it("Webhook を削除する", async () => {
		requireDep(webhookId, "webhookId");
		const result = await runCliWithRetry(["webhook", "delete", webhookId, "-p", project, "--yes"]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});

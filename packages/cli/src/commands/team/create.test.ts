import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn();
	return { default: fn, promptRequired: fn };
});
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import consola from "consola";

describe("team create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("チームを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Team" });

		const mod = await import("#commands/team/create.ts");
		await mod.default.run?.({ args: { name: "New Team" } } as never);

		const callArgs = mockClient.mock.calls[0];
		expect(callArgs?.[0]).toBe("/teams");
		expect(callArgs?.[1]).toMatchObject({ method: "POST" });
		const body = callArgs?.[1]?.body as URLSearchParams;
		expect(body).toBeInstanceOf(URLSearchParams);
		expect(body.get("name")).toBe("New Team");
		expect(consola.success).toHaveBeenCalledWith("Created team #1: New Team");
	});

	it("--members でメンバーを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "Team Members" });

		const mod = await import("#commands/team/create.ts");
		await mod.default.run?.({ args: { name: "Team Members", members: "1,2,3" } } as never);

		const callArgs = mockClient.mock.calls[0];
		expect(callArgs?.[0]).toBe("/teams");
		expect(callArgs?.[1]).toMatchObject({ method: "POST" });
		const body = callArgs?.[1]?.body as URLSearchParams;
		expect(body).toBeInstanceOf(URLSearchParams);
		expect(body.get("name")).toBe("Team Members");
		expect(body.getAll("members[]")).toEqual(["1", "2", "3"]);
	});
});

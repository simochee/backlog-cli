import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/prompt.ts", () => {
	const fn = mock();
	return { default: fn, promptRequired: fn };
});
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("team create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("チームを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Team" });

		const mod = await import("#commands/team/create.ts");
		await mod.default.run?.({ args: { name: "New Team" } } as never);

		const callArgs = mockClient.mock.calls[0]!;
		expect(callArgs[0]).toBe("/teams");
		expect(callArgs[1]).toMatchObject({ method: "POST" });
		const body = callArgs[1]!.body as URLSearchParams;
		expect(body).toBeInstanceOf(URLSearchParams);
		expect(body.get("name")).toBe("New Team");
		expect(consola.success).toHaveBeenCalledWith("Created team #1: New Team");
	});

	it("--members でメンバーを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "Team Members" });

		const mod = await import("#commands/team/create.ts");
		await mod.default.run?.({ args: { name: "Team Members", members: "1,2,3" } } as never);

		const callArgs = mockClient.mock.calls[0]!;
		expect(callArgs[0]).toBe("/teams");
		expect(callArgs[1]).toMatchObject({ method: "POST" });
		const body = callArgs[1]!.body as URLSearchParams;
		expect(body).toBeInstanceOf(URLSearchParams);
		expect(body.get("name")).toBe("Team Members");
		expect(body.getAll("members[]")).toEqual(["1", "2", "3"]);
	});
});

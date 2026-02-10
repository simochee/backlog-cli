import { extractGlobalArgs } from "#utils/argv.ts";
import { describe, expect, it } from "vitest";

describe("extractGlobalArgs", () => {
	it("--space value 形式でスペースを抽出し argv から除去する", () => {
		const result = extractGlobalArgs(["node", "backlog", "--space", "foo.backlog.com", "issue", "list"]);
		expect(result.space).toBe("foo.backlog.com");
		expect(result.argv).toEqual(["node", "backlog", "issue", "list"]);
	});

	it("-s value 形式でスペースを抽出し argv から除去する", () => {
		const result = extractGlobalArgs(["node", "backlog", "-s", "foo.backlog.com", "issue", "list"]);
		expect(result.space).toBe("foo.backlog.com");
		expect(result.argv).toEqual(["node", "backlog", "issue", "list"]);
	});

	it("--space=value 形式でスペースを抽出し argv から除去する", () => {
		const result = extractGlobalArgs(["node", "backlog", "--space=foo.backlog.com", "issue", "list"]);
		expect(result.space).toBe("foo.backlog.com");
		expect(result.argv).toEqual(["node", "backlog", "issue", "list"]);
	});

	it("-s=value 形式でスペースを抽出し argv から除去する", () => {
		const result = extractGlobalArgs(["node", "backlog", "-s=foo.backlog.com", "issue", "list"]);
		expect(result.space).toBe("foo.backlog.com");
		expect(result.argv).toEqual(["node", "backlog", "issue", "list"]);
	});

	it("--space が指定されていない場合は undefined を返し argv はそのまま", () => {
		const argv = ["node", "backlog", "issue", "list", "--project", "PROJ"];
		const result = extractGlobalArgs(argv);
		expect(result.space).toBeUndefined();
		expect(result.argv).toEqual(["node", "backlog", "issue", "list", "--project", "PROJ"]);
	});

	it("他のサブコマンド引数と混在していても --space のみ除去する", () => {
		const result = extractGlobalArgs([
			"node",
			"backlog",
			"issue",
			"list",
			"--space",
			"foo.backlog.com",
			"--project",
			"PROJ",
			"--json",
		]);
		expect(result.space).toBe("foo.backlog.com");
		expect(result.argv).toEqual(["node", "backlog", "issue", "list", "--project", "PROJ", "--json"]);
	});
});

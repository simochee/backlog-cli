import { extractSpaceArg } from "#utils/argv.ts";
import { describe, expect, it } from "vitest";

describe("extractSpaceArg", () => {
	it("--space value 形式でスペースを抽出する", () => {
		const result = extractSpaceArg(["--space", "example.backlog.com", "issue", "list"]);
		expect(result.space).toBe("example.backlog.com");
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("--space=value 形式でスペースを抽出する", () => {
		const result = extractSpaceArg(["--space=example.backlog.com", "issue", "list"]);
		expect(result.space).toBe("example.backlog.com");
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("-s value 形式でスペースを抽出する", () => {
		const result = extractSpaceArg(["-s", "example.backlog.com", "issue", "list"]);
		expect(result.space).toBe("example.backlog.com");
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("-s=value 形式でスペースを抽出する", () => {
		const result = extractSpaceArg(["-s=example.backlog.com", "issue", "list"]);
		expect(result.space).toBe("example.backlog.com");
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("--space がない場合は undefined を返す", () => {
		const result = extractSpaceArg(["issue", "list", "--project", "PROJ"]);
		expect(result.space).toBeUndefined();
		expect(result.argv).toEqual(["issue", "list", "--project", "PROJ"]);
	});

	it("空の argv を渡すと undefined と空配列を返す", () => {
		const result = extractSpaceArg([]);
		expect(result.space).toBeUndefined();
		expect(result.argv).toEqual([]);
	});

	it("複数の --space が指定された場合は最後の値が優先される", () => {
		const result = extractSpaceArg(["--space", "first.backlog.com", "--space", "last.backlog.com"]);
		expect(result.space).toBe("last.backlog.com");
		expect(result.argv).toEqual([]);
	});

	it("--space が argv の末尾にあり値がない場合は undefined を返す", () => {
		const result = extractSpaceArg(["issue", "list", "--space"]);
		expect(result.space).toBeUndefined();
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("-s が argv の末尾にあり値がない場合は undefined を返す", () => {
		const result = extractSpaceArg(["issue", "list", "-s"]);
		expect(result.space).toBeUndefined();
		expect(result.argv).toEqual(["issue", "list"]);
	});

	it("他の引数の順序を保持する", () => {
		const result = extractSpaceArg([
			"issue",
			"--space",
			"example.backlog.com",
			"create",
			"--project",
			"PROJ",
			"--title",
			"test",
		]);
		expect(result.space).toBe("example.backlog.com");
		expect(result.argv).toEqual(["issue", "create", "--project", "PROJ", "--title", "test"]);
	});

	it("--space と -s が混在する場合は最後の値が優先される", () => {
		const result = extractSpaceArg(["--space", "first.backlog.com", "-s", "last.backlog.com"]);
		expect(result.space).toBe("last.backlog.com");
		expect(result.argv).toEqual([]);
	});

	it("--space= で空文字列を指定すると空文字列を返す", () => {
		const result = extractSpaceArg(["--space=", "issue", "list"]);
		expect(result.space).toBe("");
		expect(result.argv).toEqual(["issue", "list"]);
	});
});

import type { CliResult } from "./cli.ts";

import { expect } from "bun:test";

export function expectSuccess(result: CliResult): void {
	expect(result.exitCode, `Command failed.\nStdout: ${result.stdout}\nStderr: ${result.stderr}`).toBe(0);
}

export function expectError(result: CliResult, pattern?: RegExp): void {
	expect(result.exitCode, `Expected command to fail but it succeeded.\nStdout: ${result.stdout}`).not.toBe(0);
	if (pattern) {
		const output = `${result.stdout} ${result.stderr}`;
		expect(output).toMatch(pattern);
	}
}

export function expectJsonArray(result: CliResult): unknown[] {
	expectSuccess(result);
	const data = JSON.parse(result.stdout);
	expect(Array.isArray(data), `Expected JSON array but got: ${typeof data}`).toBeTruthy();
	return data as unknown[];
}

/**
 * 前のテストで設定されるべき値が存在するか検証する。
 * undefined の場合は即座に失敗し、カスケード失敗であることを明示する。
 */
export function requireDep<T>(value: T | undefined, name: string): asserts value is T {
	if (value === undefined) {
		throw new Error(`前のテストで ${name} が設定されていません（カスケード失敗）`);
	}
}

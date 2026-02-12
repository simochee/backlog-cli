import { type CliJsonResult, type CliResult, type RunOptions, runCli } from "./cli.ts";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 5000;

function isRateLimited(result: CliResult): boolean {
	const output = `${result.stdout} ${result.stderr}`.toLowerCase();
	return (
		result.exitCode !== 0 &&
		(output.includes("429") || output.includes("rate limit") || output.includes("too many requests"))
	);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export async function runCliWithRetry(args: string[], options?: RunOptions): Promise<CliResult> {
	let lastResult: CliResult | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		const result = await runCli(args, options);
		if (!isRateLimited(result)) {
			return result;
		}
		lastResult = result;
		if (attempt < MAX_RETRIES) {
			const delay = BASE_DELAY_MS * 2 ** attempt;
			await sleep(delay);
		}
	}

	return lastResult!;
}

export async function runCliJsonWithRetry<T = unknown>(
	args: string[],
	options?: RunOptions,
): Promise<CliJsonResult<T>> {
	const jsonArgs = args.includes("--json") ? args : [...args, "--json"];

	// Rate limit リトライのみ行い、JSON パースエラーはリトライしない
	const result = await runCliWithRetry(jsonArgs, options);

	let data: T;
	try {
		data = JSON.parse(result.stdout) as T;
	} catch {
		throw new Error(
			`Failed to parse JSON from CLI output.\nCommand: bl ${jsonArgs.join(" ")}\nExit code: ${result.exitCode}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`,
		);
	}

	return { ...result, data };
}

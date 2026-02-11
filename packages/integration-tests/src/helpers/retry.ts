import { type CliJsonResult, type CliResult, type RunOptions, runCli, runCliJson } from "./cli.ts";

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
	let lastError: Error | undefined;

	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			const result = await runCliJson<T>(args, options);
			if (!isRateLimited(result)) {
				return result;
			}
			if (attempt < MAX_RETRIES) {
				const delay = BASE_DELAY_MS * 2 ** attempt;
				await sleep(delay);
			}
			lastError = new Error(`Rate limited after ${MAX_RETRIES} retries: bl ${args.join(" ")}`);
		} catch (error) {
			lastError = error as Error;
			if (attempt < MAX_RETRIES) {
				const delay = BASE_DELAY_MS * 2 ** attempt;
				await sleep(delay);
			}
		}
	}

	throw lastError ?? new Error(`Failed after ${MAX_RETRIES} retries: bl ${args.join(" ")}`);
}

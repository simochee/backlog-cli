import { spawn } from "node:child_process";

const CLI_ENTRY = `${import.meta.dirname}/../../../cli/src/index.ts`;

export interface RunOptions {
	env?: Record<string, string>;
	timeout?: number;
}

export interface CliResult {
	stdout: string;
	stderr: string;
	exitCode: number;
}

export interface CliJsonResult<T = unknown> {
	stdout: string;
	stderr: string;
	exitCode: number;
	data: T;
}

export async function runCli(args: string[], options?: RunOptions): Promise<CliResult> {
	const timeout = options?.timeout ?? 30_000;

	return new Promise<CliResult>((resolve, reject) => {
		const proc = spawn("bun", [CLI_ENTRY, "--no-input", ...args], {
			env: {
				...process.env,
				...options?.env,
			},
			stdio: ["ignore", "pipe", "pipe"],
		});

		const stdoutChunks: Buffer[] = [];
		const stderrChunks: Buffer[] = [];

		proc.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
		proc.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

		const timer = setTimeout(() => {
			proc.kill();
			reject(new Error(`CLI timed out after ${timeout}ms: bl ${args.join(" ")}`));
		}, timeout);

		proc.on("close", (code) => {
			clearTimeout(timer);
			resolve({
				stdout: Buffer.concat(stdoutChunks).toString().trim(),
				stderr: Buffer.concat(stderrChunks).toString().trim(),
				exitCode: code ?? 1,
			});
		});

		proc.on("error", (err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
}

export async function runCliJson<T = unknown>(args: string[], options?: RunOptions): Promise<CliJsonResult<T>> {
	const jsonArgs = args.includes("--json") ? args : [...args, "--json"];
	const result = await runCli(jsonArgs, options);

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

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

export function runCli(args: string[], options?: RunOptions): Promise<CliResult> {
	const timeout = options?.timeout ?? 30_000;

	return new Promise<CliResult>((resolve, reject) => {
		const proc = spawn("bun", [CLI_ENTRY, "--no-input", ...args], {
			env: { ...process.env, ...options?.env },
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";

		proc.stdout.on("data", (chunk: Buffer) => {
			stdout += chunk.toString();
		});

		proc.stderr.on("data", (chunk: Buffer) => {
			stderr += chunk.toString();
		});

		const timer = setTimeout(() => {
			proc.kill();
			reject(new Error(`CLI timed out after ${timeout}ms: bl ${args.join(" ")}`));
		}, timeout);

		proc.on("close", (exitCode) => {
			clearTimeout(timer);
			resolve({
				stdout: stdout.trim(),
				stderr: stderr.trim(),
				exitCode: exitCode ?? 1,
			});
		});

		proc.on("error", (error) => {
			clearTimeout(timer);
			reject(error);
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

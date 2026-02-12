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

	const proc = Bun.spawn(["bun", CLI_ENTRY, "--no-input", ...args], {
		env: { ...process.env, ...options?.env },
		stdin: "ignore",
		stdout: "pipe",
		stderr: "pipe",
	});

	let timer: Timer;
	const timeoutPromise = new Promise<never>((_, reject) => {
		timer = setTimeout(() => {
			proc.kill();
			reject(new Error(`CLI timed out after ${timeout}ms: bl ${args.join(" ")}`));
		}, timeout);
	});

	try {
		const [stdout, stderr, exitCode] = await Promise.race([
			Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]),
			timeoutPromise,
		]);

		return {
			stdout: stdout.trim(),
			stderr: stderr.trim(),
			exitCode,
		};
	} finally {
		clearTimeout(timer!);
	}
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

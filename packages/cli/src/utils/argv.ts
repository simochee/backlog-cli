/**
 * Pre-extract `--space` / `-s` from argv before citty processes it.
 *
 * citty does not pass parent command args to subcommands, so we extract
 * `--space` early and inject it via `process.env.BACKLOG_SPACE`.
 */
export function extractSpaceArg(argv: string[]): { space: string | undefined; argv: string[] } {
	const result: string[] = [];
	let space: string | undefined;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i] as string;

		if (arg === "--space" || arg === "-s") {
			space = argv[++i];
		} else if (arg.startsWith("--space=")) {
			space = arg.slice("--space=".length);
		} else if (arg.startsWith("-s=")) {
			space = arg.slice("-s=".length);
		} else {
			result.push(arg);
		}
	}

	return { space, argv: result };
}

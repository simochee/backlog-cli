import { runCli } from "./helpers/cli.ts";
import { validateEnv } from "./helpers/env.ts";

validateEnv();

const result = await runCli(["space", "info", "--json"]);
if (result.exitCode !== 0) {
	throw new Error(
		`API connectivity check failed.\nMake sure BACKLOG_SPACE and BACKLOG_API_KEY are correct.\nStderr: ${result.stderr}`,
	);
}

try {
	const spaceInfo = JSON.parse(result.stdout);
	console.log(`Integration tests connected to space: ${spaceInfo.spaceKey ?? "unknown"}`);
} catch {
	throw new Error(`API returned invalid JSON.\nStdout: ${result.stdout}\nStderr: ${result.stderr}`);
}

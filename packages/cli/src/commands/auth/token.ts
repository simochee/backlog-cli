import { resolveSpace } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "token",
		description: "Print the auth token to stdout",
	},
	args: {
		space: {
			type: "string",
			alias: "s",
			description: "Space hostname",
		},
	},
	async run({ args }) {
		const space = await resolveSpace(args.space);

		if (!space) {
			consola.error("No space configured. Run `backlog auth login` to authenticate.");
			return process.exit(1);
		}

		const token = space.auth.method === "api-key" ? space.auth.apiKey : space.auth.accessToken;

		// Write directly to stdout without any formatting for script usage
		process.stdout.write(token);
	},
});

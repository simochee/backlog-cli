import { resolveSpace } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "refresh",
		description: "Refresh OAuth token",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Target space hostname",
		},
	},
	async run({ args }) {
		const space = await resolveSpace(args.hostname);

		if (!space) {
			consola.error("No space configured. Run `backlog auth login` to authenticate.");
			return process.exit(1);
		}

		if (space.auth.method !== "oauth") {
			consola.error("Token refresh is only available for OAuth authentication. Current space uses API key.");
			return process.exit(1);
		}

		consola.error("OAuth token refresh is not yet implemented. Please re-authenticate with `backlog auth login`.");
		return process.exit(1);
	},
});

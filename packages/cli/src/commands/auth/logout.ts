import { loadConfig, removeSpace } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "logout",
		description: "Remove authentication for a Backlog space",
	},
	args: {
		space: {
			type: "string",
			description: "Space hostname to log out from",
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		let hostname = args.space || process.env["BACKLOG_SPACE"];
		if (!hostname) {
			if (config.spaces.length === 0) {
				consola.info("No spaces are currently authenticated.");
				return;
			}

			const firstSpace = config.spaces[0];
			if (config.spaces.length === 1 && firstSpace) {
				hostname = firstSpace.host;
			} else {
				hostname = await consola.prompt("Select a space to log out from:", {
					type: "select",
					options: config.spaces.map((s) => s.host),
				});

				if (typeof hostname !== "string" || !hostname) {
					consola.error("No space selected.");
					return process.exit(1);
				}
			}
		}

		try {
			await removeSpace(hostname);
		} catch {
			consola.error(`Space "${hostname}" is not configured.`);
			return process.exit(1);
		}

		consola.success(`Logged out of ${hostname}.`);
	},
});

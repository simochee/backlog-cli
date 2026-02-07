import { loadConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List all configuration values",
	},
	args: {
		hostname: {
			type: "string",
			description: "Filter by space hostname",
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		if (args.hostname) {
			const space = config.spaces.find((s) => s.host === args.hostname);
			if (!space) {
				consola.error(`Space "${args.hostname}" not found in configuration.`);
				return process.exit(1);
			}

			consola.log(`host=${space.host}`);
			consola.log(`auth.method=${space.auth.method}`);
			return;
		}

		if (config.defaultSpace) {
			consola.log(`default_space=${config.defaultSpace}`);
		}

		if (config.spaces.length > 0) {
			consola.log("");
			consola.log("Authenticated spaces:");
			for (const space of config.spaces) {
				const isDefault = config.defaultSpace === space.host;
				const label = isDefault ? `${space.host} (default)` : space.host;
				consola.log(`  ${label} [${space.auth.method}]`);
			}
		}
	},
});

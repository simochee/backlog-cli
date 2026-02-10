import { loadConfig, writeConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "switch",
		description: "Switch active space",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Space hostname to switch to",
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		let hostname = args.hostname;

		if (!hostname) {
			if (config.spaces.length === 0) {
				consola.error("No spaces configured. Run `bl auth login` to add a space.");
				return process.exit(1);
			}

			const hosts = config.spaces.map((s) => s.host);
			hostname = await consola.prompt("Select space:", {
				type: "select",
				options: hosts,
			});

			if (typeof hostname !== "string" || !hostname) {
				consola.error("No space selected.");
				return process.exit(1);
			}
		}

		const space = config.spaces.find((s) => s.host === hostname);

		if (!space) {
			consola.error(`Space "${hostname}" not found. Available spaces: ${config.spaces.map((s) => s.host).join(", ")}`);
			return process.exit(1);
		}

		await writeConfig({ ...config, defaultSpace: hostname });

		consola.success(`Switched active space to ${hostname}.`);
	},
});

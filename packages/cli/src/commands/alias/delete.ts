import { loadConfig, writeConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "delete",
		description: "Delete a command alias",
	},
	args: {
		name: {
			type: "positional",
			description: "Alias name",
			required: true,
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		const aliases: Record<string, string> =
			((config as Record<string, unknown>).aliases as Record<string, string>) ??
			{};

		if (!(args.name in aliases)) {
			consola.error(`Alias "${args.name}" not found.`);
			return process.exit(1);
		}

		delete aliases[args.name];

		await writeConfig({ ...config, aliases } as typeof config);

		consola.success(`Alias "${args.name}" deleted.`);
	},
});

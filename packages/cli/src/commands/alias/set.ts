import { loadConfig, writeConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "set",
		description: "Set a command alias",
	},
	args: {
		name: {
			type: "positional",
			description: "Alias name",
			required: true,
		},
		expansion: {
			type: "positional",
			description: "Command to expand to",
			required: true,
		},
		shell: {
			type: "boolean",
			description: "Register as a shell command",
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		const aliases: Record<string, string> =
			((config as Record<string, unknown>).aliases as Record<string, string>) ??
			{};

		const value = args.shell ? `!${args.expansion}` : args.expansion;
		aliases[args.name] = value;

		await writeConfig({ ...config, aliases } as typeof config);

		consola.success(`Alias "${args.name}" set to "${args.expansion}".`);
	},
});

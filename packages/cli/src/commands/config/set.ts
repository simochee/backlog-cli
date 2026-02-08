import { loadConfig, writeConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

/** Maps user-facing snake_case keys to internal camelCase config keys. */
const KEY_ALIASES: Record<string, string> = {
	default_space: "defaultSpace",
};

/** Keys that can be modified via `config set`. */
export const WRITABLE_KEYS = new Set(["defaultSpace"]);

export const resolveKey = (key: string): string => KEY_ALIASES[key] ?? key;

export default defineCommand({
	meta: {
		name: "set",
		description: "Set a configuration value",
	},
	args: {
		key: {
			type: "positional",
			description: "Config key",
			required: true,
		},
		value: {
			type: "positional",
			description: "Config value",
			required: true,
		},
		hostname: {
			type: "string",
			description: "Set space-specific config",
		},
	},
	async run({ args }) {
		if (args.hostname) {
			consola.error("Space-specific config is managed by `backlog auth` commands.");
			return process.exit(1);
		}

		const resolvedKey = resolveKey(args.key);

		if (!WRITABLE_KEYS.has(resolvedKey)) {
			consola.error(`Unknown or read-only config key: ${args.key}`);
			consola.info(
				`Writable keys: ${[...WRITABLE_KEYS]
					.map((k) => {
						const alias = Object.entries(KEY_ALIASES).find(([, v]) => v === k);
						return alias ? alias[0] : k;
					})
					.join(", ")}`,
			);
			return process.exit(1);
		}

		const config = await loadConfig();

		if (resolvedKey === "defaultSpace") {
			const space = config.spaces.find((s) => s.host === args.value);
			if (!space) {
				consola.error(`Space "${args.value}" is not authenticated. Run \`backlog auth login\` first.`);
				return process.exit(1);
			}
			await writeConfig({ ...config, defaultSpace: args.value });
		}

		consola.success(`Set ${args.key} to ${args.value}`);
	},
});

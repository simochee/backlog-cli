import { loadConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";

/** Maps user-facing snake_case keys to internal camelCase config keys. */
const KEY_ALIASES: Record<string, string> = {
	default_space: "defaultSpace",
};

export const resolveKey = (key: string): string => KEY_ALIASES[key] ?? key;

export default defineCommand({
	meta: {
		name: "get",
		description: "Get a configuration value",
	},
	args: {
		key: {
			type: "positional",
			description: "Config key (e.g., default_space, pager)",
			required: true,
		},
		hostname: {
			type: "string",
			description: "Get space-specific config",
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

			const value = getNestedValue(space, args.key);
			if (value === undefined) {
				return;
			}
			consola.log(String(value));
			return;
		}

		const resolvedKey = resolveKey(args.key);
		const value = getNestedValue(config, resolvedKey);
		if (value === undefined) {
			return;
		}

		if (typeof value === "object") {
			consola.log(JSON.stringify(value));
		} else {
			consola.log(String(value));
		}
	},
});

export function getNestedValue(
	obj: Record<string, unknown>,
	path: string,
): unknown {
	return path.split(".").reduce<unknown>((current, key) => {
		if (current != null && typeof current === "object" && key in current) {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

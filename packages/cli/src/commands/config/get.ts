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
		space: {
			type: "string",
			description: "Get space-specific config",
		},
	},
	async run({ args }) {
		const config = await loadConfig();

		const filterSpace = args.space || process.env["BACKLOG_SPACE"];
		if (filterSpace) {
			const space = config.spaces.find((s) => s.host === filterSpace);
			if (!space) {
				consola.error(`Space "${filterSpace}" not found in configuration.`);
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

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	return path.split(".").reduce<unknown>((current, key) => {
		if (current != null && typeof current === "object" && key in current) {
			return (current as Record<string, unknown>)[key];
		}
	}, obj);
}

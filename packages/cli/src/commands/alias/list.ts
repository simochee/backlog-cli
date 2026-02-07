import { loadConfig } from "@repo/config";
import { defineCommand } from "citty";
import consola from "consola";
import { padEnd } from "#utils/format.ts";

export default defineCommand({
	meta: {
		name: "list",
		description: "List command aliases",
	},
	args: {},
	async run() {
		const config = await loadConfig();

		const aliases: Record<string, string> =
			((config as Record<string, unknown>).aliases as Record<string, string>) ??
			{};

		const entries = Object.entries(aliases);

		if (entries.length === 0) {
			consola.info("No aliases configured.");
			return;
		}

		const header = `${padEnd("ALIAS", 20)}EXPANSION`;
		consola.log(header);
		for (const [name, expansion] of entries) {
			consola.log(`${padEnd(name, 20)}${expansion}`);
		}
	},
});

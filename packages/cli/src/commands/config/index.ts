import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "config",
		description: "Manage CLI configuration",
	},
	subCommands: {
		get: () => import("./get.ts").then((m) => m.default),
		set: () => import("./set.ts").then((m) => m.default),
		list: () => import("./list.ts").then((m) => m.default),
	},
});

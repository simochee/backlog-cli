import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "alias",
		description: "Manage command aliases",
	},
	subCommands: {
		set: () => import("./set.ts").then((m) => m.default),
		list: () => import("./list.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
	},
});

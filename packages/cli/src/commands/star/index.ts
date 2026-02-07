import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "star",
		description: "Manage stars",
	},
	subCommands: {
		add: () => import("./add.ts").then((m) => m.default),
		list: () => import("./list.ts").then((m) => m.default),
		count: () => import("./count.ts").then((m) => m.default),
	},
});

import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "project",
		description: "Manage projects",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		activities: () => import("./activities.ts").then((m) => m.default),
	},
});

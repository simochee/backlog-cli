import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "user",
		description: "Manage users",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		me: () => import("./me.ts").then((m) => m.default),
		activities: () => import("./activities.ts").then((m) => m.default),
	},
});

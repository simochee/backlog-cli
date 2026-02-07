import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "webhook",
		description: "Manage webhooks",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		create: () => import("./create.ts").then((m) => m.default),
		edit: () => import("./edit.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
	},
});

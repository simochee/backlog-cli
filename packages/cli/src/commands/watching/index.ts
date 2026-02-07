import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "watching",
		description: "Manage watchings",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		add: () => import("./add.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
		read: () => import("./read.ts").then((m) => m.default),
	},
});

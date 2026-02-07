import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "wiki",
		description: "Manage wiki pages",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		create: () => import("./create.ts").then((m) => m.default),
		edit: () => import("./edit.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
		count: () => import("./count.ts").then((m) => m.default),
		tags: () => import("./tags.ts").then((m) => m.default),
		history: () => import("./history.ts").then((m) => m.default),
		attachments: () => import("./attachments.ts").then((m) => m.default),
	},
});

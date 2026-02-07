import type { BacklogProject } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a project",
	},
	args: {
		name: {
			type: "string",
			alias: "n",
			description: "Project name",
		},
		key: {
			type: "string",
			alias: "k",
			description: "Project key (uppercase letters)",
		},
		"chart-enabled": {
			type: "boolean",
			description: "Enable chart",
		},
		"subtasking-enabled": {
			type: "boolean",
			description: "Enable subtasking",
		},
		"project-leader-can-edit-project-leader": {
			type: "boolean",
			description: "Allow project leader to edit project leader",
		},
		"text-formatting-rule": {
			type: "string",
			description: "Text formatting rule: markdown or backlog",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		let name = args.name;
		let key = args.key;

		if (!name) {
			name = await consola.prompt("Project name:", { type: "text" });
			if (typeof name !== "string" || !name) {
				consola.error("Project name is required.");
				return process.exit(1);
			}
		}

		if (!key) {
			key = await consola.prompt("Project key:", { type: "text" });
			if (typeof key !== "string" || !key) {
				consola.error("Project key is required.");
				return process.exit(1);
			}
		}

		const body: Record<string, unknown> = {
			name,
			key,
			chartEnabled: args["chart-enabled"] ?? false,
			subtaskingEnabled: args["subtasking-enabled"] ?? false,
			projectLeaderCanEditProjectLeader:
				args["project-leader-can-edit-project-leader"] ?? false,
			textFormattingRule: args["text-formatting-rule"] ?? "markdown",
		};

		const project = await client<BacklogProject>("/projects", {
			method: "POST",
			body,
		});

		consola.success(`Created project ${project.projectKey}: ${project.name}`);
	},
});

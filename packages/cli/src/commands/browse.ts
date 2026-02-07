import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "browse",
		description: "Open Backlog in the browser",
	},
	args: {
		target: {
			type: "positional",
			description: "Issue key or path to open",
		},
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
		},
		issues: {
			type: "boolean",
			description: "Open issues list",
		},
		wiki: {
			type: "boolean",
			description: "Open wiki",
		},
		git: {
			type: "boolean",
			description: "Open Git repositories page",
		},
		settings: {
			type: "boolean",
			description: "Open project settings",
		},
	},
	async run({ args }) {
		const { host } = await getClient();

		let url: string;

		if (args.target) {
			// If target looks like an issue key (e.g., PROJECT-123), open the issue
			if (/^[A-Z][A-Z0-9_]+-\d+$/.test(args.target)) {
				url = `https://${host}/view/${args.target}`;
			} else {
				// Treat as a path
				url = `https://${host}/${args.target}`;
			}
		} else if (args.project) {
			if (args.issues) {
				url = `https://${host}/find/${args.project}`;
			} else if (args.wiki) {
				url = `https://${host}/wiki/${args.project}`;
			} else if (args.git) {
				url = `https://${host}/git/${args.project}`;
			} else if (args.settings) {
				url = `https://${host}/EditProject.action?project.key=${args.project}`;
			} else {
				url = `https://${host}/projects/${args.project}`;
			}
		} else {
			url = `https://${host}/dashboard`;
		}

		consola.info(`Opening ${url}`);
		Bun.spawn(["open", url]);
	},
});

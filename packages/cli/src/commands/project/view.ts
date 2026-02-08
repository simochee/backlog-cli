import type { BacklogProject } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { openUrl, projectUrl } from "#utils/url.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "view",
		description: "View project details",
	},
	args: {
		projectKey: {
			type: "positional",
			description: "Project key",
			required: true,
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	async run({ args }) {
		const { client, host } = await getClient();

		const project = await client<BacklogProject>(`/projects/${args.projectKey}`);

		if (args.web) {
			const url = projectUrl(host, project.projectKey);
			consola.info(`Opening ${url}`);
			await openUrl(url);
			return;
		}

		consola.log("");
		consola.log(`  ${project.name} (${project.projectKey})`);
		consola.log("");
		consola.log(`    Status:              ${project.archived ? "Archived" : "Active"}`);
		consola.log(`    Text Formatting:     ${project.textFormattingRule}`);
		consola.log(`    Chart Enabled:       ${project.chartEnabled ? "Yes" : "No"}`);
		consola.log(`    Subtasking Enabled:  ${project.subtaskingEnabled ? "Yes" : "No"}`);
		consola.log(`    Wiki:                ${project.useWiki ? "Yes" : "No"}`);
		consola.log(`    File Sharing:        ${project.useFileSharing ? "Yes" : "No"}`);
		consola.log(`    Dev Attributes:      ${project.useDevAttributes ? "Yes" : "No"}`);
		consola.log("");
	},
});

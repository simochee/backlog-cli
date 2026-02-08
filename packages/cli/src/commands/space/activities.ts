import type { BacklogActivity } from "@repo/api";
import type { SpacesGetActivitiesData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { formatDate, getActivityLabel, padEnd } from "#utils/format.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "activities",
		description: "Show space activities",
	},
	args: {
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
		"activity-type": {
			type: "string",
			description: "Activity type IDs (comma-separated)",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const query: NonNullable<SpacesGetActivitiesData["query"]> & Record<string, unknown> = {
			count: Number.parseInt(args.limit, 10),
		};

		if (args["activity-type"]) {
			query["activityTypeId[]"] = args["activity-type"].split(",").map((id) => Number.parseInt(id.trim(), 10));
		}

		const activities = await client<BacklogActivity[]>("/space/activities", {
			query,
		});

		if (activities.length === 0) {
			consola.info("No activities found.");
			return;
		}

		const header = `${padEnd("ID", 12)}${padEnd("TYPE", 24)}${padEnd("DATE", 12)}PROJECT`;
		consola.log(header);
		for (const activity of activities) {
			const id = padEnd(`${activity.id}`, 12);
			const type = padEnd(getActivityLabel(activity.type), 24);
			const date = padEnd(formatDate(activity.created), 12);
			const project = activity.project.projectKey;
			consola.log(`${id}${type}${date}${project}`);
		}
	},
});

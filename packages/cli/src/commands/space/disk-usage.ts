import type { BacklogSpaceDiskUsage } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { defineCommand } from "citty";
import consola from "consola";

/**
 * Formats a byte count into a human-readable string.
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = bytes / 1024 ** i;
	return `${value.toFixed(1)} ${units[i]}`;
}

export default defineCommand({
	meta: {
		name: "disk-usage",
		description: "Show space disk usage",
	},
	args: {
		...outputArgs,
	},
	async run({ args }) {
		const { client } = await getClient();

		const usage = await client<BacklogSpaceDiskUsage>("/space/diskUsage");

		outputResult(usage, args, (data) => {
			const total = data.issue + data.wiki + data.file + data.subversion + data.git + data.gitLFS + data.pullRequest;

			consola.log("");
			consola.log("  Disk Usage");
			consola.log("");
			consola.log(`    Capacity:       ${formatBytes(data.capacity)}`);
			consola.log(`    Used:           ${formatBytes(total)}`);
			consola.log("");
			consola.log(`    Issue:          ${formatBytes(data.issue)}`);
			consola.log(`    Wiki:           ${formatBytes(data.wiki)}`);
			consola.log(`    File:           ${formatBytes(data.file)}`);
			consola.log(`    Subversion:     ${formatBytes(data.subversion)}`);
			consola.log(`    Git:            ${formatBytes(data.git)}`);
			consola.log(`    Git LFS:        ${formatBytes(data.gitLFS)}`);
			consola.log(`    Pull Request:   ${formatBytes(data.pullRequest)}`);
			consola.log("");
		});
	},
});

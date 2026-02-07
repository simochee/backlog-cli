import { type BacklogSpaceDiskUsage } from "@repo/api";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

/**
 * Formats a byte count into a human-readable string.
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) {
		return "0 B";
	}
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
	args: {},
	async run() {
		const { client } = await getClient();

		const usage = await client<BacklogSpaceDiskUsage>("/space/diskUsage");

		const total =
			usage.issue +
			usage.wiki +
			usage.file +
			usage.subversion +
			usage.git +
			usage.gitLFS +
			usage.pullRequest;

		consola.log("");
		consola.log("  Disk Usage");
		consola.log("");
		consola.log(`    Capacity:       ${formatBytes(usage.capacity)}`);
		consola.log(`    Used:           ${formatBytes(total)}`);
		consola.log("");
		consola.log(`    Issue:          ${formatBytes(usage.issue)}`);
		consola.log(`    Wiki:           ${formatBytes(usage.wiki)}`);
		consola.log(`    File:           ${formatBytes(usage.file)}`);
		consola.log(`    Subversion:     ${formatBytes(usage.subversion)}`);
		consola.log(`    Git:            ${formatBytes(usage.git)}`);
		consola.log(`    Git LFS:        ${formatBytes(usage.gitLFS)}`);
		consola.log(`    Pull Request:   ${formatBytes(usage.pullRequest)}`);
		consola.log("");
	},
});

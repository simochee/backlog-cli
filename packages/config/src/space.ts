import type { RcSpace } from "#types.ts";

import { loadConfig, writeConfig } from "#config.ts";

/**
 * Adds a new Backlog space to the configuration.
 *
 * @param space - The space configuration to add.
 * @throws {Error} If a space with the same host already exists.
 */
export const addSpace = async (space: typeof RcSpace.infer): Promise<void> => {
	const config = await loadConfig();
	const exists = config.spaces.some((s) => s.host === space.host);

	if (exists) {
		throw new Error(`Space with host "${space.host}" already exists in configuration.`);
	}

	await writeConfig({
		...config,
		spaces: [...config.spaces, space],
	});
};

/**
 * Removes a Backlog space from the configuration.
 *
 * @param host - The host identifier of the space to remove.
 * @throws {Error} If no space with the specified host exists.
 */
export const removeSpace = async (host: string): Promise<void> => {
	const config = await loadConfig();
	const index = config.spaces.findIndex((space) => space.host === host);

	if (index === -1) {
		throw new Error(`Space with host "${host}" not found in configuration.`);
	}

	const spaces = config.spaces.filter((space) => space.host !== host);
	const defaultSpace = config.defaultSpace === host ? undefined : config.defaultSpace;

	await writeConfig({ ...config, spaces, defaultSpace });
};

/**
 * Updates the auth configuration for an existing space.
 *
 * @param host - The host identifier of the space to update.
 * @param auth - The new auth configuration.
 * @throws {Error} If no space with the specified host exists.
 */
export const updateSpaceAuth = async (host: string, auth: typeof RcSpace.infer.auth): Promise<void> => {
	const config = await loadConfig();
	const index = config.spaces.findIndex((space) => space.host === host);
	const space = config.spaces[index];

	if (index === -1 || space == null) {
		throw new Error(`Space with host "${host}" not found in configuration.`);
	}

	await writeConfig({
		...config,
		spaces: config.spaces.with(index, { ...space, auth }),
	});
};

/**
 * Finds a space from the spaces array by host, supporting shorthand names.
 *
 * Resolution order:
 * 1. Exact match on host (backward compatible)
 * 2. Prefix match: `space.host.startsWith(input + ".")`
 *    - If exactly one match: return it
 *    - If multiple matches: throw an ambiguity error with candidates
 *    - If no match: return null
 *
 * @param spaces - The array of configured spaces.
 * @param host - The host or shorthand space name to search for.
 * @returns The matched space, or null if not found.
 * @throws {Error} If the shorthand matches multiple spaces (ambiguous).
 */
export const findSpace = (spaces: readonly (typeof RcSpace.infer)[], host: string): typeof RcSpace.infer | null => {
	const exactMatch = spaces.find((s) => s.host === host);
	if (exactMatch) return exactMatch;

	const prefixMatches = spaces.filter((s) => s.host.startsWith(`${host}.`));

	const [singleMatch] = prefixMatches;
	if (singleMatch && prefixMatches.length === 1) {
		return singleMatch;
	}

	if (prefixMatches.length > 1) {
		const candidates = prefixMatches.map((s) => s.host).join(", ");
		throw new Error(`Ambiguous space name "${host}". Matching spaces: ${candidates}`);
	}

	return null;
};

/**
 * Resolves which Backlog space to use based on priority:
 * 1. Explicit host argument (--space flag)
 * 2. BACKLOG_SPACE environment variable
 * 3. defaultSpace in config
 *
 * Supports shorthand space names (e.g., "myspace" matches "myspace.backlog.com").
 *
 * @param explicitHost - Host specified via --space flag.
 * @returns The resolved space configuration, or null if none found.
 * @throws {Error} If the shorthand matches multiple spaces (ambiguous).
 */
export const resolveSpace = async (explicitHost?: string): Promise<typeof RcSpace.infer | null> => {
	const config = await loadConfig();
	const host = explicitHost ?? process.env["BACKLOG_SPACE"] ?? config.defaultSpace;

	if (!host) return null;

	return findSpace(config.spaces, host);
};

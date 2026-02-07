import { loadConfig, writeConfig } from "#config.ts";
import type { RcSpace } from "#types.ts";

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
		throw new Error(
			`Space with host "${space.host}" already exists in configuration.`,
		);
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
	const defaultSpace =
		config.defaultSpace === host ? undefined : config.defaultSpace;

	await writeConfig({ ...config, spaces, defaultSpace });
};

/**
 * Updates the auth configuration for an existing space.
 *
 * @param host - The host identifier of the space to update.
 * @param auth - The new auth configuration.
 * @throws {Error} If no space with the specified host exists.
 */
export const updateSpaceAuth = async (
	host: string,
	auth: typeof RcSpace.infer.auth,
): Promise<void> => {
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
 * Resolves which Backlog space to use based on priority:
 * 1. Explicit host argument (--space flag)
 * 2. BACKLOG_SPACE environment variable
 * 3. defaultSpace in config
 *
 * @param explicitHost - Host specified via --space flag.
 * @returns The resolved space configuration, or null if none found.
 */
export const resolveSpace = async (
	explicitHost?: string,
): Promise<typeof RcSpace.infer | null> => {
	const config = await loadConfig();
	const host = explicitHost ?? process.env.BACKLOG_SPACE ?? config.defaultSpace;

	if (!host) return null;

	return config.spaces.find((s) => s.host === host) ?? null;
};

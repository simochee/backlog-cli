import { loadConfig, writeConfig } from "#config.ts";
import type { RcSpace } from "#types.ts";

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

export const patchSpaceAccessToken = async (
	host: string,
	accessToken: string,
): Promise<void> => {
	const config = await loadConfig();
	const index = config.spaces.findIndex((space) => space.host === host);
	const space = config.spaces[index];

	if (index === -1 || space == null) {
		throw new Error(`Space with host "${host}" not found in configuration.`);
	}

	await writeConfig({
		...config,
		spaces: config.spaces.with(index, {
			...space,
			auth: {
				...space.auth,
				accessToken,
			},
		}),
	});
};

import { regex } from "arkregex";
import { type } from "arktype";
import { readUser, writeUser } from "rc9";

const APP_NAME = "backlog";

const RcSpace = type({
	host: regex("^[a-z0-9-]+\\.backlog\\.(com|jp)$"),
	auth: {
		accessToken: "string",
		refreshToken: "string",
	},
});

const Rc = type({
	spaces: type
		.scope({ RcSpace })
		.type("RcSpace[]")
		.default(() => []),
});

const loadConfig = async (): Promise<typeof Rc.infer> => {
	const rc = await readUser({ name: APP_NAME });
	const result = Rc(rc);

	if (result instanceof type.errors) {
		console.error("Configuration Error:");
		console.error(result.summary);

		process.exit(1);
	}

	return result;
};

const writeConfig = async (config: typeof Rc.infer): Promise<void> => {
	await writeUser(config, { name: APP_NAME });
};

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

export const config = await loadConfig();

export type Config = typeof Rc.infer;

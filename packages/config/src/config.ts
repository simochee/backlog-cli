import { type } from "arktype";
import { readUser, writeUser } from "rc9";
import { Rc } from "#types.ts";

const APP_NAME = "backlog";

/**
 * Loads and validates the user configuration from the rc file.
 *
 * @returns The validated configuration object.
 * @throws Exits process with code 1 if configuration validation fails.
 */
export const loadConfig = async (): Promise<typeof Rc.infer> => {
	const rc = await readUser({ name: APP_NAME });
	const result = Rc(rc);

	if (result instanceof type.errors) {
		console.error("Configuration Error:");
		console.error(result.summary);

		process.exit(1);
	}

	return result;
};

/**
 * Writes the configuration to the user's rc file.
 *
 * @param config - The configuration object to persist.
 */
export const writeConfig = async (config: typeof Rc.infer): Promise<void> => {
	await writeUser(config, { name: APP_NAME });
};

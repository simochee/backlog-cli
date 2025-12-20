import { type } from "arktype";
import { readUser, writeUser } from "rc9";
import { Rc } from "#types.ts";

const APP_NAME = "backlog";

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

export const writeConfig = async (config: typeof Rc.infer): Promise<void> => {
	await writeUser(config, { name: APP_NAME });
};

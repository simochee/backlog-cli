import consola from "consola";

/**
 * Prompts the user for a required text input if not already provided.
 *
 * Returns the existing value if non-empty, otherwise shows an interactive prompt.
 * Exits with code 1 if the user provides no value.
 *
 * @param label - The prompt label shown to the user (e.g., "Project key:").
 * @param existing - The value already provided via CLI argument.
 * @returns The resolved non-empty string value.
 */
export default async function promptRequired(label: string, existing?: string): Promise<string> {
	if (existing) {
		return existing;
	}

	const value = await consola.prompt(label, { type: "text" });

	if (typeof value !== "string" || !value) {
		consola.error(`${label.replace(/:$/, "")} is required.`);
		return process.exit(1);
	}

	return value;
}

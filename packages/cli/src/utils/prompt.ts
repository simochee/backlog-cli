import consola from "consola";

/**
 * Prompts the user for a required text input if not already provided.
 *
 * Returns the existing value if non-empty, otherwise shows an interactive prompt.
 * Exits with code 1 if the user provides no value.
 *
 * @param label - The prompt label shown to the user (e.g., "Project key:").
 * @param existing - The value already provided via CLI argument.
 * @param options - Additional options passed to `consola.prompt` (e.g., `placeholder`).
 * @returns The resolved non-empty string value.
 */
export default async function promptRequired(
	label: string,
	existing?: string,
	options?: { placeholder?: string },
): Promise<string> {
	if (existing) {
		return existing;
	}

	const value = await consola.prompt(label, { type: "text", ...options });

	if (typeof value !== "string" || !value) {
		consola.error(`${label.replace(/:$/, "")} is required.`);
		return process.exit(1);
	}

	return value;
}

/**
 * Prompts the user for confirmation before a destructive action.
 *
 * Returns `true` immediately if confirmation is already given via `skipConfirm`.
 * Otherwise, shows an interactive confirm prompt. Logs "Cancelled." and returns
 * `false` if the user declines.
 *
 * @param message - The confirmation message shown to the user.
 * @param skipConfirm - Whether to skip the prompt (e.g., `--confirm` or `--yes` flag).
 * @returns `true` if the action should proceed, `false` otherwise.
 */
export async function confirmOrExit(message: string, skipConfirm?: boolean): Promise<boolean> {
	if (skipConfirm) return true;

	const confirmed = await consola.prompt(message, { type: "confirm" });

	if (!confirmed) {
		consola.info("Cancelled.");
		return false;
	}

	return true;
}

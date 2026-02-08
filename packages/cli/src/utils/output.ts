/**
 * Shared output formatting utilities for `--json` flag support.
 *
 * Each command opts in by spreading `outputArgs` into its `args` definition
 * and wrapping its display logic with `outputResult()`.
 */

/**
 * Common `--json` flag definition to spread into command args.
 *
 * @example
 * ```ts
 * args: {
 *   ...outputArgs,
 *   // other args
 * }
 * ```
 */
export const outputArgs = {
	json: {
		type: "string" as const,
		description: "Output as JSON (optionally filter by field names, comma-separated)",
	},
} as const;

/**
 * Resolves a dot-separated path to a nested value.
 *
 * @example
 * ```ts
 * getNestedValue({ a: { b: 1 } }, "a.b") // => 1
 * getNestedValue({ a: { b: 1 } }, "a")   // => { b: 1 }
 * getNestedValue({ a: null }, "a.b")      // => undefined
 * ```
 */
export function getNestedValue(obj: unknown, path: string): unknown {
	const keys = path.split(".");
	let current: unknown = obj;
	for (const key of keys) {
		if (typeof current !== "object" || current === null) return undefined;
		if (!(key in current)) return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

/**
 * Sets a value at a dot-separated path in a nested object, creating intermediate objects as needed.
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
	const keys = path.split(".");
	let current: Record<string, unknown> = obj;
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
			current[key] = {};
		}
		current = current[key] as Record<string, unknown>;
	}
	current[keys.at(-1)!] = value;
}

/**
 * Picks specified fields from a plain object.
 * Supports dot notation for nested field access (e.g. "updatedUser.name").
 */
export function pickFields(obj: unknown, fields: string[]): Record<string, unknown> {
	if (typeof obj !== "object" || obj === null) return {};
	const result: Record<string, unknown> = {};
	for (const field of fields) {
		const value = getNestedValue(obj, field);
		if (value !== undefined) {
			setNestedValue(result, field, value);
		}
	}
	return result;
}

/**
 * Filters data to include only the specified fields.
 * Works on both single objects and arrays.
 */
export function filterFields<T>(data: T, fields: string[]): unknown {
	if (Array.isArray(data)) {
		return data.map((item) => pickFields(item, fields));
	}
	return pickFields(data, fields);
}

/**
 * Outputs structured data based on the `--json` flag.
 *
 * - No `--json`: calls `defaultFormat` for human-readable output
 * - `--json` (no value): outputs full JSON
 * - `--json field1,field2`: outputs JSON filtered to specified fields
 *
 * JSON is pretty-printed when stdout is a TTY, compact otherwise.
 */
export function outputResult<T>(data: T, args: { json?: string }, defaultFormat: (data: T) => void): void {
	if (args.json === undefined) {
		defaultFormat(data);
		return;
	}

	const output = args.json
		? filterFields(
				data,
				args.json.split(",").map((f) => f.trim()),
			)
		: data;

	const json = process.stdout.isTTY ? JSON.stringify(output, null, 2) : JSON.stringify(output);

	process.stdout.write(`${json}\n`);
}

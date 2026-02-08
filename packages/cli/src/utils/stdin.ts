/**
 * Read all data from stdin and return it as a trimmed string.
 *
 * Collects chunks until the stream ends, then concatenates and trims whitespace.
 */
export default async function readStdin(): Promise<string> {
	const chunks: Uint8Array[] = [];
	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString("utf8").trim();
}

import type { Rc } from "#types.ts";
import { loadConfig } from "./config";

export const config = await loadConfig();

export type Config = typeof Rc.infer;

export { addSpace, patchSpaceAccessToken } from "./space";

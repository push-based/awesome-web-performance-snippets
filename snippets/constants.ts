import {Technique} from "./types";

export const SNIPPETS_ROOT = `./snippets`;
export const SNIPPETS_TEMPLATE_NAME = `SNIPPET_TEMPLATE`;
export const SNIPPETS_DIST = `./dist/snippets`;
export const NEW_LINE = "\r\n";
export const HOW_TO_START_REGEX = /(<!-- *START-HOW_TO\[)([a-z\-, ]*)(\] *-->)/g;
export const HOW_TO_START = (t: Technique[]) => `<!-- START-HOW_TO[${t.join(`,`)}] -->`;
export const HOW_TO_END = `<!-- END-HOW_TO -->`;

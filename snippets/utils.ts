import {join} from "path";
import {
    HOW_TO_END,
    HOW_TO_START,
    HOW_TO_START_REGEX,
    NEW_LINE,
    SNIPPETS_DIST,
    SNIPPETS_ROOT,
    SNIPPETS_TEMPLATE_NAME
} from "./constants";
import {readFileSync, writeFileSync} from "fs";
import {Technique} from "./types";

function wrapCollapse(title: string, content: string): string {
    return `<details>${NEW_LINE}
<summary>${title}</summary>${NEW_LINE}
${content}${NEW_LINE}
</details>${NEW_LINE}`
}

export function getUsabilityTable(techniques: Technique[]): string {
    let table = '';
    if (techniques?.length) {
        table += `
| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks) |      ${techniques.includes('bookmark') ? '✔' : '❌'}    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md) |      ${techniques.includes('console-tab') ? '✔' : '❌'}    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md) |      ${techniques.includes('sources-tab') ? '✔' : '❌'}    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)       |      ${techniques.includes('chromium') ? '✔' : '❌'}    |
    `
    }
    return table + NEW_LINE + NEW_LINE;
}

function wrapBookmarkIIFE(js: string): string {
    return `javascript:(() => {${js})()`;
}
function wrapJsMd(js: string): string {
    return `
\`\`\`javascript${NEW_LINE}
${js}
\`\`\` ${NEW_LINE}
${NEW_LINE}`;
}
export function toBookmarkSnippet(c: string, cfg?: {h: string}): string {
    const h = cfg?.h || '###';
    // @TODO add compression
    return `
${h} Bookmark Snippet${NEW_LINE}
${NEW_LINE}
${wrapCollapse('Copy this code snippet into the bookmark to use it', wrapJsMd(wrapBookmarkIIFE(c)))}
${NEW_LINE}
`;
}

export function toConsoleSnippet(c: string, cfg?: {h: string}): string {
    const h = cfg?.h || '###';
    return `
${h} Console Tab Snippet${NEW_LINE}
${NEW_LINE}
${wrapCollapse('Copy this code snippet into the DevTools console Tab to use it', wrapJsMd(c
        // @TODO the replace is a hack that should be fixed in the snippets:compile step in the tsconfig.json
        .replace('export {};', '')
    ))}
${NEW_LINE}
`;
}

export function updateSnippet(folder: string): void {
    const readmePath = join(SNIPPETS_ROOT, folder, 'Readme.md');
    const snippetPath = join(SNIPPETS_DIST, folder, 'index.js');

    let readmeContent: string = readFileSync(readmePath, 'utf8');
    if (readmeContent.trim() === '') {
        throw new Error(`${readmePath} is missing. Please use the snippet from ${SNIPPETS_TEMPLATE_NAME}`)
    }
    let snippetContent: string = readFileSync(snippetPath, 'utf8');
    if (snippetContent.trim() === '') {
        throw new Error(`${snippetPath} is missing. Did you run 'npm run snippets:compile'`)
    }

    const howToMatch = HOW_TO_START_REGEX.exec(readmeContent);
    const techniques = howToMatch ? howToMatch[2].split(',') as Technique[] : [];

    const table = getUsabilityTable(techniques);
    const bookmark = toBookmarkSnippet(snippetContent);
    const consoleTab = toConsoleSnippet(snippetContent);
    let out = table + bookmark + consoleTab + NEW_LINE;

    if (out !== '') {
        const [start, _s, _t, _e, rest_] = readmeContent.split(HOW_TO_START_REGEX) || [];
        if (rest_ === undefined) {
            throw new Error(`${readmePath} is missing the comments: "${HOW_TO_START(techniques)}" and ${HOW_TO_END}`)
        }
        const [_oldContent, end] = rest_?.split(HOW_TO_END);
        out = start +
            HOW_TO_START(techniques) + NEW_LINE + NEW_LINE +
            out +
            HOW_TO_END + NEW_LINE + NEW_LINE +
            end;
        writeFileSync(readmePath, out, 'utf8');
    }
}

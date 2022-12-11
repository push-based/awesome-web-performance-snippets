import {readdirSync, lstatSync, readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {
    NEW_LINE,
    HOW_TO_START,
    HOW_TO_END,
    HOW_TO_START_REGEX,
    SNIPPETS_ROOT,
    SNIPPETS_DIST,
    SNIPPETS_TEMPLATE_NAME
} from "./constants";
import {Technique} from "./types";

function getUsabilityTable(techniques: Technique[]): string {
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

function toBookmarkSnippet(c: string): string {
    // @TODO add compression
    return `
### Bookmark Snippet${NEW_LINE}
Copy this code snippet into the bookmark to use it.${NEW_LINE}
${NEW_LINE}
\`\`\`javascript${NEW_LINE}
javascript:(() => {${c})()
\`\`\` ${NEW_LINE}
${NEW_LINE}
`;
}

export function toConsoleSnippet(c: string): string {
    return `
### Console Tab Snippet${NEW_LINE}
Copy this code snippet into the DevTools console Tab to use it.${NEW_LINE}
${NEW_LINE}
\`\`\`javascript${NEW_LINE}
${c}
\`\`\` ${NEW_LINE}
${NEW_LINE}
`;
}

function updateSnippet(folder) {
    const readmePath = join(SNIPPETS_ROOT, folder, 'Readme.md');
    const snippetPath = join(SNIPPETS_DIST, 'index.js');

    let readmeContent: string = readFileSync(readmePath, 'utf8');
    if (readmeContent.trim() === '') {
        throw new Error(`${readmePath} is missing`)
    }
    let snippetContent: string = readFileSync(snippetPath, 'utf8');
    if (snippetContent.trim() === '') {
        throw new Error(`${snippetPath} is missing`)
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

(() => {
    const snippetsPath = SNIPPETS_ROOT;
    readdirSync(snippetsPath).filter(p => {
        const stats = lstatSync(p);
        return stats.isDirectory() && !p.includes(SNIPPETS_TEMPLATE_NAME)
    })
        .forEach(updateSnippet);

})();

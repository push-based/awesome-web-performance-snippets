import {loadSnippets, toBookletName} from "../chromium";
import {readFileSync, writeFileSync} from "fs";
import {NEW_LINE, SNIPPET_AREA_END, SNIPPET_AREA_START} from "./constants";
import {dirname} from "path";
import {SNIPPETS_DIST, toConsoleSnippet} from "../snippets";

(() => {
    let readmeContent: string = readFileSync('./Readme.md', 'utf8');
    const bookMarkContent: string = loadSnippets(SNIPPETS_DIST)
        .map(({fileName, javascript}) => {
            const title = toBookletName(dirname(fileName));
            const folder = fileName
                // split at wrong separator
                .split('\\')
                // remove file from path
                .slice(0, -1)
                // join with proper forward slash for url
                .join('/');

            const h2 = `## [${title}](https://github.com/push-based/web-performance-tools/tree/master/${folder})  ` + NEW_LINE;
            const snippet = toConsoleSnippet(javascript)
            return h2 + snippet + '  ' + NEW_LINE;
        }).join('');

    if (bookMarkContent !== '') {
        const [start, _] = readmeContent.split(SNIPPET_AREA_START);
        if (_ === undefined) {
            throw new Error(`./Readme.md is missing the comments: "${SNIPPET_AREA_START}" and ${SNIPPET_AREA_END}`)
        }
        const [content, end] = _.split(SNIPPET_AREA_END);
        readmeContent = start +
            SNIPPET_AREA_START + NEW_LINE + NEW_LINE +
            bookMarkContent +
            SNIPPET_AREA_END + NEW_LINE + NEW_LINE +
            end;
        writeFileSync('./Readme.md', readmeContent, 'utf8');
    }

})();

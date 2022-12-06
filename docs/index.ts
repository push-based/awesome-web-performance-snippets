import {loadSnippets, toBookletName} from "../chromium/bookmarks/utils";
import {SNIPPETS_DIR} from "../chromium/constants";
import {readFileSync, writeFileSync} from "fs";
import {NEW_LINE, SNIPPET_AREA_END, SNIPPET_AREA_START} from "./constants";
import {dirname} from "path";

(() => {
    let readmeContent: string = readFileSync('./Readme.md', 'utf8');
    const bookMarkContent: string = loadSnippets(SNIPPETS_DIR)
        .map(({fileName, javascript}) => {
            const h2 = `## [${toBookletName(dirname(fileName))}](https://github.com/push-based/web-performance-tools/tree/master/${fileName})  ` + NEW_LINE;
            const snippet = "```javascript  " + NEW_LINE + javascript + "```  " + NEW_LINE
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

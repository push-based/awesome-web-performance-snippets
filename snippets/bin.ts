import * as fs from "fs";
import * as path from "path";
import {SNIPPETS_ROOT, SNIPPETS_TEMPLATE_NAME} from "./constants";
import {updateSnippet} from "./utils";

(() => {
    const snippetsPath = SNIPPETS_ROOT;
    fs.readdirSync(snippetsPath).filter(p => {
        const stats = fs.lstatSync(path.join(snippetsPath, p));
        return stats.isDirectory() && !p.includes(SNIPPETS_TEMPLATE_NAME);
    })
        .forEach(updateSnippet);
})();

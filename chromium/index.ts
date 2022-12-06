import * as pptr from 'puppeteer';
import {createBookmarkFile, loadSnippets, toBookletName} from "./bookmarks/utils";
import {USER_DATA_DIR} from "./constants";
import {dirname} from "path";

(async () => {
    const userDataDir = (process.argv as any).p || USER_DATA_DIR;
    const url = (process.argv as any).u || '';
    createBookmarkFile({
        bookmarkBar: loadSnippets('./snippets')
            .map(({fileName, javascript}) => ({name: toBookletName(dirname(fileName)), javascript})),
        userDataDir
    });
    const browser = await pptr.launch({
        headless: false,
        userDataDir
    });
    const page = await browser.newPage();
    (url && page.goto(url));
    console.log('Chromium launched!')
})()

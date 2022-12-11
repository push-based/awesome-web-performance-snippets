import * as pptr from 'puppeteer';
import {createBookmarkFile, loadSnippets, toBookletName} from "./bookmarks/utils";
import {USER_DATA_DIR} from "./constants";
import {dirname} from "path";
import {SNIPPETS_ROOT} from "../snippets";

(async () => {
    const userDataDir = (process.argv as any).p || USER_DATA_DIR;
    console.info('userDataDir: ', userDataDir);
    const url = (process.argv as any)[2] || '';
    console.info('URL: ', process.argv);
    createBookmarkFile({
        bookmarkBar: loadSnippets(SNIPPETS_ROOT)
            .map(({fileName, javascript}) => ({name: toBookletName(dirname(fileName)), javascript})),
        userDataDir
    });
    const browser = await pptr.launch({
        headless: false,
        userDataDir
    });

    const page = await browser.newPage();
    if(url) {
        await page.goto(url)
    } else {
        console.info('No URL given to navigate');
    }
    console.log('Chromium launched!');


})()

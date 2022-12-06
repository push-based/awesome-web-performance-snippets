import {BookMarkContent, Child, RootObject} from "./types";
import {lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from "fs";
import {dirname, join} from "path";
import {DEFAULT_FILENAME} from "./constants";

function createBookMark(bookmarkContent: BookMarkContent): Child {
    return ({
        date_added: '13313299914044308',
        date_last_used: '0',
        guid: '9bd27f0a-554d-44c4-a64d-ba7cccf97ae5',
        id: '2',
        meta_info: {
            power_bookmark_meta: ''
        },
        name: bookmarkContent.name,
        type: 'url',
        url: `javascript:(()=>{${bookmarkContent.javascript}})();`
    });
}

export function createBookmarkFile(cfg: {
    bookmarkBar: BookMarkContent[],
    userDataDir: string
}): void {
    const content: RootObject = {
        checksum: '92c6dd5c89c7da4a391f53cece274c6a',
        roots: {
            bookmark_bar: {
                children: cfg.bookmarkBar.map(createBookMark),
                date_added: '13313299898938408',
                date_last_used: '0',
                date_modified: '13313299914044308',
                guid: '0bc5d13f-2cba-5d74-951f-3f233fe6c908',
                id: '1',
                name: 'Lesezeichenleiste',
                type: 'folder'
            },
            other: {
                children: [],
                date_added: '13313299898938415',
                date_last_used: '0',
                date_modified: '0',
                guid: '82b081ec-3dd3-529c-8475-ab6c344590dd',
                id: '3',
                name: 'Weitere Lesezeichen',
                type: 'folder'
            },
            synced: {
                children: [],
                date_added: '13313299898938418',
                date_last_used: '0',
                date_modified: '0',
                guid: '4cf2e351-0e85-532b-bb37-df045d8f8d0f',
                id: '4',
                name: 'Mobile Lesezeichen',
                'type': 'folder'
            }
        },
        version: 1
    }

    const userDataDir = join(cfg.userDataDir, 'Default');
    const userDataPath = join(userDataDir, 'Bookmarks');

    mkdirSync(userDataDir, {recursive: true})
    writeFileSync(userDataPath, JSON.stringify(content));
}

function normalizePath(path: string): string[] {
    const stats = lstatSync(path);
    if (stats.isFile()) {
        return [path];
    } else {
        return readdirSync(path).flatMap(p => normalizePath(join(path, p)))
    }
}

export function getSnippetPaths(folder: string, isScript: (fileName: string) => boolean = (f) => f.endsWith(DEFAULT_FILENAME)): string[] {
    return normalizePath(folder)
        .filter(isScript)
}

export function loadSnippets(folder: string, isScript: (fileName: string) => boolean = (f) => f.endsWith(DEFAULT_FILENAME)): ({ fileName: string } & Pick<BookMarkContent, 'javascript'>)[] {

    const bookmarkContent = getSnippetPaths(folder, isScript)
        .map(fileName => {
            return {fileName, javascript: readFileSync(fileName, 'utf8')};
        })
    console.log(`We found ${bookmarkContent.length} snippets`);
    return bookmarkContent;
}

export function toBookletName(folderName: string): string {
    let name = folderName.split('\\').pop()?.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([-_])/g, ' ') as string;
    console.log('name: ', name[0].toUpperCase() + name.slice(1));
    return name[0].toUpperCase() + name.slice(1);
}

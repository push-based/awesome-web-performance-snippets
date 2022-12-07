export type BookMarkContent = { name: string, javascript: string };

export interface MetaInfo {
    power_bookmark_meta: string;
}

export interface Child {
    date_added: string;
    date_last_used: string;
    guid: string;
    id: string;
    meta_info: MetaInfo;
    name: string;
    type: string;
    url: string;
}

export interface BookmarkBar {
    children: Child[];
    date_added: string;
    date_last_used: string;
    date_modified: string;
    guid: string;
    id: string;
    name: string;
    type: string;
}

export interface Other {
    children: any[];
    date_added: string;
    date_last_used: string;
    date_modified: string;
    guid: string;
    id: string;
    name: string;
    type: string;
}

export interface Synced {
    children: any[];
    date_added: string;
    date_last_used: string;
    date_modified: string;
    guid: string;
    id: string;
    name: string;
    type: string;
}

export interface Roots {
    bookmark_bar: BookmarkBar;
    other: Other;
    synced: Synced;
}

export interface RootObject {
    checksum: string;
    roots: Roots;
    version: number;
}


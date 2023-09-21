## Description

Gets information about event lieteners on the page.

Gets information about event lieteners on the page.
IMPORTANT: This script can not be run as a bookmarklet because it relies on console api getEventListeners();
## How to use it

<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->


| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function getDOMEventListeners() {
    // Get all elements with event listeners
    const elements = [document, ...document.querySelectorAll("*")]
        .map((e) => {
        const elementListeners = window.getEventListeners(e);
        return {
            element: e,
            listeners: Object.keys(elementListeners)
                .map((key) => ({
                [key]: elementListeners[key],
            }))
                .reduce((acc, listener) => ({
                ...acc,
                ...listener,
            }), {}),
        };
    })
        .filter((el) => Object.keys(el.listeners).length);
    // Find unique listeners names
    const names = new Set(elements
        .map((e) => Object.keys(e.listeners))
        .reduce((acc, listener) => [...acc, ...listener], []));
    // Form output table
    const table = [...names].reduce((acc, n) => {
        const withListener = elements.filter((e) => e.listeners[n]);
        const total = withListener.reduce((acc, e) => acc + e.listeners[n].length, 0);
        const activeListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => !l.passive).length, 0);
        const activeReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => !l.passive).length ? [...acc, e] : acc, []);
        const passiveListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => l.passive).length, 0);
        const passiveReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => l.passive).length ? [...acc, e] : acc, []);
        const onceListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => l.once).length, 0);
        const onceReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => l.once).length ? [...acc, e] : acc, []);
        return [
            ...acc,
            {
                name: n,
                total,
                activeListeners,
                activeListeners,
                passiveListeners,
                onceListeners,
                references: {
                    active: activeReferences,
                    passive: passiveReferences,
                    once: onceReferences,
                },
            },
        ];
    }, []);
    console.table([
        {
            name: "📝TOTAL",
            total: table.reduce((acc, val) => acc + val.total, 0),
            activeListeners: table.reduce((acc, val) => acc + val.activeListeners, 0),
            passiveListeners: table.reduce((acc, val) => acc + val.passiveListeners, 0),
            onceListeners: table.reduce((acc, val) => acc + val.onceListeners, 0),
            references: "----",
        },
        ...table,
    ]);
}
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function getDOMEventListeners() {
    // Get all elements with event listeners
    const elements = [document, ...document.querySelectorAll("*")]
        .map((e) => {
        const elementListeners = window.getEventListeners(e);
        return {
            element: e,
            listeners: Object.keys(elementListeners)
                .map((key) => ({
                [key]: elementListeners[key],
            }))
                .reduce((acc, listener) => ({
                ...acc,
                ...listener,
            }), {}),
        };
    })
        .filter((el) => Object.keys(el.listeners).length);
    // Find unique listeners names
    const names = new Set(elements
        .map((e) => Object.keys(e.listeners))
        .reduce((acc, listener) => [...acc, ...listener], []));
    // Form output table
    const table = [...names].reduce((acc, n) => {
        const withListener = elements.filter((e) => e.listeners[n]);
        const total = withListener.reduce((acc, e) => acc + e.listeners[n].length, 0);
        const activeListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => !l.passive).length, 0);
        const activeReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => !l.passive).length ? [...acc, e] : acc, []);
        const passiveListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => l.passive).length, 0);
        const passiveReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => l.passive).length ? [...acc, e] : acc, []);
        const onceListeners = withListener.reduce((acc, e) => acc + e.listeners[n].filter((l) => l.once).length, 0);
        const onceReferences = withListener.reduce((acc, e) => e.listeners[n].filter((l) => l.once).length ? [...acc, e] : acc, []);
        return [
            ...acc,
            {
                name: n,
                total,
                activeListeners,
                activeListeners,
                passiveListeners,
                onceListeners,
                references: {
                    active: activeReferences,
                    passive: passiveReferences,
                    once: onceReferences,
                },
            },
        ];
    }, []);
    console.table([
        {
            name: "📝TOTAL",
            total: table.reduce((acc, val) => acc + val.total, 0),
            activeListeners: table.reduce((acc, val) => acc + val.activeListeners, 0),
            passiveListeners: table.reduce((acc, val) => acc + val.passiveListeners, 0),
            onceListeners: table.reduce((acc, val) => acc + val.onceListeners, 0),
            references: "----",
        },
        ...table,
    ]);
}

``` 




</details>




<!-- END-HOW_TO -->






































































































## Input

N/A

## Features

- Provides summary information about all event listeners on the page.

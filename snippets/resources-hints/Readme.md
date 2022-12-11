## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#resources-hints).

Check if the page has resources hints

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



```javascript

javascript:(() => {const rels = [
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "preconnect dns-prefetch",
    "prerender",
    "modulepreload",
];
rels.forEach((element) => {
    const linkElements = document.querySelectorAll(`link[rel="${element}"]`);
    const dot = linkElements.length > 0 ? "🟩" : "🟥";
    console.log(`${dot} ${element}`);
    linkElements.forEach((el) => console.log(el));
});
)()
``` 




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



```javascript

const rels = [
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "preconnect dns-prefetch",
    "prerender",
    "modulepreload",
];
rels.forEach((element) => {
    const linkElements = document.querySelectorAll(`link[rel="${element}"]`);
    const dot = linkElements.length > 0 ? "🟩" : "🟥";
    console.log(`${dot} ${element}`);
    linkElements.forEach((el) => console.log(el));
});

``` 




<!-- END-HOW_TO -->





## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#resources-hints).

Check if the page has resources hints

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


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




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


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




</details>




<!-- END-HOW_TO -->







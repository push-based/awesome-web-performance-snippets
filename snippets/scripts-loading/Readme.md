## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#scripts-loading).

List all the <scripts> in the DOM and show a table to see if are loaded async and/or defer

## How to use it

<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->


| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {const scripts = document.querySelectorAll('script[src]');
const scriptsLoading = [...scripts].map((obj) => {
    let newObj = {};
    newObj = {
        src: obj.src,
        async: obj.async,
        defer: obj.defer,
        'render blocking': obj.async || obj.defer ? '' : '🟥'
    };
    return newObj;
});
console.table(scriptsLoading);
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

const scripts = document.querySelectorAll('script[src]');
const scriptsLoading = [...scripts].map((obj) => {
    let newObj = {};
    newObj = {
        src: obj.src,
        async: obj.async,
        defer: obj.defer,
        'render blocking': obj.async || obj.defer ? '' : '🟥'
    };
    return newObj;
});
console.table(scriptsLoading);

``` 




</details>




<!-- END-HOW_TO -->























## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#time-to-first-byte).

Measure the time to first byte, from the document

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {new PerformanceObserver(function (entryList) {
    var pageNav = entryList.getEntriesByType('navigation')[0];
    console.log("TTFB (ms): ".concat(pageNav.responseStart));
}).observe({
    type: 'navigation',
    buffered: true
});
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

new PerformanceObserver(function (entryList) {
    var pageNav = entryList.getEntriesByType('navigation')[0];
    console.log("TTFB (ms): ".concat(pageNav.responseStart));
}).observe({
    type: 'navigation',
    buffered: true
});

``` 




</details>




<!-- END-HOW_TO -->















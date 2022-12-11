## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#time-to-first-byte).

Measure the time to first byte, from the document

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntriesByType('navigation');
    console.log(`TTFB (ms): ${pageNav.responseStart}`);
}).observe({
    type: 'navigation',
    buffered: true
});
)()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntriesByType('navigation');
    console.log(`TTFB (ms): ${pageNav.responseStart}`);
}).observe({
    type: 'navigation',
    buffered: true
});

``` 




</details>




<!-- END-HOW_TO -->











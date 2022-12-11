## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#time-to-first-byte).

Measure the time to first byte, from the document

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



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




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



```javascript

new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntriesByType('navigation');
    console.log(`TTFB (ms): ${pageNav.responseStart}`);
}).observe({
    type: 'navigation',
    buffered: true
});

``` 




<!-- END-HOW_TO -->





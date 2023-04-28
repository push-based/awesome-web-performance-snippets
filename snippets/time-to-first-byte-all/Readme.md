## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#time-to-first-byte).

Measure the time to first byte of all resources loaded

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

javascript:(() => {new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const resourcesLoaded = [...entries].map((entry) => {
        let obj = {};
        // Some resources may have a responseStart value of 0, due
        // to the resource being cached, or a cross-origin resource
        // being served without a Timing-Allow-Origin header set.
        if (entry.responseStart > 0) {
            obj = {
                'TTFB (ms)': entry.responseStart,
                Resource: entry.name
            };
        }
        return obj;
    });
    console.table(resourcesLoaded);
}).observe({
    type: 'resource',
    buffered: true
});
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const resourcesLoaded = [...entries].map((entry) => {
        let obj = {};
        // Some resources may have a responseStart value of 0, due
        // to the resource being cached, or a cross-origin resource
        // being served without a Timing-Allow-Origin header set.
        if (entry.responseStart > 0) {
            obj = {
                'TTFB (ms)': entry.responseStart,
                Resource: entry.name
            };
        }
        return obj;
    });
    console.table(resourcesLoaded);
}).observe({
    type: 'resource',
    buffered: true
});

``` 




</details>




<!-- END-HOW_TO -->

























































































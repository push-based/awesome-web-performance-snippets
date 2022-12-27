## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#long-task).

To determine when long tasks happen, you can use [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) and register to observe entries of type `longtask`:

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

javascript:(() => {try {
    // Create the performance observer.
    const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log the entry and all associated details.
            console.table(entry.toJSON());
        }
    });
    // Start listening for `longtask` entries to be dispatched.
    po.observe({ type: 'longtask', buffered: true });
}
catch (e) {
    console.log(`The browser doesn't support this API`);
}
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

try {
    // Create the performance observer.
    const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log the entry and all associated details.
            console.table(entry.toJSON());
        }
    });
    // Start listening for `longtask` entries to be dispatched.
    po.observe({ type: 'longtask', buffered: true });
}
catch (e) {
    console.log(`The browser doesn't support this API`);
}

``` 




</details>




<!-- END-HOW_TO -->



























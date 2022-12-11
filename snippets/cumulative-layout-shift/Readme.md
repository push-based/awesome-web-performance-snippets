# Cumulative Layout Shift

## Description

TODO

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {try {
    let cumulativeLayoutShiftScore = 0;
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore += entry.value;
            }
        }
    });
    observer.observe({ type: "layout-shift", buffered: true });
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            observer.takeRecords();
            observer.disconnect();
            console.log(`CLS: ${cumulativeLayoutShiftScore}`);
        }
    });
}
catch (e) {
    console.log(`Browser doesn't support this API`);
}
)()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

try {
    let cumulativeLayoutShiftScore = 0;
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore += entry.value;
            }
        }
    });
    observer.observe({ type: "layout-shift", buffered: true });
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            observer.takeRecords();
            observer.disconnect();
            console.log(`CLS: ${cumulativeLayoutShiftScore}`);
        }
    });
}
catch (e) {
    console.log(`Browser doesn't support this API`);
}

``` 




</details>




<!-- END-HOW_TO -->




# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  


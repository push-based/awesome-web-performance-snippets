# Cumulative Layout Shift

## Description

TODO

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {try {
    var cumulativeLayoutShiftScore_1 = 0;
    var observer_1 = new PerformanceObserver(function (list) {
        for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore_1 += entry.value;
            }
        }
    });
    observer_1.observe({ type: "layout-shift", buffered: true });
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            observer_1.takeRecords();
            observer_1.disconnect();
            console.log("CLS: ".concat(cumulativeLayoutShiftScore_1));
        }
    });
}
catch (e) {
    console.log("Browser doesn't support this API");
}
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

try {
    var cumulativeLayoutShiftScore_1 = 0;
    var observer_1 = new PerformanceObserver(function (list) {
        for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore_1 += entry.value;
            }
        }
    });
    observer_1.observe({ type: "layout-shift", buffered: true });
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            observer_1.takeRecords();
            observer_1.disconnect();
            console.log("CLS: ".concat(cumulativeLayoutShiftScore_1));
        }
    });
}
catch (e) {
    console.log("Browser doesn't support this API");
}

``` 




</details>




<!-- END-HOW_TO -->













# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  


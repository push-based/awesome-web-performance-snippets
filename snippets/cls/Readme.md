## Description

To find more specific information about layout shifts, you can use [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) and register to observe entries of type `layout-shift`:

Print al the CLS metrics when load the page and the user interactive with the page:

```js
new PerformanceObserver(entryList => {
console.log(entryList.getEntries());
}).observe({ type: "layout-shift", buffered: true });
```

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

javascript:(() => {function genColor() {
    var n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
}
// console.log(shifts) to see full list of shifts above threshold
var shifts = [];
// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load
function findShifts(threshold) {
    return new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.value > threshold && !entry.hadRecentInput) {
                var color_1 = genColor();
                shifts.push(entry);
                console.log(shifts);
                var valueNode_1 = document.createElement("details");
                valueNode_1.innerHTML = "\n<summary>Layout Shift: ".concat(entry.value, "</summary>\n<pre>").concat(JSON.stringify(entry, null, 2), "</pre>\n");
                valueNode_1.style = "color: ".concat(color_1, ";");
                entry.sources.forEach(function (source) {
                    source.node.parentNode.insertBefore(valueNode_1, source.node);
                    source.node.style = "border: 2px ".concat(color_1, " solid");
                });
            }
        });
    });
}
findShifts(0.05).observe({ entryTypes: ["layout-shift"] });
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

function genColor() {
    var n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
}
// console.log(shifts) to see full list of shifts above threshold
var shifts = [];
// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load
function findShifts(threshold) {
    return new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.value > threshold && !entry.hadRecentInput) {
                var color_1 = genColor();
                shifts.push(entry);
                console.log(shifts);
                var valueNode_1 = document.createElement("details");
                valueNode_1.innerHTML = "\n<summary>Layout Shift: ".concat(entry.value, "</summary>\n<pre>").concat(JSON.stringify(entry, null, 2), "</pre>\n");
                valueNode_1.style = "color: ".concat(color_1, ";");
                entry.sources.forEach(function (source) {
                    source.node.parentNode.insertBefore(valueNode_1, source.node);
                    source.node.style = "border: 2px ".concat(color_1, " solid");
                });
            }
        });
    });
}
findShifts(0.05).observe({ entryTypes: ["layout-shift"] });

``` 




</details>




<!-- END-HOW_TO -->













# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  


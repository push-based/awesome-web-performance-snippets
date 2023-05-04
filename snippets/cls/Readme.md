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
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function genColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
}
// console.log(shifts) to see full list of shifts above threshold
const shifts = [];
// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load
function findShifts(threshold) {
    return new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.value > threshold && !entry.hadRecentInput) {
                const color = genColor();
                shifts.push(entry);
                console.log(shifts);
                const valueNode = document.createElement("details");
                valueNode.innerHTML = `
<summary>Layout Shift: ${entry.value}</summary>
<pre>${JSON.stringify(entry, null, 2)}</pre>
`;
                valueNode.style = `color: ${color};`;
                entry.sources.forEach((source) => {
                    source.node.parentNode.insertBefore(valueNode, source.node);
                    source.node.style = `border: 2px ${color} solid`;
                });
            }
        });
    });
}
findShifts(0.05).observe({ entryTypes: ["layout-shift"] });
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function genColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
}
// console.log(shifts) to see full list of shifts above threshold
const shifts = [];
// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load
function findShifts(threshold) {
    return new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.value > threshold && !entry.hadRecentInput) {
                const color = genColor();
                shifts.push(entry);
                console.log(shifts);
                const valueNode = document.createElement("details");
                valueNode.innerHTML = `
<summary>Layout Shift: ${entry.value}</summary>
<pre>${JSON.stringify(entry, null, 2)}</pre>
`;
                valueNode.style = `color: ${color};`;
                entry.sources.forEach((source) => {
                    source.node.parentNode.insertBefore(valueNode, source.node);
                    source.node.style = `border: 2px ${color} solid`;
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


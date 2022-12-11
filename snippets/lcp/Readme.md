## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#largest-contentful-paint-lcp).

Observes (also from the past) and logg's the [LCP](web.dev/lcp).

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * PerformanceObserver
 */
var po = new PerformanceObserver(function (list) {
    var entries = list.getEntries();
    entries = dedupe(entries, "startTime");
    /**
     * Print all entries of LCP
     */
    entries.forEach(function (item, i) {
        console.dir(item);
        console.log("".concat(i + 1, " current LCP item : ").concat(item.element, ": ").concat(item.startTime));
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });
    /**
     * LCP is the lastEntry in getEntries Array
     */
    var lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log("LCP is: ".concat(lastEntry.startTime));
});
/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
    return __spreadArray([], new Map(arr.map(function (item) { return [item[key], item]; })).values(), true);
}
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * PerformanceObserver
 */
var po = new PerformanceObserver(function (list) {
    var entries = list.getEntries();
    entries = dedupe(entries, "startTime");
    /**
     * Print all entries of LCP
     */
    entries.forEach(function (item, i) {
        console.dir(item);
        console.log("".concat(i + 1, " current LCP item : ").concat(item.element, ": ").concat(item.startTime));
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });
    /**
     * LCP is the lastEntry in getEntries Array
     */
    var lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log("LCP is: ".concat(lastEntry.startTime));
});
/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
    return __spreadArray([], new Map(arr.map(function (item) { return [item[key], item]; })).values(), true);
}

``` 




</details>




<!-- END-HOW_TO -->













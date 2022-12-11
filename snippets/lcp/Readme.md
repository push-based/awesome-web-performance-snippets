## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#largest-contentful-paint-lcp).

Observes (also from the past) and logg's the [LCP](web.dev/lcp).

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {/**
 * PerformanceObserver
 */
const po = new PerformanceObserver((list) => {
    let entries = list.getEntries();
    entries = dedupe(entries, "startTime");
    /**
     * Print all entries of LCP
     */
    entries.forEach((item, i) => {
        console.dir(item);
        console.log(`${i + 1} current LCP item : ${item.element}: ${item.startTime}`);
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });
    /**
     * LCP is the lastEntry in getEntries Array
     */
    const lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log(`LCP is: ${lastEntry.startTime}`);
});
/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}
)()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

/**
 * PerformanceObserver
 */
const po = new PerformanceObserver((list) => {
    let entries = list.getEntries();
    entries = dedupe(entries, "startTime");
    /**
     * Print all entries of LCP
     */
    entries.forEach((item, i) => {
        console.dir(item);
        console.log(`${i + 1} current LCP item : ${item.element}: ${item.startTime}`);
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });
    /**
     * LCP is the lastEntry in getEntries Array
     */
    const lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log(`LCP is: ${lastEntry.startTime}`);
});
/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}

``` 




</details>




<!-- END-HOW_TO -->





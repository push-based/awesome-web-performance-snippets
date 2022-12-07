## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#layout-shifts).

To find more specific information about layout shifts, you can use [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) and register to observe entries of type `layout-shift`:


Print al the CLS metrics when load the page and the user interactive with the page:

```js
new PerformanceObserver(entryList => {
console.log(entryList.getEntries());
}).observe({ type: "layout-shift", buffered: true });
```

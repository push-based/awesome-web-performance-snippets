## Description

To find more specific information about layout shifts, you can use [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) and register to observe entries of type `layout-shift`:

Print al the CLS metrics when load the page and the user interactive with the page:

```js
new PerformanceObserver(entryList => {
console.log(entryList.getEntries());
}).observe({ type: "layout-shift", buffered: true });
```

## How to use it

General usage description for all supported techniques can be found in the following table.

| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks)         |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md) |      ❌    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)       |      ❌    | 

# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  


# Check image sizes

## Description

List all image resources (also background images in styles) and checks if they are used correctly

[More Info](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)

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

javascript:(() => {function getImgs(sortBy) {
    const imgs = [];
    const resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(({ name, transferSize, encodedBodySize, decodedBodySize, initiatorType, }) => {
        if (initiatorType == "img") {
            imgs.push({
                name,
                transferSize,
                decodedBodySize,
                encodedBodySize,
            });
        }
    });
    const imgList = imgs.sort((a, b) => {
        return b[sortBy] - a[sortBy];
    });
    return imgList;
}
console.table(getImgs("encodedBodySize"));
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

function getImgs(sortBy) {
    const imgs = [];
    const resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(({ name, transferSize, encodedBodySize, decodedBodySize, initiatorType, }) => {
        if (initiatorType == "img") {
            imgs.push({
                name,
                transferSize,
                decodedBodySize,
                encodedBodySize,
            });
        }
    });
    const imgList = imgs.sort((a, b) => {
        return b[sortBy] - a[sortBy];
    });
    return imgList;
}
console.table(getImgs("encodedBodySize"));

``` 




</details>




<!-- END-HOW_TO -->



















# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  


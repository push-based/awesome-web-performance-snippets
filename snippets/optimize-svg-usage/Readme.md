# Optimize SVG usage

## Description

This scripts mimics the usage of [ngx-fast-svg](https://github.com/push-based/ngx-fast-svg) and it's impact.

## How to use it

1. Count DOM nodes of all SVG elements  
```javascript
console.log('Number of SVG elements inc content', document.querySelectorAll('svg, svg *').length)
```  
1.1. Additionally measure Layouting cost [full-relayout](https://github.com/push-based/awesome-web-performance-snippets/tree/main/snippets/full-relayout).  
2. run script  
3. Remeasure 1. and 1.1.   

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

javascript:(() => {function createElementFromHTMLString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
function cacheInDom(svgElem, svgId) {
    const node = svgElem.cloneNode(svgElem);
    node?.setAttribute && node.setAttribute('id', svgId);
    svgDomCache.appendChild(node);
}
function modifySvgToUseCache(svgElem, svgId) {
    //svgElem.replaceWith(createElementFromHTMLString(`<svg><use href="#${svgId}"></use></svg>`));
    svgElem.innerHTML = `<use href="#${svgId}"></use>`;
}
let nextCachedSvgId = Math.random();
const svgDomCacheHtml = `<div id="svg-cache" style="
    overflow: hidden;
    width: 0;
    height: 0;
    position: fixed;
    bottom: -2000px;
    contain: content;
    content-visibility: auto;
  "></div>`;
const svgDomCache = createElementFromHTMLString(svgDomCacheHtml);
document.body.appendChild(svgDomCache);
let reusedDomNodes = 0;
const cachedSvgContent = new Set();
document.querySelectorAll('svg').forEach(svg => {
    if (svg.children[0].tagName !== 'use') {
        if (!cachedSvgContent.has(svg.innerHTML)) {
            nextCachedSvgId++;
            cachedSvgContent.add(svg.innerHTML);
            cacheInDom(svg, nextCachedSvgId);
        }
        else {
            reusedDomNodes += svg.querySelectorAll('*').length;
        }
        modifySvgToUseCache(svg, nextCachedSvgId);
    }
    else {
        console.info('already optimized');
    }
});
console.log('Reused DOM nodes: ', reusedDomNodes);
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function createElementFromHTMLString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
function cacheInDom(svgElem, svgId) {
    const node = svgElem.cloneNode(svgElem);
    node?.setAttribute && node.setAttribute('id', svgId);
    svgDomCache.appendChild(node);
}
function modifySvgToUseCache(svgElem, svgId) {
    //svgElem.replaceWith(createElementFromHTMLString(`<svg><use href="#${svgId}"></use></svg>`));
    svgElem.innerHTML = `<use href="#${svgId}"></use>`;
}
let nextCachedSvgId = Math.random();
const svgDomCacheHtml = `<div id="svg-cache" style="
    overflow: hidden;
    width: 0;
    height: 0;
    position: fixed;
    bottom: -2000px;
    contain: content;
    content-visibility: auto;
  "></div>`;
const svgDomCache = createElementFromHTMLString(svgDomCacheHtml);
document.body.appendChild(svgDomCache);
let reusedDomNodes = 0;
const cachedSvgContent = new Set();
document.querySelectorAll('svg').forEach(svg => {
    if (svg.children[0].tagName !== 'use') {
        if (!cachedSvgContent.has(svg.innerHTML)) {
            nextCachedSvgId++;
            cachedSvgContent.add(svg.innerHTML);
            cacheInDom(svg, nextCachedSvgId);
        }
        else {
            reusedDomNodes += svg.querySelectorAll('*').length;
        }
        modifySvgToUseCache(svg, nextCachedSvgId);
    }
    else {
        console.info('already optimized');
    }
});
console.log('Reused DOM nodes: ', reusedDomNodes);

``` 




</details>




<!-- END-HOW_TO -->





























































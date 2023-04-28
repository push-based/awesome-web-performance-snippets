# Check image srcset

## Description
This script helps to debug srcset of [responsive images](web.dev/responsive-images). 
It prints changes in the current src and logs the current url and clientWidth. 

## How to use it

### Devtools setup
- select network tab
- disable cache
- remove all columns but name and path 
- filter for images only 
- in the net work configuration area (cog wheel) select big icons
- use the search filter to reduce the number of results
- open device toolbar
- in the menu select show device pixel ratio
- use a flexible with



<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function checkImgSrcset(selector) {
    selector = selector || prompt('Img selector (e.g. div.test > img)');
    let lastSrc = '';
    const switches = [];
    const el = document.querySelector(selector);
    const resizeObserver = new ResizeObserver((entries) => {
        const clientWidth = document.body.clientWidth;
        for (const entry of entries) {
            const img = entry.target;
            if (lastSrc !== img.currentSrc) {
                lastSrc = img.currentSrc;
                lastSrc && loadImg(lastSrc).then(i => {
                    switches.push({ clientWidth: clientWidth + 'px', src: lastSrc, imgWith: i.width + 'px', element: el });
                    console.clear();
                    console.table(switches.map(({ element, ...inTable }) => inTable));
                    console.log(switches);
                });
                console.clear();
                console.table(switches.map(({ element, ...inTable }) => inTable));
                console.log(switches);
            }
        }
    });
    resizeObserver.observe(el);
}
function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image;
        img.onload = function () {
            resolve(img);
        };
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}
;
checkImgSrcset();
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function checkImgSrcset(selector) {
    selector = selector || prompt('Img selector (e.g. div.test > img)');
    let lastSrc = '';
    const switches = [];
    const el = document.querySelector(selector);
    const resizeObserver = new ResizeObserver((entries) => {
        const clientWidth = document.body.clientWidth;
        for (const entry of entries) {
            const img = entry.target;
            if (lastSrc !== img.currentSrc) {
                lastSrc = img.currentSrc;
                lastSrc && loadImg(lastSrc).then(i => {
                    switches.push({ clientWidth: clientWidth + 'px', src: lastSrc, imgWith: i.width + 'px', element: el });
                    console.clear();
                    console.table(switches.map(({ element, ...inTable }) => inTable));
                    console.log(switches);
                });
                console.clear();
                console.table(switches.map(({ element, ...inTable }) => inTable));
                console.log(switches);
            }
        }
    });
    resizeObserver.observe(el);
}
function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image;
        img.onload = function () {
            resolve(img);
        };
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}
;
checkImgSrcset();

``` 




</details>




<!-- END-HOW_TO -->

















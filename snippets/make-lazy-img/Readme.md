## Description

Add `loading="lazy"` to all images and iframe's on the page.

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {var imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(function (i) { return i.setAttribute('loading', 'lazy'); });
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(function (i) { return i.setAttribute('loading', 'lazy'); });

``` 




</details>




<!-- END-HOW_TO -->











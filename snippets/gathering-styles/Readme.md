## Description

Gathers all style tags of the page and aggregates them to one string.

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



```javascript

javascript:(() => {console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a, b) => a + b));
)()
``` 




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



```javascript

console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a, b) => a + b));

``` 




<!-- END-HOW_TO -->



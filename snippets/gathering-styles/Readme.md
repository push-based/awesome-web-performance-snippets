## Description

Gathers all style tags of the page and aggregates them to one string.

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a, b) => a + b));
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a, b) => a + b));

``` 




</details>




<!-- END-HOW_TO -->



















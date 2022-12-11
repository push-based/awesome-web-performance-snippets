## Description

Scrolls down waits and scrolls up again.
This is helpful to get scroll performance and interacted state of the page.

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



```javascript

javascript:(() => {const scrollHeight = document.documentElement.scrollHeight;
window.scroll({
    top: scrollHeight,
    behavior: 'smooth'
});
// wait for a second, then scroll back up
setTimeout(() => window.scroll({
    top: 0,
    behavior: 'smooth'
}), 3000);
console.log('scroll done!');
)()
``` 




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



```javascript

const scrollHeight = document.documentElement.scrollHeight;
window.scroll({
    top: scrollHeight,
    behavior: 'smooth'
});
// wait for a second, then scroll back up
setTimeout(() => window.scroll({
    top: 0,
    behavior: 'smooth'
}), 3000);
console.log('scroll done!');

``` 




<!-- END-HOW_TO -->




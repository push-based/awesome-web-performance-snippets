/**
 * To use it as bookmark: how-to-use-bookmarks.md
 */
Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a,b) => a + b);

/**
 * To use it as bookmark: how-to-use-bookmarks.md
 */
const imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(i => i.setAttribute('loading', 'lazy'));

/**
 * To use it as bookmark: how-to-use-bookmarks.md
 */
const imgs = document.querySelectorAll('img');
const eager = Array.from(imgs)
    .map(i => i.getAttribute('loading'))
    .filter(l => !l).length;
console.log(eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)');
document.title= eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)';

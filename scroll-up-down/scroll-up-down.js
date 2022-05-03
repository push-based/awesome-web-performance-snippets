/**
 * To use it as bookmark: how-to-use-bookmarks.md
 */
// Scroll up down
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

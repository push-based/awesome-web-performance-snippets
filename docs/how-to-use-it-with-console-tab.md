# How to use snippets in the console

1. Open the DevTools (<kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>I</kbd> )
2. Open the Console Tab
3. Copy snippet by clicking the copy icon on the code box e.g.

```js
const imgs = document.querySelectorAll('img');
const eager = Array.from(imgs)
    .map(i => i.getAttribute('loading'))
    .filter(l => !l).length;
console.log(eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)');
document.title= eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)';
```

4. Past the content in the (<kbd>CTRL</kbd> + <kbd>C</kbd>) console and hit <kbd>ENTER</kbd> 

![console execution](https://user-images.githubusercontent.com/4904455/206262209-ad67fc96-ae3c-4b5b-afe8-e6847af7cc93.png)

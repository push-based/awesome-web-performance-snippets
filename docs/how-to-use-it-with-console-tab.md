# How to use snippets in the console

copy the script you like, e.g.

```js
const imgs = document.querySelectorAll('img');
const eager = Array.from(imgs)
    .map(i => i.getAttribute('loading'))
    .filter(l => !l).length;
console.log(eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)');
document.title= eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)';
```

Open the dev tools and paste it into your console. Execute the script by hitting `ENTER`

![console execution](https://user-images.githubusercontent.com/4904455/206262209-ad67fc96-ae3c-4b5b-afe8-e6847af7cc93.png)

const imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(i => i.setAttribute('loading', 'lazy'));

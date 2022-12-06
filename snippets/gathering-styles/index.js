console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a,b) => a + b));

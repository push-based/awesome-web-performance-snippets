const scripts = document.querySelectorAll('script[src]');

const scriptsLoading = [...scripts].map((obj) => {
    let newObj = {};
    newObj = {
        src: obj.src,
        async: obj.async,
        defer: obj.defer,
        'render blocking': obj.async || obj.defer ? '' : '🟥'
    };
    return newObj;
});
console.table(scriptsLoading);

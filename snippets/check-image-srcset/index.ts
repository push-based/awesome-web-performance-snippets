function checkImgSrcset(selector?: string): void {
    selector = selector || prompt('Img selector (e.g. div.test > img)');
    let lastSrc = '';
    const switches = [];
    const el = document.querySelector(selector);
    const resizeObserver = new ResizeObserver((entries) => {
        const clientWidth = document.body.clientWidth;
        for (const entry of entries) {
            const img = entry.target as HTMLImageElement;
            if (lastSrc !== img.currentSrc) {
                lastSrc = img.currentSrc;
                lastSrc && loadImg(lastSrc).then(i => {
                    switches.push({ clientWidth: clientWidth+'px', src: lastSrc, imgWith: i.width+'px', element: el });
                    console.clear();
                    console.table(switches.map(({element, ...inTable}) => inTable));
                    console.log(switches);
                });
                console.clear();
                console.table(switches.map(({element, ...inTable}) => inTable));
                console.log(switches);
            }
        }
    })
    resizeObserver.observe(el);
}

function loadImg(url): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image;
        img.onload = function() {
            resolve(img)
        };
        img.onerror = (e) => reject(e);
        img.src = url;
    })
};

checkImgSrcset();
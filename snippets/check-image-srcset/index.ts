function checkImgSrcset(selector?: string): void {
    selector = selector || prompt('Img selector (e.g. div.test > img)');
    let lastSrc = '';
    const switches = [];
    const el = document.querySelector(selector);
    if(!el) {
        throw(`Could not fnd any element with selector ${selector}`);
    }
    const resizeObserver = new ResizeObserver((entries) => {
        const clientWidth = document.body.clientWidth;
        for (const entry of entries) {
            const img = entry.target as HTMLImageElement;
            if (lastSrc !== img.currentSrc) {
                lastSrc = img.currentSrc;
                lastSrc && loadImg(lastSrc).then(i => {
                    switches.push({
                        breakpoint: clientWidth,
                        element: el,
                        src: lastSrc,
                        intrinsicWith: i.width,
                        intrinsicHeight: i.height,
                        renderedWith: el.clientWidth,
                        renderedHeight: el.clientHeight,
                        sizeDiff: ((i.width * i.height) / (el.clientWidth * el.clientHeight))
                    });
                    highlightElement(switches);
                    logData(switches);
                });
                highlightElement(switches);
                logData(switches);
            }
        }
    })
    resizeObserver.observe(el);
}

function logData(data) {
    console.clear();
    console.log(`Element: ${data[0].element}`);
    console.table(prepareTable(data));
    console.log(data.map(({element, ...r}) => r));
}

function highlightElement(arr) {
    arr.forEach(o => {
        const {element, intrinsicWith, intrinsicHeight} = o;
        if(element && intrinsicWith && intrinsicHeight) {
            const d = ((intrinsicWith * intrinsicHeight) / (element.clientWidth * element.clientHeight));
            element.style.opacity = 1;
            element.style.border = 0 + 'px solid red';
            // We use border to visualize oversize
            if (d > 0) {
                element.style.border = (d * 5).toFixed() + 'px solid red';
            }
            // we use opacity to visualize undersize
            else {
                element.style.opacity = 1 * (d);
            }
        }
    })
}


function prepareTable(arr) {
    return arr
        .map(({ element, ...inTable }) => ({
            dpr: window.devicePixelRatio,
            clientWidth: inTable.clientWidth + 'px',
            src: inTable.src,
            intrinsicSize: inTable.intrinsicWith + 'x' + inTable.intrinsicHeight + 'px',
            renderedSize: inTable.renderedWith + 'x' + inTable.renderedHeight + 'px',
            sizeDiff: inTable.sizeDiff.toFixed(2)
        }))
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
function createElementFromHTMLString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function cacheInDom(svgElem, svgId) {
    const node = svgElem.cloneNode(svgElem);
    node?.setAttribute && node.setAttribute('id', svgId);
    svgDomCache.appendChild(node);
}

function modifySvgToUseCache(svgElem, svgId) {
    //svgElem.replaceWith(createElementFromHTMLString(`<svg><use href="#${svgId}"></use></svg>`));
    svgElem.innerHTML = `<use href="#${svgId}"></use>`;
}

let nextCachedSvgId = Math.random();
const svgDomCacheHtml = `<div id="svg-cache" style="
    overflow: hidden;
    width: 0;
    height: 0;
    position: fixed;
    bottom: -2000px;
    contain: content;
    content-visibility: auto;
  "></div>`;
const svgDomCache = createElementFromHTMLString(svgDomCacheHtml);
document.body.appendChild(svgDomCache);

let reusedDomNodes = 0;
const cachedSvgContent = new Set();
document.querySelectorAll('svg').forEach(svg => {
    if (svg.children[0].tagName === 'use') {
        if (!cachedSvgContent.has(svg.innerHTML)) {
            nextCachedSvgId++;
            cachedSvgContent.add(svg.innerHTML);
            cacheInDom(svg, nextCachedSvgId);
        } else {
            reusedDomNodes += svg.querySelectorAll('*').length;
        }
        modifySvgToUseCache(svg, nextCachedSvgId);
    } else {
        console.info('already optimized');
    }
});
console.log('Reused DOM nodes: ', reusedDomNodes);

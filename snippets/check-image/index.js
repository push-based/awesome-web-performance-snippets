const bgUrlChecker = /(url\(["'])([A-Za-z0-9$.:/_\-~]*)(["']\))(?!data:$)/g;
const base64UrlChecker = /(url\(["'])(data:)([A-Za-z0-9$.:/_\-~]*)/g;
const srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])/g;

const bgSRule = 'background';
const bgImgSRule = 'background-image';
const s = (tag, pseudoElt) => window.getComputedStyle(tag, pseudoElt || null);


function isInViewPort(tag, addHeight, addWidth) {
    addHeight = addHeight | 0;
    addWidth = addWidth | addHeight;
    const positionTop = parseInt(tag.getBoundingClientRect().top);
    const positionLeft = parseInt(tag.getBoundingClientRect().top);
    return positionTop < window.innerHeight + addHeight && positionTop !== 0 && positionLeft < window.innerWidth + addWidth && positionLeft !== 0;
}

const getImgRelevantRules = (tag) => {
    const res = {
        withBgImgNodes: new Map(),
        withBgDataImgNodes: new Map()
    };

    [null, '::before', '::after']
        .map((pseudoElt) => {
            const backgroundVal = s(tag, pseudoElt).getPropertyValue(bgSRule);
            const backgroundImageVal = s(tag, pseudoElt).getPropertyValue(bgImgSRule);

            let matchBg = bgUrlChecker.exec(backgroundVal) || bgUrlChecker.exec(backgroundImageVal);
            let matchBgB64 = base64UrlChecker.exec(backgroundVal) || base64UrlChecker.exec(backgroundImageVal);

            if (matchBg) {
                res.withBgImgNodes.set(matchBg[2], tag);
            } else if (matchBgB64) {
                res.withBgDataImgNodes.set(matchBgB64[3], tag);
            }
        });

    return res;
};

const msgNotLazyLoaded = "❌ not lazy loaded";
const msgNotEagerLoaded = "❌ not eager loaded";
const msgDontUseBgImage = "❌ don't use bg image";
const msgDontUseBgDataImage = "❌ don't use data:<format>";
const msgOk = "🆗";
const msgUnknown = "Case not implemented";

function getImgs() {
    const imgs = new Map();

    const resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(
        ({
             name,
             transferSize,
             encodedBodySize,
             decodedBodySize,
             initiatorType,
         }) => {
            if (initiatorType == "img") {
                imgs.set(name, {
                    name,
                    transferSize,
                    decodedBodySize,
                    encodedBodySize
                });
            }
        }
    );

    return imgs;
}

function getBgImgs(doc) {

    const withBgImgNames = new Set();
    const withBgImgNodes = new Map();
    const withBgDataImgNames = new Set();
    const withBgDataImgNodes = new Map();

    Array.from(doc.querySelectorAll('body *'))
        .forEach((tag) => {
            const badRules = getImgRelevantRules(tag);
            Array.from(badRules.withBgImgNodes.entries()).forEach(([url, _]) => {
                withBgImgNodes.set(url, tag);
                withBgImgNames.add(url);
            });
            Array.from(badRules.withBgDataImgNodes.entries()).forEach(([url, _]) => {
                withBgDataImgNodes.set(url, tag);
                withBgDataImgNames.add(url);
            });
        })

    return { withBgImgNodes, withBgImgNames, withBgDataImgNodes, withBgDataImgNames};
}

function findImagesAndLoadingAttribute(doc) {
    const imgs = doc.querySelectorAll('img');
    let lazyLoadedAboveTheFoldNodes = new Map();
    let lazyLoadedAboveTheFoldNames = new Set();
    let eagerLoadedBelowTheFoldNodes = new Map();
    let eagerLoadedBelowTheFoldNames = new Set();

    imgs.forEach((tag) => {
        const inViewPort = isInViewPort(tag);
        const matchSrc = srcChecker.exec(tag.attributes.src.value);

        const url = tag.attributes.src.value;
        const isLazy = tag.attributes.loading;
        if (isLazy && inViewPort) {
            lazyLoadedAboveTheFoldNodes.set(url, tag);
            lazyLoadedAboveTheFoldNames.add(url);
        } else if (!isLazy && !inViewPort) {
            eagerLoadedBelowTheFoldNodes.set(url, tag);
            eagerLoadedBelowTheFoldNames.add(url);
        }
    });
    return { lazyLoadedAboveTheFoldNames, lazyLoadedAboveTheFoldNodes, eagerLoadedBelowTheFoldNames, eagerLoadedBelowTheFoldNodes };
}

const {
    lazyLoadedAboveTheFoldNodes,
    lazyLoadedAboveTheFoldNames,
    eagerLoadedBelowTheFoldNodes,
    eagerLoadedBelowTheFoldNames
} = findImagesAndLoadingAttribute(document);

const {
    withBgDataImgNames,
    withBgDataImgNodes,
    withBgImgNames,
    withBgImgNodes
} = getBgImgs(document);

const networkImgs = getImgs();

const allNames = Array.from(new Set([
        ...lazyLoadedAboveTheFoldNames,
        ...eagerLoadedBelowTheFoldNames,
        ...withBgImgNames,
        ...withBgDataImgNames
    ]
));

console.table(Array.from(allNames).map((name) => {
    const e = {name};
    const loadingError = eagerLoadedBelowTheFoldNames.has(name) ? msgNotEagerLoaded :
        lazyLoadedAboveTheFoldNames.has(name) ? msgNotLazyLoaded :
            withBgImgNames.has(name) ? msgDontUseBgImage :
                withBgDataImgNames.has(name) ? msgDontUseBgDataImage :
                    !networkImgs.has(name) ? msgOk : msgUnknown;

    e.loading = loadingError;

    switch (loadingError) {
        case msgNotEagerLoaded:
            e.tag = eagerLoadedBelowTheFoldNodes.get(name);
            break;
        case msgNotLazyLoaded:
            e.tag = lazyLoadedAboveTheFoldNodes.get(name);
            break;
        case msgDontUseBgImage:
            e.tag = withBgImgNodes.get(name);
            break;
        case msgDontUseBgDataImage:
            e.tag = withBgDataImgNodes.get(name);
            break;
        case msgUnknown:
            break;
    }
    return e;
}));

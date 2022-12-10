const bgUrlChecker = /(url\(["'])([A-Za-z0-9$.:/_\-~]*)(["']\))(?!data:$)/g;
const base64UrlChecker = /(url\(["'])(data:)([A-Za-z0-9$.:/_\-~]*)/g;
const srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;

const bgSRule = 'background';
const bgImgSRule = 'background-image';

const msgNotLazyLoaded = "❌ not lazy loaded";
const msgNotEagerLoaded = "❌ not eager loaded";
const msgDontUseBgImage = "❌ don't use bg image";
const msgDontUseBgDataImage = "❌ don't use data:<format>";
const msgNotDisplayed = "⚠ fetched but not displayed";
const msgUnknown = "⚠ Case not implemented";
const msgOk = "🆗";

function fixUsage(imgs) {
    let l = '';
    imgs.forEach(i => {
        switch (i.error) {
            case msgNotEagerLoaded:
                l = "eager";
                break;
            case msgNotLazyLoaded:
                l = "lazy";
                break;
        }
        l && i.tag.setAttribute('loading', l);
    });
}

function highlightElements(imgs) {
    let s = '';
    imgs.forEach(i => {
        switch (i.error) {
            case msgNotEagerLoaded:
                s = 'outline: 3px red solid;';
                break;
            case msgNotLazyLoaded:
                s = 'outline: 3px red dotted;';
                break;
            case msgDontUseBgDataImage:
                s = 'outline: 3px red dashed;';
                break;
            case msgDontUseBgImage:
                s = 'outline: 3px red dashed;';
                break;
        }
        s && i.tag.setAttribute('style', s);
    });
}

function isInViewPort(tag) {
    tag.offsetTop < window.innerHeight &&
    tag.offsetTop > -tag.offsetHeight &&
    tag.offsetLeft > -tag.offsetWidth &&
    tag.offsetLeft < window.innerWidth
}

function styles(tag, pseudoElt) {
    return window.getComputedStyle(tag, pseudoElt || null);
}

function getImgRelevantRules(tag) {
    const res = {
        withBgImgNodes: new Map(),
        withBgDataImgNodes: new Map()
    };

    let matchBgB64 = base64UrlChecker.exec(tag.attributes.src);
    if (matchBgB64) {
        res.withBgImgNodes.set(matchBgB64[3], tag);
    }

    [null, '::before', '::after']
        .map((pseudoElt) => {
            const backgroundVal = styles(tag, pseudoElt).getPropertyValue(bgSRule);
            const backgroundImageVal = styles(tag, pseudoElt).getPropertyValue(bgImgSRule);

            let matchBg = bgUrlChecker.exec(backgroundVal) || bgUrlChecker.exec(backgroundImageVal);
            let matchBgB64 = base64UrlChecker.exec(backgroundVal) || base64UrlChecker.exec(backgroundImageVal);

            if (matchBg) {
                res.withBgImgNodes.set(matchBg[2], tag);
            } else if (matchBgB64) {
                res.withBgDataImgNodes.set(matchBgB64[3], tag);
            }
        });

    return res;
}

function getNetworkImgs() {
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

function getImgsWithBackground(doc) {

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

    return {withBgImgNodes, withBgImgNames, withBgDataImgNodes, withBgDataImgNames};
}

function findImagesAndLoadingAttribute(doc) {
    const imgs = doc.querySelectorAll('img');

    const lazyLoadedAboveTheFoldNodes = new Map();
    const lazyLoadedAboveTheFoldNames = new Set();
    const eagerLoadedBelowTheFoldNodes = new Map();
    const eagerLoadedBelowTheFoldNames = new Set();

    imgs.forEach((tag) => {
        const inViewPort = isInViewPort(tag);
        const url = tag.attributes.src ? tag.attributes.src.value : null;
        
        // Ignore images without URL since they might be handled by custom javaScript lazy loading technique.
        if (!url) return;
        
        const isLazy = tag.attributes.loading === 'lazy';
        if (isLazy && inViewPort) {
            lazyLoadedAboveTheFoldNodes.set(url, tag);
            lazyLoadedAboveTheFoldNames.add(url);
        } else if (!isLazy && !inViewPort) {
            eagerLoadedBelowTheFoldNodes.set(url, tag);
            eagerLoadedBelowTheFoldNames.add(url);
        }
    });
    return {
        lazyLoadedAboveTheFoldNames,
        lazyLoadedAboveTheFoldNodes,
        eagerLoadedBelowTheFoldNames,
        eagerLoadedBelowTheFoldNodes
    };
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
} = getImgsWithBackground(document);

const networkImgs = getNetworkImgs();

const allNames = Array.from(new Set([
        ...lazyLoadedAboveTheFoldNames,
        ...eagerLoadedBelowTheFoldNames,
        ...withBgImgNames,
        ...withBgDataImgNames
    ]
));

function enrichData() {
    return Array.from(allNames).map((url) => {

        let imgData = {
            tag: 'n/a',
            url,
            error: '',
            transferSize: '?',
            decodedBodySize: '?'
        };

        let errorDetected = true;
        switch (true) {
            case eagerLoadedBelowTheFoldNames.has(url):
                imgData.tag = eagerLoadedBelowTheFoldNodes.get(url);
                imgData.error = msgNotLazyLoaded;
                break;
            case lazyLoadedAboveTheFoldNames.has(url):
                imgData.tag = lazyLoadedAboveTheFoldNodes.get(url);
                imgData.error = msgNotEagerLoaded;
                break;
            case withBgImgNames.has(url):
                imgData.tag = withBgImgNodes.get(url);
                imgData.error = msgDontUseBgImage;
                break;
            case withBgDataImgNames.has(url):
                imgData.tag = withBgDataImgNodes.get(url);
                imgData.error = msgDontUseBgDataImage;
                imgData.transferSize = 0;
                imgData.decodedBodySize = url.length * 1.02;
                break;
            default:
                errorDetected = false;
        }

        if (networkImgs.has(url)) {
            const {transferSize, decodedBodySize, encodedBodySize} = networkImgs.get(url);
            imgData = {...imgData, transferSize, decodedBodySize};

            if (!errorDetected) {
                imgData.error = msgOk;
            }
        }

        return imgData;
    });
}

const d = enrichData();
highlightElements(d);
fixUsage(d);
console.table(d);

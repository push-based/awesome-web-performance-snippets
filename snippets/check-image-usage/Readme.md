# Check image usage

## Description

List all image resources (also background images in styles) and checks if they are used correctly.

It checks:
- asset format (url vs. inline base64/svg)
- loading technique
- viewport position
- [transferesize](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming) 

## How to use it

<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->


| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet

Copy this code snippet into the bookmark to use it.



<details>

<summary>Bookmark Snippet</summary>


```javascript

javascript:(() => {var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var bgUrlChecker = /(url\(["'])([A-Za-z0-9$.:/_\-~]*)(["']\))(?!data:$)/g;
var base64UrlChecker = /(url\(["'])(data:)([A-Za-z0-9$.:/_\-~]*)/g;
var srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;
var bgSRule = 'background';
var bgImgSRule = 'background-image';
var msgNotLazyLoaded = "❌ not lazy loaded";
var msgNotEagerLoaded = "❌ not eager loaded";
var msgDontUseBgImage = "❌ don't use bg image";
var msgDontUseBgDataImage = "❌ don't use data:<format>";
var msgNotDisplayed = "⚠ fetched but not displayed";
var msgUnknown = "⚠ Case not implemented";
var msgOk = "🆗";
function fixUsage(imgs) {
    var l = '';
    imgs.forEach(function (i) {
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
    var s = '';
    imgs.forEach(function (i) {
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
        tag.offsetLeft < window.innerWidth;
}
function styles(tag, pseudoElt) {
    return window.getComputedStyle(tag, pseudoElt || null);
}
function getImgRelevantRules(tag) {
    var res = {
        withBgImgNodes: new Map(),
        withBgDataImgNodes: new Map()
    };
    var matchBgB64 = base64UrlChecker.exec(tag.attributes.src);
    if (matchBgB64) {
        res.withBgImgNodes.set(matchBgB64[3], tag);
    }
    [null, '::before', '::after']
        .map(function (pseudoElt) {
        var backgroundVal = styles(tag, pseudoElt).getPropertyValue(bgSRule);
        var backgroundImageVal = styles(tag, pseudoElt).getPropertyValue(bgImgSRule);
        var matchBg = bgUrlChecker.exec(backgroundVal) || bgUrlChecker.exec(backgroundImageVal);
        var matchBgB64 = base64UrlChecker.exec(backgroundVal) || base64UrlChecker.exec(backgroundImageVal);
        if (matchBg) {
            res.withBgImgNodes.set(matchBg[2], tag);
        }
        else if (matchBgB64) {
            res.withBgDataImgNodes.set(matchBgB64[3], tag);
        }
    });
    return res;
}
function getNetworkImgs() {
    var imgs = new Map();
    var resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(function (_a) {
        var name = _a.name, transferSize = _a.transferSize, initiatorType = _a.initiatorType;
        if (initiatorType == "img") {
            imgs.set(name, {
                name: name,
                transferSize: transferSize
            });
        }
    });
    return imgs;
}
function getImgsWithBackground(doc) {
    var withBgImgNames = new Set();
    var withBgImgNodes = new Map();
    var withBgDataImgNames = new Set();
    var withBgDataImgNodes = new Map();
    Array.from(doc.querySelectorAll('body *'))
        .forEach(function (tag) {
        var badRules = getImgRelevantRules(tag);
        Array.from(badRules.withBgImgNodes.entries()).forEach(function (_a) {
            var url = _a[0], _ = _a[1];
            withBgImgNodes.set(url, tag);
            withBgImgNames.add(url);
        });
        Array.from(badRules.withBgDataImgNodes.entries()).forEach(function (_a) {
            var url = _a[0], _ = _a[1];
            withBgDataImgNodes.set(url, tag);
            withBgDataImgNames.add(url);
        });
    });
    return { withBgImgNodes: withBgImgNodes, withBgImgNames: withBgImgNames, withBgDataImgNodes: withBgDataImgNodes, withBgDataImgNames: withBgDataImgNames };
}
function findImagesAndLoadingAttribute(doc) {
    var imgs = doc.querySelectorAll('img');
    var lazyLoadedAboveTheFoldNodes = new Map();
    var lazyLoadedAboveTheFoldNames = new Set();
    var eagerLoadedBelowTheFoldNodes = new Map();
    var eagerLoadedBelowTheFoldNames = new Set();
    imgs.forEach(function (tag) {
        var inViewPort = isInViewPort(tag);
        var url = tag.attributes.src ? tag.attributes.src.value : null;
        // Ignore images without URL since they might be handled by custom javaScript lazy loading technique.
        if (!url)
            return;
        var isLazy = tag.attributes.loading === 'lazy';
        if (isLazy && inViewPort) {
            lazyLoadedAboveTheFoldNodes.set(url, tag);
            lazyLoadedAboveTheFoldNames.add(url);
        }
        else if (!isLazy && !inViewPort) {
            eagerLoadedBelowTheFoldNodes.set(url, tag);
            eagerLoadedBelowTheFoldNames.add(url);
        }
    });
    return {
        lazyLoadedAboveTheFoldNames: lazyLoadedAboveTheFoldNames,
        lazyLoadedAboveTheFoldNodes: lazyLoadedAboveTheFoldNodes,
        eagerLoadedBelowTheFoldNames: eagerLoadedBelowTheFoldNames,
        eagerLoadedBelowTheFoldNodes: eagerLoadedBelowTheFoldNodes
    };
}
var _a = findImagesAndLoadingAttribute(document), lazyLoadedAboveTheFoldNodes = _a.lazyLoadedAboveTheFoldNodes, lazyLoadedAboveTheFoldNames = _a.lazyLoadedAboveTheFoldNames, eagerLoadedBelowTheFoldNodes = _a.eagerLoadedBelowTheFoldNodes, eagerLoadedBelowTheFoldNames = _a.eagerLoadedBelowTheFoldNames;
var _b = getImgsWithBackground(document), withBgDataImgNames = _b.withBgDataImgNames, withBgDataImgNodes = _b.withBgDataImgNodes, withBgImgNames = _b.withBgImgNames, withBgImgNodes = _b.withBgImgNodes;
var networkImgs = getNetworkImgs();
var allNames = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], lazyLoadedAboveTheFoldNames, true), eagerLoadedBelowTheFoldNames, true), withBgImgNames, true), withBgDataImgNames, true)));
function enrichSizeUsage(imgData) {
    return Promise.all(imgData.map(function (i, idx) {
        return new Promise(function (r) {
            var img = new Image;
            var wRetain = i.tag.width;
            var hRetain = i.tag.height;
            img.onload = function () {
                // mutation!
                imgData[idx].imgDisplayDiff = "".concat(wRetain, "/").concat(hRetain, " to ").concat(img.width, "/").concat(img.height);
                r();
            };
            img.onerror = r;
            img.src = i.url;
        });
    })).then(function () { return imgData; });
}
function enrichData() {
    return Array.from(allNames).map(function (url) {
        var imgData = {
            tag: 'n/a',
            url: url,
            error: '',
            transferSize: '?'
        };
        var errorDetected = true;
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
                imgData.transferSize = url.length * 1.02;
                break;
            default:
                errorDetected = false;
        }
        if (networkImgs.has(url)) {
            var _a = networkImgs.get(url), transferSize = _a.transferSize, decodedBodySize = _a.decodedBodySize, encodedBodySize = _a.encodedBodySize;
            imgData = __assign(__assign({}, imgData), { transferSize: transferSize, decodedBodySize: decodedBodySize });
            if (!errorDetected) {
                imgData.error = msgOk;
            }
        }
        return imgData;
    });
}
var d = enrichData();
highlightElements(d);
fixUsage(d);
enrichSizeUsage(d).then(console.table);
)()
``` 




</details>




### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var bgUrlChecker = /(url\(["'])([A-Za-z0-9$.:/_\-~]*)(["']\))(?!data:$)/g;
var base64UrlChecker = /(url\(["'])(data:)([A-Za-z0-9$.:/_\-~]*)/g;
var srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;
var bgSRule = 'background';
var bgImgSRule = 'background-image';
var msgNotLazyLoaded = "❌ not lazy loaded";
var msgNotEagerLoaded = "❌ not eager loaded";
var msgDontUseBgImage = "❌ don't use bg image";
var msgDontUseBgDataImage = "❌ don't use data:<format>";
var msgNotDisplayed = "⚠ fetched but not displayed";
var msgUnknown = "⚠ Case not implemented";
var msgOk = "🆗";
function fixUsage(imgs) {
    var l = '';
    imgs.forEach(function (i) {
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
    var s = '';
    imgs.forEach(function (i) {
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
        tag.offsetLeft < window.innerWidth;
}
function styles(tag, pseudoElt) {
    return window.getComputedStyle(tag, pseudoElt || null);
}
function getImgRelevantRules(tag) {
    var res = {
        withBgImgNodes: new Map(),
        withBgDataImgNodes: new Map()
    };
    var matchBgB64 = base64UrlChecker.exec(tag.attributes.src);
    if (matchBgB64) {
        res.withBgImgNodes.set(matchBgB64[3], tag);
    }
    [null, '::before', '::after']
        .map(function (pseudoElt) {
        var backgroundVal = styles(tag, pseudoElt).getPropertyValue(bgSRule);
        var backgroundImageVal = styles(tag, pseudoElt).getPropertyValue(bgImgSRule);
        var matchBg = bgUrlChecker.exec(backgroundVal) || bgUrlChecker.exec(backgroundImageVal);
        var matchBgB64 = base64UrlChecker.exec(backgroundVal) || base64UrlChecker.exec(backgroundImageVal);
        if (matchBg) {
            res.withBgImgNodes.set(matchBg[2], tag);
        }
        else if (matchBgB64) {
            res.withBgDataImgNodes.set(matchBgB64[3], tag);
        }
    });
    return res;
}
function getNetworkImgs() {
    var imgs = new Map();
    var resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(function (_a) {
        var name = _a.name, transferSize = _a.transferSize, initiatorType = _a.initiatorType;
        if (initiatorType == "img") {
            imgs.set(name, {
                name: name,
                transferSize: transferSize
            });
        }
    });
    return imgs;
}
function getImgsWithBackground(doc) {
    var withBgImgNames = new Set();
    var withBgImgNodes = new Map();
    var withBgDataImgNames = new Set();
    var withBgDataImgNodes = new Map();
    Array.from(doc.querySelectorAll('body *'))
        .forEach(function (tag) {
        var badRules = getImgRelevantRules(tag);
        Array.from(badRules.withBgImgNodes.entries()).forEach(function (_a) {
            var url = _a[0], _ = _a[1];
            withBgImgNodes.set(url, tag);
            withBgImgNames.add(url);
        });
        Array.from(badRules.withBgDataImgNodes.entries()).forEach(function (_a) {
            var url = _a[0], _ = _a[1];
            withBgDataImgNodes.set(url, tag);
            withBgDataImgNames.add(url);
        });
    });
    return { withBgImgNodes: withBgImgNodes, withBgImgNames: withBgImgNames, withBgDataImgNodes: withBgDataImgNodes, withBgDataImgNames: withBgDataImgNames };
}
function findImagesAndLoadingAttribute(doc) {
    var imgs = doc.querySelectorAll('img');
    var lazyLoadedAboveTheFoldNodes = new Map();
    var lazyLoadedAboveTheFoldNames = new Set();
    var eagerLoadedBelowTheFoldNodes = new Map();
    var eagerLoadedBelowTheFoldNames = new Set();
    imgs.forEach(function (tag) {
        var inViewPort = isInViewPort(tag);
        var url = tag.attributes.src ? tag.attributes.src.value : null;
        // Ignore images without URL since they might be handled by custom javaScript lazy loading technique.
        if (!url)
            return;
        var isLazy = tag.attributes.loading === 'lazy';
        if (isLazy && inViewPort) {
            lazyLoadedAboveTheFoldNodes.set(url, tag);
            lazyLoadedAboveTheFoldNames.add(url);
        }
        else if (!isLazy && !inViewPort) {
            eagerLoadedBelowTheFoldNodes.set(url, tag);
            eagerLoadedBelowTheFoldNames.add(url);
        }
    });
    return {
        lazyLoadedAboveTheFoldNames: lazyLoadedAboveTheFoldNames,
        lazyLoadedAboveTheFoldNodes: lazyLoadedAboveTheFoldNodes,
        eagerLoadedBelowTheFoldNames: eagerLoadedBelowTheFoldNames,
        eagerLoadedBelowTheFoldNodes: eagerLoadedBelowTheFoldNodes
    };
}
var _a = findImagesAndLoadingAttribute(document), lazyLoadedAboveTheFoldNodes = _a.lazyLoadedAboveTheFoldNodes, lazyLoadedAboveTheFoldNames = _a.lazyLoadedAboveTheFoldNames, eagerLoadedBelowTheFoldNodes = _a.eagerLoadedBelowTheFoldNodes, eagerLoadedBelowTheFoldNames = _a.eagerLoadedBelowTheFoldNames;
var _b = getImgsWithBackground(document), withBgDataImgNames = _b.withBgDataImgNames, withBgDataImgNodes = _b.withBgDataImgNodes, withBgImgNames = _b.withBgImgNames, withBgImgNodes = _b.withBgImgNodes;
var networkImgs = getNetworkImgs();
var allNames = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], lazyLoadedAboveTheFoldNames, true), eagerLoadedBelowTheFoldNames, true), withBgImgNames, true), withBgDataImgNames, true)));
function enrichSizeUsage(imgData) {
    return Promise.all(imgData.map(function (i, idx) {
        return new Promise(function (r) {
            var img = new Image;
            var wRetain = i.tag.width;
            var hRetain = i.tag.height;
            img.onload = function () {
                // mutation!
                imgData[idx].imgDisplayDiff = "".concat(wRetain, "/").concat(hRetain, " to ").concat(img.width, "/").concat(img.height);
                r();
            };
            img.onerror = r;
            img.src = i.url;
        });
    })).then(function () { return imgData; });
}
function enrichData() {
    return Array.from(allNames).map(function (url) {
        var imgData = {
            tag: 'n/a',
            url: url,
            error: '',
            transferSize: '?'
        };
        var errorDetected = true;
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
                imgData.transferSize = url.length * 1.02;
                break;
            default:
                errorDetected = false;
        }
        if (networkImgs.has(url)) {
            var _a = networkImgs.get(url), transferSize = _a.transferSize, decodedBodySize = _a.decodedBodySize, encodedBodySize = _a.encodedBodySize;
            imgData = __assign(__assign({}, imgData), { transferSize: transferSize, decodedBodySize: decodedBodySize });
            if (!errorDetected) {
                imgData.error = msgOk;
            }
        }
        return imgData;
    });
}
var d = enrichData();
highlightElements(d);
fixUsage(d);
enrichSizeUsage(d).then(console.table);

``` 




</details>




<!-- END-HOW_TO -->











<img width="595" alt="loading1" src="https://user-images.githubusercontent.com/10064416/206700419-3c8e4ced-a75a-44c1-bc4f-b00294a5de22.PNG">

# Credits

The network part is borrowed from:
Author: _Joan León_  
Source: _[github.com/csswizardry/ct](https://github.com/csswizardry/ct)_  

Additional loading checks are implemented by:
Author: _Michael Hladky - push-based.io_  
Source: _[github.com/push-based/web-performance-tools](www.github.com/push-based/web-performance-tools)_  


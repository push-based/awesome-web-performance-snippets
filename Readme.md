# Awesome Web Performance Snippets

## Third Party Sources

Included scripts from other open source authors and repositories:
- [webperf-snippets](https://github.com/nucliweb/webperf-snippets) from [Joan León](https://joanleon.dev/)
- [header-check](https://github.com/csswizardry/ct) from [Harry Roberts](https://csswizardry.com/)


## How to use a snippet?

- [how-to-use-it-with-console-tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-console-tab.md)
- [how-to-use-it-with-source-tab](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-sources-tab.md)
- [how-to-use-it-with-bookmarks](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-bookmarks.md)
- [how-to-use-it-with-chromium](https://github.com/push-based/web-performance-tools/blob/master/docs/how-to-use-it-with-chromium.md)

<!-- START-SNIPPETS -->

## [Check first and third party script](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/check-first-and-third-party-script)  

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
// ex: katespade.com - list firsty party subdomains in HOSTS array
var HOSTS = ["assets.katespade.com"];
function getScriptInfo() {
    var resourceListEntries = performance.getEntriesByType("resource");
    // set for first party scripts
    var first = [];
    // set for third party scripts
    var third = [];
    resourceListEntries.forEach(function (resource) {
        // check for initiator type
        var value = "initiatorType" in resource;
        if (value) {
            if (resource.initiatorType === "script") {
                var host = new URL(resource.name).host;
                // check if resource url host matches location.host = first party script
                if (host === location.host || HOSTS.includes(host)) {
                    first.push(__assign(__assign({}, resource.toJSON()), { type: "First Party" }));
                }
                else {
                    // add to third party script
                    third.push(__assign(__assign({}, resource.toJSON()), { type: "Third Party" }));
                }
            }
        }
    });
    var scripts = {
        firstParty: [{ name: "no data" }],
        thirdParty: [{ name: "no data" }]
    };
    if (first.length) {
        scripts.firstParty = first;
    }
    if (third.length) {
        scripts.thirdParty = third;
    }
    return scripts;
}
var _a = getScriptInfo(), firstParty = _a.firstParty, thirdParty = _a.thirdParty;
console.groupCollapsed("FIRST PARTY SCRIPTS");
console.table(firstParty);
console.groupEnd();
console.groupCollapsed("THIRD PARTY SCRIPTS");
console.table(thirdParty);
console.groupEnd();
export {};
/*
Choose which properties to display
https://developer.mozilla.org/en-US/docs/Web/API/console/table

console.groupCollapsed("FIRST PARTY SCRIPTS");
console.table(firstParty, ["name", "nextHopProtocol"]);
console.groupEnd();
console.groupCollapsed("THIRD PARTY SCRIPTS", ["name", "nextHopProtocol"]);
console.table(thirdParty);
console.groupEnd();
*/

``` 




</details>



  
## [Check first and third party script timings](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/check-first-and-third-party-script-timings)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function createUniqueLists(firstParty, thirdParty) {
    function getUniqueListBy(arr, key) {
        return __spreadArray([], new Map(arr.map(function (item) { return [item[key], item]; })).values(), true);
    }
    var firstPartyList = getUniqueListBy(firstParty, ["name"]);
    var thirdPartyList = getUniqueListBy(thirdParty, ["name"]);
    return { firstPartyList: firstPartyList, thirdPartyList: thirdPartyList };
}
var _a = createUniqueLists(firstParty, thirdParty), firstPartyList = _a.firstPartyList, thirdPartyList = _a.thirdPartyList;
function calculateTimings(party, type) {
    var partyChoice = party === "first" ? firstParty : thirdParty;
    var timingChoices = {
        DNS_TIME: ["domainLookupEnd", "domainLookupStart"],
        TCP_HANDSHAKE: ["connectEnd", "connectStart"],
        RESPONSE_TIME: ["responseEnd", "responseStart"],
        SECURE_CONNECTION_TIME: ["connectEnd", "secureConnectionStart", 0],
        FETCH_UNTIL_RESPONSE: ["responseEnd", "fetchStart", 0],
        REQ_START_UNTIL_RES_END: ["responseEnd", "requestStart", 0],
        START_UNTIL_RES_END: ["responseEnd", "startTime", 0],
        REDIRECT_TIME: ["redirectEnd", "redirectStart"]
    };
    function handleChoices(timingEnd, timingStart, num) {
        if (!num) {
            return timingEnd - timingStart;
        }
        if (timingStart > 0) {
            return timingEnd - timingStart;
        }
        return 0;
    }
    var timings = partyChoice.map(function (script) {
        var _a;
        var _b = timingChoices[type], timingEnd = _b[0], timingStart = _b[1], num = _b[2];
        var endValue = script[timingEnd];
        var startValue = script[timingStart];
        return _a = {
                name: script.name
            },
            _a[type] = handleChoices(endValue, startValue, num),
            _a;
    });
    return timings;
}
// Available Options
var timingOptions = [
    "DNS_TIME",
    "TCP_HANDSHAKE",
    "RESPONSE_TIME",
    "SECURE_CONNECTION_TIME",
    "FETCH_UNTIL_RESPONSE",
    "REQ_START_UNTIL_RES_END",
    "START_UNTIL_RES_END",
    "REDIRECT_TIME",
];
// run em all!
// https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#timing_resource_loading_phases
timingOptions.forEach(function (timing) {
    console.groupCollapsed("FIRST PARTY: ".concat(timing));
    console.table(calculateTimings("first", timing));
    console.groupEnd();
    console.groupCollapsed("THIRD PARTY: ".concat(timing));
    console.table(calculateTimings("third", timing));
    console.groupEnd();
});
// choose your battle - arg1 is string either "first" or "third", arg2 is string timing option listed above.
console.table(calculateTimings("first", "REQ_START_UNTIL_RES_END"));

``` 




</details>



  
## [Check header](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/check-header)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

(function () {
    var ct = document.createElement('style');
    ct.innerText = "\n    /*!==========================================================================\n   #CT.CSS\n   ========================================================================== */\n\n/*!\n * ct.css \u2013 Let\u2019s take a look inside your <head>\u2026\n *\n * \u00A9 Harry Roberts 2021 \u2013 twitter.com/csswizardry\n */\n\n\n\n\n\n/**\n * It\u2019s slightly easier to remember topics than it is colours. Set up some\n * custom properties for use later on.\n */\n\nhead {\n  --ct-is-problematic: solid;\n  --ct-is-affected: dashed;\n  --ct-notify: #0bce6b;\n  --ct-warn: #ffa400;\n  --ct-error: #ff4e42;\n}\n\n\n\n\n\n/**\n * Show the <head> and set up the items we might be interested in.\n */\n\nhead,\nhead script,\nhead script:not([src])[async],\nhead script:not([src])[defer],\nhead style, head [rel=\"stylesheet\"],\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  display: block;\n}\n\nhead script,\nhead style, head [rel=\"stylesheet\"],\nhead title,\nhead script ~ meta[http-equiv=\"content-security-policy\"],\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  margin: 5px;\n  padding: 5px;\n  border-width: 5px;\n  background-color: white;\n  color: #333;\n}\n\nhead ::before,\nhead script, head style {\n  font: 16px/1.5 monospace, monospace;\n  display: block;\n}\n\nhead ::before {\n  font-weight: bold;\n}\n\n\n\n\n\n/**\n * External Script and Style\n */\n\nhead script[src],\nhead link[rel=\"stylesheet\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src]::before {\n    content: \"[Blocking Script \u2013 \" attr(src) \"]\"\n  }\n\n  head link[rel=\"stylesheet\"]::before {\n    content: \"[Blocking Stylesheet \u2013 \" attr(href) \"]\"\n  }\n\n\n\n\n\n/**\n * Inline Script and Style.\n */\n\nhead style:not(:empty),\nhead script:not(:empty) {\n  max-height: 5em;\n  overflow: auto;\n  background-color: #ffd;\n  white-space: pre;\n  border-color: var(--ct-notify);\n  border-style: var(--ct-is-problematic);\n}\n\n  head script:not(:empty)::before {\n    content: \"[Inline Script] \";\n  }\n\n  head style:not(:empty)::before {\n    content: \"[Inline Style] \";\n  }\n\n\n\n\n\n/**\n * Blocked Title.\n *\n * These selectors are generally more complex because the Key Selector (`title`)\n * depends on the specific conditions of preceding JS--we can\u2019t cast a wide net\n * and narrow it down later as we can when targeting elements directly.\n */\n\nhead script[src]:not([async]):not([defer]):not([type=module]) ~ title,\nhead script:not(:empty) ~ title {\n  display: block;\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-error);\n}\n\n  head script[src]:not([async]):not([defer]):not([type=module]) ~ title::before,\n  head script:not(:empty) ~ title::before {\n    content: \"[<title> blocked by JS] \";\n  }\n\n\n\n\n\n/**\n * Blocked Scripts.\n *\n * These selectors are generally more complex because the Key Selector\n * (`script`) depends on the specific conditions of preceding CSS--we can\u2019t cast\n * a wide net and narrow it down later as we can when targeting elements\n * directly.\n */\n\nhead [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script,\nhead style:not(:empty) ~ script {\n  border-style: var(--ct-is-affected);\n  border-color: var(--ct-warn);\n}\n\n  head [rel=\"stylesheet\"]:not([media=\"print\"]):not(.ct) ~ script::before,\n  head style:not(:empty) ~ script::before {\n    content: \"[JS blocked by CSS \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Using both `async` and `defer` is redundant (an anti-pattern, even). Let\u2019s\n * flag that.\n */\n\nhead script[src][src][async][defer] {\n  display: block;\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script[src][src][async][defer]::before {\n    content: \"[async and defer is redundant: prefer defer \u2013 \" attr(src) \"]\";\n  }\n\n\n\n\n\n/**\n * Async and defer simply do not work on inline scripts. It won\u2019t do any harm,\n * but it\u2019s useful to know about.\n */\nhead script:not([src])[async],\nhead script:not([src])[defer] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\n  head script:not([src])[async]::before {\n    content: \"The async attribute is redundant on inline scripts\"\n  }\n\n  head script:not([src])[defer]::before {\n    content: \"The defer attribute is redundant on inline scripts\"\n  }\n\n\n\n\n\n/**\n * Third Party blocking resources.\n *\n * Expect false-positives here\u2026 it\u2019s a crude proxy at best.\n *\n * Selector-chaining (e.g. `[src][src]`) is used to bump up specificity.\n */\n\nhead script[src][src][src^=\"//\"],\nhead script[src][src][src^=\"http\"],\nhead [rel=\"stylesheet\"][href^=\"//\"],\nhead [rel=\"stylesheet\"][href^=\"http\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script[src][src][src^=\"//\"]::before,\n  head script[src][src][src^=\"http\"]::before {\n    content: \"[Third Party Blocking Script \u2013 \" attr(src) \"]\";\n  }\n\n  head [rel=\"stylesheet\"][href^=\"//\"]::before,\n  head [rel=\"stylesheet\"][href^=\"http\"]::before {\n    content: \"[Third Party Blocking Stylesheet \u2013 \" attr(href) \"]\";\n  }\n\n\n\n\n\n/**\n * Mid-HEAD CSP disables the Preload Scanner\n */\n\nhead script ~ meta[http-equiv=\"content-security-policy\"] {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-error);\n}\n\n  head script ~ meta[http-equiv=\"content-security-policy\"]::before {\n    content: \"[Meta CSP defined after JS]\"\n  }\n\n\n\n\n\n/**\n * Charset should appear as early as possible\n */\nhead > meta[charset]:not(:nth-child(-n+5)) {\n  border-style: var(--ct-is-problematic);\n  border-color: var(--ct-warn);\n}\n\nhead > meta[charset]:not(:nth-child(-n+5))::before {\n  content: \"[Charset should appear as early as possible]\";\n}\n\n\n\n\n\n/**\n * Hide all irrelevant or non-matching scripts and styles (including ct.css).\n *\n * We\u2019re done!\n */\n\nlink[rel=\"stylesheet\"][media=\"print\"],\nlink[rel=\"stylesheet\"].ct, style.ct,\nscript[async], script[defer], script[type=module] {\n  display: none;\n}\n    ";
    ct.classList.add('ct');
    document.head.appendChild(ct);
}());

``` 




</details>



  
## [Check image sizes](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/check-image-sizes)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

function getImgs(sortBy) {
    var imgs = [];
    var resourceListEntries = performance.getEntriesByType("resource");
    resourceListEntries.forEach(function (_a) {
        var name = _a.name, transferSize = _a.transferSize, encodedBodySize = _a.encodedBodySize, decodedBodySize = _a.decodedBodySize, initiatorType = _a.initiatorType;
        if (initiatorType == "img") {
            imgs.push({
                name: name,
                transferSize: transferSize,
                decodedBodySize: decodedBodySize,
                encodedBodySize: encodedBodySize
            });
        }
    });
    var imgList = imgs.sort(function (a, b) {
        return b[sortBy] - a[sortBy];
    });
    return imgList;
}
console.table(getImgs("encodedBodySize"));

``` 




</details>



  
## [Check image usage](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/check-image-usage)  

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



  
## [Cls](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/cls)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

function genColor() {
    var n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
}
// console.log(shifts) to see full list of shifts above threshold
var shifts = [];
// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load
function findShifts(threshold) {
    return new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
            if (entry.value > threshold && !entry.hadRecentInput) {
                var color_1 = genColor();
                shifts.push(entry);
                console.log(shifts);
                var valueNode_1 = document.createElement("details");
                valueNode_1.innerHTML = "\n<summary>Layout Shift: ".concat(entry.value, "</summary>\n<pre>").concat(JSON.stringify(entry, null, 2), "</pre>\n");
                valueNode_1.style = "color: ".concat(color_1, ";");
                entry.sources.forEach(function (source) {
                    source.node.parentNode.insertBefore(valueNode_1, source.node);
                    source.node.style = "border: 2px ".concat(color_1, " solid");
                });
            }
        });
    });
}
findShifts(0.05).observe({ entryTypes: ["layout-shift"] });

``` 




</details>



  
## [Cumulative layout shift](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/cumulative-layout-shift)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

try {
    var cumulativeLayoutShiftScore_1 = 0;
    var observer_1 = new PerformanceObserver(function (list) {
        for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore_1 += entry.value;
            }
        }
    });
    observer_1.observe({ type: "layout-shift", buffered: true });
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            observer_1.takeRecords();
            observer_1.disconnect();
            console.log("CLS: ".concat(cumulativeLayoutShiftScore_1));
        }
    });
}
catch (e) {
    console.log("Browser doesn't support this API");
}

``` 




</details>



  
## [Full relayout](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/full-relayout)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var b = document.body;
b.style.zoom === '1' ? b.style.zoom = '1.01' : b.style.zoom = '1';

``` 




</details>



  
## [Gathering styles](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/gathering-styles)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

console.log(Array.from(document.querySelectorAll('style'))
    .map(function (a) { return a.innerText; })
    .reduce(function (a, b) { return a + b; }));

``` 




</details>



  
## [Get Attribute Directives](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/getAttributeDirectives)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function getAttributeDirectives() {
    var _a = initializeFlow(), name = _a.name, showSummaryInDOM = _a.showSummaryInDOM, appPrefixes = _a.appPrefixes, mode = _a.mode;
    /**
     * Filter out nodes that don't have an attribute
     */
    function filterAttribute(attribute, prefixes) {
        return Array.isArray(prefixes)
            ? prefixes.some(function (p) {
                return attribute.name ? attribute.name.startsWith(p.toLowerCase()) : false;
            })
            : attribute.name
                ? attribute.name.startsWith(prefixes.toLowerCase())
                : false;
    }
    function initializeFlow() {
        /**
         * Clearing summary items from DOM.
         */
        var summaries = document.querySelectorAll(".customSummaryItem");
        summaries.forEach(function (i) { return i.remove(); });
        var mode = prompt("Mode: summary or directive");
        switch (mode) {
            case "directive":
                return {
                    mode: mode,
                    name: prompt("Directive name"),
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false
                };
            case "summary":
                return {
                    mode: mode,
                    appPrefixes: prompt("Directives prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map(function (p) { return p.trim(); }) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false
                };
        }
    }
    /**
     * Set of checks to determine if element is hidden.
     */
    function isHidden(element) {
        return !(element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length);
    }
    // Checks if element is in viewport
    function isInViewport(element) {
        return (element.offsetTop < window.innerHeight &&
            element.offsetTop > -element.offsetHeight &&
            element.offsetLeft > -element.offsetWidth &&
            element.offsetLeft < window.innerWidth);
    }
    /**
     * Adds summary div to references
     */
    function addSummary(nodes, prefixes) {
        nodes.forEach(function (n) {
            n.style.position = "relative";
            var node = document.createElement("DIV");
            Object.assign(node.style, {
                position: "absolute",
                top: "0",
                left: "0",
                "z-index": "999999",
                "font-size": "14px",
                display: "flex",
                background: "green",
                color: "#fff",
                padding: "4px"
            });
            node.classList.add("customSummaryItem");
            var text = document.createTextNode("".concat(__spreadArray([], n.attributes, true).filter(function (a) { return filterAttribute(a, prefixes); })
                .map(function (a) { return a.name; }).length));
            node.appendChild(text);
            n.appendChild(node);
        });
    }
    /**
     * Finds references of the nodes that contain directive with given name
     */
    function findReferences(name) {
        var directives = Array.from(document.querySelectorAll("[".concat(name, "]"))).map(function (r) {
            return {
                name: name,
                hidden: isHidden(r),
                visible: !isHidden(r),
                inViewport: isInViewport(r),
                outOfViewport: !isInViewport(r),
                reference: r
            };
        });
        return {
            all: directives,
            visible: directives.filter(function (c) { return !c.hidden; }),
            hidden: directives.filter(function (c) { return c.hidden; }),
            inViewport: directives.filter(function (c) { return c.inViewport; }),
            outOfViewport: directives.filter(function (c) { return !c.inViewport; })
        };
    }
    /**
     * Get summary data for all directives
     */
    function getAllDirectivesSummary(prefixes) {
        var nodesWithDirectives = Array.from(document.body.querySelectorAll("*")).filter(function (e) {
            return Array.from(e.attributes).some(function (a) { return filterAttribute(a, prefixes); });
        });
        var directives = 
        // Find unique components names in page
        __spreadArray([], new Set(nodesWithDirectives
            .map(function (e) {
            return __spreadArray([], e.attributes, true).filter(function (a) { return filterAttribute(a, prefixes); })
                .map(function (a) { return a.name; });
        })
            .reduce(function (acc, val) { return __spreadArray(__spreadArray([], acc, true), val, true); }, [])), true).map(function (name) { return getSpecificDirectiveSummary(name); })
            .reduce(function (acc, val) { return __spreadArray(__spreadArray([], acc, true), [val[0]], false); }, []);
        if (showSummaryInDOM) {
            addSummary(nodesWithDirectives, prefixes);
        }
        return __spreadArray([
            {
                name: "📝TOTAL",
                visible: directives
                    .map(function (c) { return c.visible; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                hidden: directives
                    .map(function (c) { return c.hidden; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                inViewport: directives
                    .map(function (c) { return c.inViewport; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                outOfViewport: directives
                    .map(function (c) { return c.outOfViewport; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                reference: "----"
            }
        ], directives, true);
    }
    /**
     * Get summary data for specific directive
     */
    function getSpecificDirectiveSummary(name, showSummary) {
        var _a = findReferences(name), all = _a.all, visible = _a.visible, hidden = _a.hidden, inViewport = _a.inViewport, outOfViewport = _a.outOfViewport;
        if (showSummary) {
            addSummary(all.map(function (e) { return e.reference; }), name);
        }
        return __spreadArray([
            {
                name: "\uD83D\uDC49 ".concat(name),
                visible: visible.length,
                hidden: hidden.length,
                inViewport: inViewport.length,
                outOfViewport: outOfViewport.length,
                reference: {
                    visible: visible,
                    hidden: hidden,
                    inViewport: inViewport,
                    outOfViewport: outOfViewport
                }
            }
        ], all, true);
    }
    switch (mode) {
        case "directive":
            return console.table(getSpecificDirectiveSummary(name, showSummaryInDOM));
        case "summary":
            return console.table(getAllDirectivesSummary(appPrefixes));
    }
}

``` 




</details>



  
## [Get Components Nodes](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/getComponentsNodes)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function index() {
    var _a = initializeFlow(), name = _a.name, showSummaryInDOM = _a.showSummaryInDOM, appPrefixes = _a.appPrefixes, mode = _a.mode, allNodes = _a.allNodes, visibleNodes = _a.visibleNodes, hiddenNodes = _a.hiddenNodes, inViewportNodes = _a.inViewportNodes, outOfViewportNodes = _a.outOfViewportNodes;
    /**
     * Flow init
     */
    function initializeFlow() {
        /**
         * Clearing summary items from DOM.
         */
        var summaries = document.querySelectorAll(".customSummaryItem");
        summaries.forEach(function (i) { return i.remove(); });
        var mode = prompt("Mode: summary or component");
        var allNodes = Array.from(document.body.querySelectorAll("*"));
        var visibleNodes = [];
        var hiddenNodes = [];
        var inViewportNodes = [];
        var outOfViewportNodes = [];
        allNodes.forEach(function (n) {
            if (isHidden(n)) {
                hiddenNodes.push(n);
            }
            else {
                visibleNodes.push(n);
            }
            if (isInViewport(n)) {
                inViewportNodes.push(n);
            }
            else {
                outOfViewportNodes.push(n);
            }
        });
        switch (mode) {
            case "component":
                return {
                    mode: mode,
                    name: prompt("Component name"),
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
                    allNodes: allNodes,
                    visibleNodes: visibleNodes,
                    hiddenNodes: hiddenNodes,
                    inViewportNodes: inViewportNodes,
                    outOfViewportNodes: outOfViewportNodes
                };
            case "summary":
                return {
                    mode: mode,
                    appPrefixes: prompt("Components prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map(function (p) { return p.trim(); }) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
                    allNodes: allNodes,
                    visibleNodes: visibleNodes,
                    hiddenNodes: hiddenNodes,
                    inViewportNodes: inViewportNodes,
                    outOfViewportNodes: outOfViewportNodes
                };
        }
    }
    /**
     * Set of checks to determine if element is hidden.
     */
    function isHidden(element) {
        return !(element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length);
    }
    /**
     * Checks if element is in viewport.
     */
    function isInViewport(element) {
        return (element.offsetTop < window.innerHeight &&
            element.offsetTop > -element.offsetHeight &&
            element.offsetLeft > -element.offsetWidth &&
            element.offsetLeft < window.innerWidth);
    }
    /**
     * Adds summary div to references
     */
    function addSummary(nodes) {
        nodes.forEach(function (n) {
            n.references.self.style.position = "relative";
            var node = document.createElement("DIV");
            var totalNode = document.createElement("SPAN");
            var visibleNode = document.createElement("SPAN");
            var hiddenNode = document.createElement("SPAN");
            var totalText = document.createTextNode(" Total: ".concat(n.visibleNodes + n.hiddenNodes, " "));
            var visibleText = document.createTextNode(" Visible: ".concat(n.visibleNodes, " "));
            var hiddenText = document.createTextNode(" Hidden: ".concat(n.hiddenNodes, " "));
            /**
             * Appending styles
             */
            Object.assign(node.style, {
                position: "absolute",
                top: "0",
                left: "0",
                "z-index": "999999",
                "font-size": "14px",
                display: "flex"
            });
            Object.assign(totalNode.style, { background: "black", color: "#fff" });
            Object.assign(visibleNode.style, { background: "green", color: "#fff" });
            Object.assign(hiddenNode.style, { background: "red", color: "#fff" });
            totalNode.appendChild(totalText);
            visibleNode.appendChild(visibleText);
            hiddenNode.appendChild(hiddenText);
            node.appendChild(totalNode);
            node.appendChild(visibleNode);
            node.appendChild(hiddenNode);
            node.classList.add("customSummaryItem");
            n.references.self.appendChild(node);
        });
    }
    /**
     * Finds references of the component with given name
     */
    function findReferences(name, showSummary) {
        var components = Array.from(document.querySelectorAll(name)).map(function (r) {
            var childNodes = __spreadArray([r], r.querySelectorAll("*"), true);
            var hiddenNodes = [];
            var visibleNodes = [];
            var inViewportNodes = [];
            var outOfViewportNodes = [];
            childNodes.forEach(function (c) {
                if (isHidden(c)) {
                    hiddenNodes.push(c);
                }
                else {
                    visibleNodes.push(c);
                }
                if (isInViewport(c)) {
                    inViewportNodes.push(c);
                }
                else {
                    outOfViewportNodes.push(c);
                }
            });
            return {
                name: r.nodeName,
                nodes: childNodes.length,
                visibleNodes: visibleNodes.length,
                hiddenNodes: hiddenNodes.length,
                inViewportNodes: inViewportNodes.length,
                outOfViewportNodes: outOfViewportNodes.length,
                hidden: isHidden(r),
                visible: !isHidden(r),
                inViewport: isInViewport(r),
                outOfViewport: !isInViewport(r),
                references: {
                    self: r,
                    visibleNodes: visibleNodes,
                    hiddenNodes: hiddenNodes,
                    inViewportNodes: inViewportNodes,
                    outOfViewportNodes: outOfViewportNodes
                }
            };
        });
        if (showSummary) {
            addSummary(components);
        }
        return {
            all: components,
            visible: components.filter(function (c) { return !c.hidden; }),
            hidden: components.filter(function (c) { return c.hidden; }),
            inViewport: components.filter(function (c) { return c.inViewport; }),
            outOfViewport: components.filter(function (c) { return !c.inViewport; })
        };
    }
    /**
     * Get summary data for all components
     */
    function getAllComponentsSummary(prefixes) {
        var components = __spreadArray([], new Set(allNodes
            .filter(function (e) {
            return Array.isArray(prefixes)
                ? prefixes.some(function (p) { return e.nodeName.startsWith(p.toUpperCase()); })
                : e.nodeName.startsWith(prefix.toUpperCase());
        })
            .map(function (e) { return e.nodeName; })), true).map(function (name) { return getSpecificComponentSummary(name); })
            .reduce(function (acc, val) { return __spreadArray(__spreadArray([], acc, true), [val[0]], false); }, []);
        return __spreadArray([
            {
                name: "📝TOTAL",
                visible: components
                    .map(function (c) { return c.visible; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                hidden: components
                    .map(function (c) { return c.hidden; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                inViewport: components
                    .map(function (c) { return c.inViewport; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                outOfViewport: components
                    .map(function (c) { return c.outOfViewport; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                nodes: allNodes.length,
                visibleNodes: visibleNodes.length,
                hiddenNodes: hiddenNodes.length,
                inViewportNodes: inViewportNodes.length,
                outOfViewportNodes: outOfViewportNodes.length,
                references: "----"
            }
        ], components, true);
    }
    /**
     * Get summary data for provided component name
     */
    function getSpecificComponentSummary(name) {
        var _a = findReferences(name.toUpperCase(), showSummaryInDOM), all = _a.all, visible = _a.visible, hidden = _a.hidden, inViewport = _a.inViewport, outOfViewport = _a.outOfViewport;
        return __spreadArray([
            {
                name: "\uD83D\uDC49 ".concat(name.toUpperCase()),
                // Components counters
                visible: visible.length,
                hidden: hidden.length,
                inViewport: inViewport.length,
                outOfViewport: outOfViewport.length,
                // Nodes counters
                nodes: all.map(function (r) { return r.nodes; }).reduce(function (acc, val) { return acc + val; }, 0),
                visibleNodes: all
                    .map(function (r) { return (!r.hidden ? r.visibleNodes : 0); })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                hiddenNodes: all
                    .map(function (r) { return (r.hidden ? r.nodes : r.hiddenNodes); })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                inViewportNodes: all
                    .map(function (r) { return r.inViewportNodes; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                outOfViewportNodes: all
                    .map(function (r) { return r.outOfViewportNodes; })
                    .reduce(function (acc, val) { return acc + val; }, 0),
                // References
                references: {
                    visible: visible,
                    hidden: hidden,
                    inViewport: inViewport,
                    outOfViewport: outOfViewport
                }
            }
        ], all, true);
    }
    switch (mode) {
        case "component":
            return console.table(getSpecificComponentSummary(name));
        case "summary":
            return console.table(getAllComponentsSummary(appPrefixes));
    }
}

``` 




</details>



  
## [Get DOMEvent Listeners](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/getDOMEventListeners)  

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
function getDOMEventListeners() {
    // Get all elements with event listeners
    var elements = __spreadArray([document], document.querySelectorAll("*"), true).map(function (e) {
        var elementListeners = window.getEventListeners(e);
        return {
            element: e,
            listeners: Object.keys(elementListeners)
                .map(function (key) {
                var _a;
                return (_a = {},
                    _a[key] = elementListeners[key],
                    _a);
            })
                .reduce(function (acc, listener) { return (__assign(__assign({}, acc), listener)); }, {})
        };
    })
        .filter(function (el) { return Object.keys(el.listeners).length; });
    // Find unique listeners names
    var names = new Set(elements
        .map(function (e) { return Object.keys(e.listeners); })
        .reduce(function (acc, listener) { return __spreadArray(__spreadArray([], acc, true), listener, true); }, []));
    // Form output table
    var table = __spreadArray([], names, true).reduce(function (acc, n) {
        var withListener = elements.filter(function (e) { return e.listeners[n]; });
        var total = withListener.reduce(function (acc, e) { return acc + e.listeners[n].length; }, 0);
        var activeListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return !l.passive; }).length; }, 0);
        var activeReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return !l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var passiveListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.passive; }).length; }, 0);
        var passiveReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var onceListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.once; }).length; }, 0);
        var onceReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.once; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        return __spreadArray(__spreadArray([], acc, true), [
            {
                name: n,
                total: total,
                activeListeners: activeListeners,
                activeListeners: activeListeners,
                passiveListeners: passiveListeners,
                onceListeners: onceListeners,
                references: {
                    active: activeReferences,
                    passive: passiveReferences,
                    once: onceReferences
                }
            },
        ], false);
    }, []);
    console.table(__spreadArray([
        {
            name: "📝TOTAL",
            total: table.reduce(function (acc, val) { return acc + val.total; }, 0),
            activeListeners: table.reduce(function (acc, val) { return acc + val.activeListeners; }, 0),
            passiveListeners: table.reduce(function (acc, val) { return acc + val.passiveListeners; }, 0),
            onceListeners: table.reduce(function (acc, val) { return acc + val.onceListeners; }, 0),
            references: "----"
        }
    ], table, true));
}

``` 




</details>



  
## [Get Nodes Info](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/getNodesInfo)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function index(root) {
    if (root === void 0) { root = document.body; }
    var allNodes = __spreadArray([], root.querySelectorAll("*"), true);
    var notProcessed = allNodes.filter(function (n) { return isHidden(n); });
    var processed = allNodes.filter(function (n) { return !isHidden(n); });
    var visibility = processed.filter(function (n) { return isVisibilityHidden(n); });
    var opacity = processed.filter(function (n) { return isOpacity0(n); });
    var dimensions = processed.filter(function (n) { return isHeightWidthOverflow(n); });
    var transform = processed.filter(function (n) { return isTransformHidden(n); });
    var opacityFilter = processed.filter(function (n) { return isFilterOpacity(n); });
    /**
     * Finds elements that are not affecting layout of the page and will not be included in styles recalculation
     */
    function isHidden(element) {
        return !(element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length);
    }
    /**
     * This elements are still processed during style recalculation
     */
    function isVisibilityHidden(element) {
        return window.getComputedStyle(element).visibility === "hidden";
    }
    /**
     * This elements are still processed during style recalculation
     */
    function isOpacity0(element) {
        return window.getComputedStyle(element).opacity === "0";
    }
    /**
     * This elements are still processed during style recalculation
     */
    function isHeightWidthOverflow(element) {
        var styles = window.getComputedStyle(element);
        return (((styles.height === "0" || styles.height === "0px") &&
            styles.overflow === "hidden") ||
            ((styles.width === "0" || styles.width === "0px") &&
                styles.overflow === "hidden") ||
            ((styles.height === "0" ||
                (styles.height === "0px" && styles.width === "0") ||
                styles.width === "0px") &&
                styles.overflow === "hidden"));
    }
    /**
     * This elements are still processed during style recalculation
     */
    function isTransformHidden(element) {
        return element.style.tranform === "scale(0)";
    }
    /**
     * This elements are still processed during style recalculation
     */
    function isFilterOpacity(element) {
        return element.style.filter === "opacity(0)";
    }
    /**
     * This elements are still processed during style recalculation
     */
    function getReferences(nodes) {
        return nodes.map(function (n) { return ({
            self: n,
            children: n.querySelectorAll("*")
        }); });
    }
    function getSummary(name, nodes) {
        var children = nodes
            .map(function (n) { return n.querySelectorAll("*").length + 1; })
            .reduce(function (acc, val) { return acc + val; }, 0);
        return {
            "hiding method": name,
            nodes: nodes.length,
            children: children,
            "potential savings (%)": Number(parseFloat((children / processed.length) * 100).toFixed(2)),
            references: getReferences(nodes)
        };
    }
    console.table([
        {
            name: "\uD83D\uDCDDTOTAL",
            nodes: allNodes.length,
            processed: processed.length,
            notProcessed: notProcessed.length
        },
    ]);
    var summary = [
        getSummary("visibility: none", visibility),
        getSummary("opacity: 0", opacity),
        getSummary("height: 0 || width: 0 && overflow: hidden", dimensions),
        getSummary("transform: scale(0)", transform),
        getSummary("filter: opacity(0)", opacityFilter),
    ];
    return console.table(__spreadArray([
        {
            "hiding method": "👉SUMMARY",
            nodes: summary.reduce(function (acc, val) { return acc + val.nodes; }, 0),
            children: summary.reduce(function (acc, val) { return acc + val.children; }, 0),
            "potential savings (%)": Number(summary
                .reduce(function (acc, val) { return acc + val["potential savings (%)"]; }, 0)
                .toFixed(2)),
            references: "----"
        }
    ], summary, true));
}

``` 




</details>



  
## [Lcp](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/lcp)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * PerformanceObserver
 */
var po = new PerformanceObserver(function (list) {
    var entries = list.getEntries();
    entries = dedupe(entries, "startTime");
    /**
     * Print all entries of LCP
     */
    entries.forEach(function (item, i) {
        console.dir(item);
        console.log("".concat(i + 1, " current LCP item : ").concat(item.element, ": ").concat(item.startTime));
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });
    /**
     * LCP is the lastEntry in getEntries Array
     */
    var lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log("LCP is: ".concat(lastEntry.startTime));
});
/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });
function dedupe(arr, key) {
    return __spreadArray([], new Map(arr.map(function (item) { return [item[key], item]; })).values(), true);
}

``` 




</details>



  
## [Long task](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/long-task)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

try {
    // Create the performance observer.
    var po_1 = new PerformanceObserver(function (list) {
        for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
            var entry = _a[_i];
            // Log the entry and all associated details.
            console.table(entry.toJSON());
        }
    });
    // Start listening for `longtask` entries to be dispatched.
    po_1.observe({ type: 'longtask', buffered: true });
}
catch (e) {
    console.log("The browser doesn't support this API");
}

``` 




</details>



  
## [Make lazy img](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/make-lazy-img)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(function (i) { return i.setAttribute('loading', 'lazy'); });

``` 




</details>



  
## [Re apply dom](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/re-apply-dom)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var bi = document.body.innerHTML;
document.body.innerHTML = '';
setTimeout(function () { return document.body.innerHTML = bi; }, 350);

``` 




</details>



  
## [Resources hints](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/resources-hints)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var rels = [
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "preconnect dns-prefetch",
    "prerender",
    "modulepreload",
];
rels.forEach(function (element) {
    var linkElements = document.querySelectorAll("link[rel=\"".concat(element, "\"]"));
    var dot = linkElements.length > 0 ? "🟩" : "🟥";
    console.log("".concat(dot, " ").concat(element));
    linkElements.forEach(function (el) { return console.log(el); });
});

``` 




</details>



  
## [Scripts loading](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/scripts-loading)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var scripts = document.querySelectorAll('script[src]');
var scriptsLoading = __spreadArray([], scripts, true).map(function (obj) {
    var newObj = {};
    newObj = {
        src: obj.src,
        async: obj.async,
        defer: obj.defer,
        'render blocking': obj.async || obj.defer ? '' : '🟥'
    };
    return newObj;
});
console.table(scriptsLoading);

``` 




</details>



  
## [Scroll up down](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/scroll-up-down)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var scrollHeight = document.documentElement.scrollHeight;
window.scroll({
    top: scrollHeight,
    behavior: 'smooth'
});
// wait for a second, then scroll back up
setTimeout(function () { return window.scroll({
    top: 0,
    behavior: 'smooth'
}); }, 3000);
console.log('scroll done!');

``` 




</details>



  
## [Time to first byte all](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/time-to-first-byte-all)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
new PerformanceObserver(function (entryList) {
    var entries = entryList.getEntries();
    var resourcesLoaded = __spreadArray([], entries, true).map(function (entry) {
        var obj = {};
        // Some resources may have a responseStart value of 0, due
        // to the resource being cached, or a cross-origin resource
        // being served without a Timing-Allow-Origin header set.
        if (entry.responseStart > 0) {
            obj = {
                'TTFB (ms)': entry.responseStart,
                Resource: entry.name
            };
        }
        return obj;
    });
    console.table(resourcesLoaded);
}).observe({
    type: 'resource',
    buffered: true
});

``` 




</details>



  
## [Time to first byte document](https://github.com/push-based/web-performance-tools/tree/master/dist/snippets/time-to-first-byte-document)  

### Console Tab Snippet

Copy this code snippet into the DevTools console Tab to use it.



<details>

<summary>Console Tab Snippet</summary>


```javascript

new PerformanceObserver(function (entryList) {
    var pageNav = entryList.getEntriesByType('navigation')[0];
    console.log("TTFB (ms): ".concat(pageNav.responseStart));
}).observe({
    type: 'navigation',
    buffered: true
});

``` 




</details>



  
<!-- END-SNIPPETS -->















































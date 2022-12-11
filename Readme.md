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

## [Snippets/check above the fold lazy loaded images](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function findATFLazyLoadedImages() {
    const lazy = document.querySelectorAll('[loading="lazy"], [data-src]');
    let lazyImages = [];
    lazy.forEach((tag) => {
        const position = parseInt(tag.getBoundingClientRect().top);
        if (position < window.innerHeight && position !== 0) {
            lazyImages = [...lazyImages, tag];
        }
    });
    return lazyImages.length > 0 ? lazyImages : false;
}

console.log(findATFLazyLoadedImages());
```  
  
## [Snippets/check first and third party script](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
// ex: katespade.com - list firsty party subdomains in HOSTS array
const HOSTS = ["assets.katespade.com"];

function getScriptInfo() {
    const resourceListEntries = performance.getEntriesByType("resource");
    // set for first party scripts
    const first = [];
    // set for third party scripts
    const third = [];

    resourceListEntries.forEach((resource) => {
        // check for initiator type
        const value = "initiatorType" in resource;
        if (value) {
            if (resource.initiatorType === "script") {
                const { host } = new URL(resource.name);
                // check if resource url host matches location.host = first party script
                if (host === location.host || HOSTS.includes(host)) {
                    const json = resource.toJSON();
                    first.push({ ...json, type: "First Party" });
                } else {
                    // add to third party script
                    const json = resource.toJSON();
                    third.push({ ...json, type: "Third Party" });
                }
            }
        }
    });

    const scripts = {
        firstParty: [{ name: "no data" }],
        thirdParty: [{ name: "no data" }],
    };

    if (first.length) {
        scripts.firstParty = first;
    }

    if (third.length) {
        scripts.thirdParty = third;
    }

    return scripts;
}

const { firstParty, thirdParty } = getScriptInfo();

console.groupCollapsed("FIRST PARTY SCRIPTS");
console.table(firstParty);
console.groupEnd();
console.groupCollapsed("THIRD PARTY SCRIPTS");
console.table(thirdParty);
console.groupEnd();

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
  
## [Snippets/check first and third party script timings](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function createUniqueLists(firstParty, thirdParty) {
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }

    const firstPartyList = getUniqueListBy(firstParty, ["name"]);
    const thirdPartyList = getUniqueListBy(thirdParty, ["name"]);

    return { firstPartyList, thirdPartyList };

}

const { firstPartyList, thirdPartyList } = createUniqueLists(
    firstParty,
    thirdParty
);



function calculateTimings(party, type) {
    const partyChoice = party === "first" ? firstParty : thirdParty;

    const timingChoices = {
        DNS_TIME: ["domainLookupEnd", "domainLookupStart"],
        TCP_HANDSHAKE: ["connectEnd", "connectStart"],
        RESPONSE_TIME: ["responseEnd", "responseStart"],
        SECURE_CONNECTION_TIME: ["connectEnd", "secureConnectionStart", 0],
        FETCH_UNTIL_RESPONSE: ["responseEnd", "fetchStart", 0],
        REQ_START_UNTIL_RES_END: ["responseEnd", "requestStart", 0],
        START_UNTIL_RES_END: ["responseEnd", "startTime", 0],
        REDIRECT_TIME: ["redirectEnd", "redirectStart"],
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

    const timings = partyChoice.map((script) => {
        const [timingEnd, timingStart, num] = timingChoices[type];
        const endValue = script[timingEnd];
        const startValue = script[timingStart];
        return {
            name: script.name,
            [type]: handleChoices(endValue, startValue, num),
        };
    });

    return timings;
}

// Available Options
const timingOptions = [
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

timingOptions.forEach((timing) => {
    console.groupCollapsed(`FIRST PARTY: ${timing}`);
    console.table(calculateTimings("first", timing));
    console.groupEnd();
    console.groupCollapsed(`THIRD PARTY: ${timing}`);
    console.table(calculateTimings("third", timing));
    console.groupEnd();
});

// choose your battle - arg1 is string either "first" or "third", arg2 is string timing option listed above.

console.table(calculateTimings("first", "REQ_START_UNTIL_RES_END"));
```  
  
## [Snippets/check header](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
(function () {
    var ct = document.createElement('style');
    ct.innerText = `
    /*!==========================================================================
   #CT.CSS
   ========================================================================== */

/*!
 * ct.css – Let’s take a look inside your <head>…
 *
 * © Harry Roberts 2021 – twitter.com/csswizardry
 */





/**
 * It’s slightly easier to remember topics than it is colours. Set up some
 * custom properties for use later on.
 */

head {
  --ct-is-problematic: solid;
  --ct-is-affected: dashed;
  --ct-notify: #0bce6b;
  --ct-warn: #ffa400;
  --ct-error: #ff4e42;
}





/**
 * Show the <head> and set up the items we might be interested in.
 */

head,
head script,
head script:not([src])[async],
head script:not([src])[defer],
head style, head [rel="stylesheet"],
head script ~ meta[http-equiv="content-security-policy"],
head > meta[charset]:not(:nth-child(-n+5)) {
  display: block;
}

head script,
head style, head [rel="stylesheet"],
head title,
head script ~ meta[http-equiv="content-security-policy"],
head > meta[charset]:not(:nth-child(-n+5)) {
  margin: 5px;
  padding: 5px;
  border-width: 5px;
  background-color: white;
  color: #333;
}

head ::before,
head script, head style {
  font: 16px/1.5 monospace, monospace;
  display: block;
}

head ::before {
  font-weight: bold;
}





/**
 * External Script and Style
 */

head script[src],
head link[rel="stylesheet"] {
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-warn);
}

  head script[src]::before {
    content: "[Blocking Script – " attr(src) "]"
  }

  head link[rel="stylesheet"]::before {
    content: "[Blocking Stylesheet – " attr(href) "]"
  }





/**
 * Inline Script and Style.
 */

head style:not(:empty),
head script:not(:empty) {
  max-height: 5em;
  overflow: auto;
  background-color: #ffd;
  white-space: pre;
  border-color: var(--ct-notify);
  border-style: var(--ct-is-problematic);
}

  head script:not(:empty)::before {
    content: "[Inline Script] ";
  }

  head style:not(:empty)::before {
    content: "[Inline Style] ";
  }





/**
 * Blocked Title.
 *
 * These selectors are generally more complex because the Key Selector (\`title\`)
 * depends on the specific conditions of preceding JS--we can’t cast a wide net
 * and narrow it down later as we can when targeting elements directly.
 */

head script[src]:not([async]):not([defer]):not([type=module]) ~ title,
head script:not(:empty) ~ title {
  display: block;
  border-style: var(--ct-is-affected);
  border-color: var(--ct-error);
}

  head script[src]:not([async]):not([defer]):not([type=module]) ~ title::before,
  head script:not(:empty) ~ title::before {
    content: "[<title> blocked by JS] ";
  }





/**
 * Blocked Scripts.
 *
 * These selectors are generally more complex because the Key Selector
 * (\`script\`) depends on the specific conditions of preceding CSS--we can’t cast
 * a wide net and narrow it down later as we can when targeting elements
 * directly.
 */

head [rel="stylesheet"]:not([media="print"]):not(.ct) ~ script,
head style:not(:empty) ~ script {
  border-style: var(--ct-is-affected);
  border-color: var(--ct-warn);
}

  head [rel="stylesheet"]:not([media="print"]):not(.ct) ~ script::before,
  head style:not(:empty) ~ script::before {
    content: "[JS blocked by CSS – " attr(src) "]";
  }





/**
 * Using both \`async\` and \`defer\` is redundant (an anti-pattern, even). Let’s
 * flag that.
 */

head script[src][src][async][defer] {
  display: block;
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-warn);
}

  head script[src][src][async][defer]::before {
    content: "[async and defer is redundant: prefer defer – " attr(src) "]";
  }





/**
 * Async and defer simply do not work on inline scripts. It won’t do any harm,
 * but it’s useful to know about.
 */
head script:not([src])[async],
head script:not([src])[defer] {
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-warn);
}

  head script:not([src])[async]::before {
    content: "The async attribute is redundant on inline scripts"
  }

  head script:not([src])[defer]::before {
    content: "The defer attribute is redundant on inline scripts"
  }





/**
 * Third Party blocking resources.
 *
 * Expect false-positives here… it’s a crude proxy at best.
 *
 * Selector-chaining (e.g. \`[src][src]\`) is used to bump up specificity.
 */

head script[src][src][src^="//"],
head script[src][src][src^="http"],
head [rel="stylesheet"][href^="//"],
head [rel="stylesheet"][href^="http"] {
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-error);
}

  head script[src][src][src^="//"]::before,
  head script[src][src][src^="http"]::before {
    content: "[Third Party Blocking Script – " attr(src) "]";
  }

  head [rel="stylesheet"][href^="//"]::before,
  head [rel="stylesheet"][href^="http"]::before {
    content: "[Third Party Blocking Stylesheet – " attr(href) "]";
  }





/**
 * Mid-HEAD CSP disables the Preload Scanner
 */

head script ~ meta[http-equiv="content-security-policy"] {
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-error);
}

  head script ~ meta[http-equiv="content-security-policy"]::before {
    content: "[Meta CSP defined after JS]"
  }





/**
 * Charset should appear as early as possible
 */
head > meta[charset]:not(:nth-child(-n+5)) {
  border-style: var(--ct-is-problematic);
  border-color: var(--ct-warn);
}

head > meta[charset]:not(:nth-child(-n+5))::before {
  content: "[Charset should appear as early as possible]";
}





/**
 * Hide all irrelevant or non-matching scripts and styles (including ct.css).
 *
 * We’re done!
 */

link[rel="stylesheet"][media="print"],
link[rel="stylesheet"].ct, style.ct,
script[async], script[defer], script[type=module] {
  display: none;
}
    `;
    ct.classList.add('ct');
    document.head.appendChild(ct);
}());
```  
  
## [Snippets/check image sizes](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function getImgs(sortBy) {
    const imgs = [];

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
                imgs.push({
                    name,
                    transferSize,
                    decodedBodySize,
                    encodedBodySize,
                });
            }
        }
    );

    const imgList = imgs.sort((a, b) => {
        return b[sortBy] - a[sortBy];
    });

    return imgList;
}
console.table(getImgs("encodedBodySize"));
```  
  
## [Snippets/check image usage](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
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
             initiatorType,
         }) => {
            if (initiatorType == "img") {
                imgs.set(name, {
                    name,
                    transferSize
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

function enrichSizeUsage(imgData) {
    return Promise.all(imgData.map((i, idx) => {
        return new Promise((r) => {
            const img = new Image;
            const wRetain= i.tag.width;
            const hRetain= i.tag.height;
            img.onload = function() {
                // mutation!
                imgData[idx].imgDisplayDiff= `${wRetain}/${hRetain} to ${img.width}/${img.height}`;
                r();
            };
            img.onerror = r;
            img.src = i.url;
        })
    })).then(() => imgData);
}

function enrichData() {
    return Array.from(allNames).map((url) => {

        let imgData = {
            tag: 'n/a',
            url,
            error: '',
            transferSize: '?'
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
                imgData.transferSize = url.length * 1.02;
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
enrichSizeUsage(d).then(console.table);
```  
  
## [Snippets/cls](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function genColor() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// console.log(shifts) to see full list of shifts above threshold
const shifts = [];

// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load

function findShifts(threshold) {
  return new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.value > threshold && !entry.hadRecentInput) {
        const color = genColor();
        shifts.push(entry);
        console.log(shifts);

        const valueNode = document.createElement("details");
        valueNode.innerHTML = `
<summary>Layout Shift: ${entry.value}</summary>
<pre>${JSON.stringify(entry, null, 2)}</pre>
`;
valueNode.style = `color: ${color};`;
entry.sources.forEach((source) => {
source.node.parentNode.insertBefore(valueNode, source.node);
source.node.style = `border: 2px ${color} solid`;
});
}
});
});
}

findShifts(0.05).observe({ entryTypes: ["layout-shift"] });
```  
  
## [Snippets/cumulative layout shift](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
try {
    let cumulativeLayoutShiftScore = 0;
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore += entry.value;
            }
        }
    });

    observer.observe({ type: "layout-shift", buffered: true });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            observer.takeRecords();
            observer.disconnect();

            console.log(`CLS: ${cumulativeLayoutShiftScore}`);
        }
    });
} catch (e) {
    console.log(`Browser doesn't support this API`);
}
```  
  
## [Snippets/full relayout](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
const b = document.body;
b.style.zoom === '1' ? b.style.zoom = '1.01' : b.style.zoom = '1';
```  
  
## [Snippets/gathering styles](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a,b) => a + b));
```  
  
## [Snippets/get Attribute Directives](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function getAttributeDirectives() {
  const { name, showSummaryInDOM, appPrefixes, mode } = initializeFlow();

  /**
   * Filter out nodes that don't have an attribute
   */
  function filterAttribute(attribute, prefixes) {
    return Array.isArray(prefixes)
      ? prefixes.some((p) =>
          attribute.name ? attribute.name.startsWith(p.toLowerCase()) : false
        )
      : attribute.name
      ? attribute.name.startsWith(prefixes.toLowerCase())
      : false;
  }

  function initializeFlow() {
    /**
     * Clearing summary items from DOM.
     */
    const summaries = document.querySelectorAll(".customSummaryItem");
    summaries.forEach((i) => i.remove());

    const mode = prompt("Mode: summary or directive");

    switch (mode) {
      case "directive":
        return {
          mode,
          name: prompt("Directive name"),
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
        };
      case "summary":
        return {
          mode,
          appPrefixes:
            prompt("Directives prefixes, comma separated. (ex: app)")
              .split(",")
              .map((p) => p.trim()) || "app",
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
        };
    }
  }

  /**
   * Set of checks to determine if element is hidden.
   */
  function isHidden(element) {
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  // Checks if element is in viewport
  function isInViewport(element) {
    return (
      element.offsetTop < window.innerHeight &&
      element.offsetTop > -element.offsetHeight &&
      element.offsetLeft > -element.offsetWidth &&
      element.offsetLeft < window.innerWidth
    );
  }
  /**
   * Adds summary div to references
   */
  function addSummary(nodes, prefixes) {
    nodes.forEach((n) => {
      n.style.position = "relative";

      const node = document.createElement("DIV");
      Object.assign(node.style, {
        position: "absolute",
        top: "0",
        left: "0",
        "z-index": "999999",
        "font-size": "14px",
        display: "flex",
        background: "green",
        color: "#fff",
        padding: "4px",
      });
      node.classList.add("customSummaryItem");

      const text = document.createTextNode(
        `${
          [...n.attributes]
            .filter((a) => filterAttribute(a, prefixes))
            .map((a) => a.name).length
        }`
      );

      node.appendChild(text);

      n.appendChild(node);
    });
  }
  /**
   * Finds references of the nodes that contain directive with given name
   */
  function findReferences(name) {
    const directives = Array.from(document.querySelectorAll(`[${name}]`)).map(
      (r) => {
        return {
          name,
          hidden: isHidden(r),
          visible: !isHidden(r),
          inViewport: isInViewport(r),
          outOfViewport: !isInViewport(r),
          reference: r,
        };
      }
    );

    return {
      all: directives,
      visible: directives.filter((c) => !c.hidden),
      hidden: directives.filter((c) => c.hidden),
      inViewport: directives.filter((c) => c.inViewport),
      outOfViewport: directives.filter((c) => !c.inViewport),
    };
  }
  /**
   * Get summary data for all directives
   */
  function getAllDirectivesSummary(prefixes) {
    const nodesWithDirectives = Array.from(
      document.body.querySelectorAll("*")
    ).filter((e) =>
      Array.from(e.attributes).some((a) => filterAttribute(a, prefixes))
    );
    const directives =
      // Find unique components names in page
      [
        ...new Set(
          nodesWithDirectives
            .map((e) =>
              [...e.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name)
            )
            .reduce((acc, val) => [...acc, ...val], [])
        ),
      ]
        .map((name) => getSpecificDirectiveSummary(name))
        .reduce((acc, val) => [...acc, val[0]], []);

    if (showSummaryInDOM) {
      addSummary(nodesWithDirectives, prefixes);
    }

    return [
      {
        name: "📝TOTAL",
        visible: directives
          .map((c) => c.visible)
          .reduce((acc, val) => acc + val, 0),
        hidden: directives
          .map((c) => c.hidden)
          .reduce((acc, val) => acc + val, 0),
        inViewport: directives
          .map((c) => c.inViewport)
          .reduce((acc, val) => acc + val, 0),
        outOfViewport: directives
          .map((c) => c.outOfViewport)
          .reduce((acc, val) => acc + val, 0),
        reference: "----",
      },
      ...directives,
    ];
  }
  /**
   * Get summary data for specific directive
   */
  function getSpecificDirectiveSummary(name, showSummary) {
    const { all, visible, hidden, inViewport, outOfViewport } = findReferences(
      name
    );

    if (showSummary) {
      addSummary(
        all.map((e) => e.reference),
        name
      );
    }

    return [
      {
        name: `👉 ${name}`,
        visible: visible.length,
        hidden: hidden.length,
        inViewport: inViewport.length,
        outOfViewport: outOfViewport.length,
        reference: {
          visible,
          hidden,
          inViewport,
          outOfViewport,
        },
      },
      ...all,
    ];
  }

  switch (mode) {
    case "directive":
      return console.table(getSpecificDirectiveSummary(name, showSummaryInDOM));
    case "summary":
      return console.table(getAllDirectivesSummary(appPrefixes));
  }
}
```  
  
## [Snippets/get Components Nodes](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function index() {
  const {
    name,
    showSummaryInDOM,
    appPrefixes,
    mode,
    allNodes,
    visibleNodes,
    hiddenNodes,
    inViewportNodes,
    outOfViewportNodes,
  } = initializeFlow();
  /**
   * Flow init
   */
  function initializeFlow() {
    /**
     * Clearing summary items from DOM.
     */
    const summaries = document.querySelectorAll(".customSummaryItem");
    summaries.forEach((i) => i.remove());

    const mode = prompt("Mode: summary or component");
    const allNodes = Array.from(document.body.querySelectorAll("*"));
    const visibleNodes = [];
    const hiddenNodes = [];
    const inViewportNodes = [];
    const outOfViewportNodes = [];

    allNodes.forEach((n) => {
      if (isHidden(n)) {
        hiddenNodes.push(n);
      } else {
        visibleNodes.push(n);
      }

      if (isInViewport(n)) {
        inViewportNodes.push(n);
      } else {
        outOfViewportNodes.push(n);
      }
    });
    switch (mode) {
      case "component":
        return {
          mode,
          name: prompt("Component name"),
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
          allNodes,
          visibleNodes,
          hiddenNodes,
          inViewportNodes,
          outOfViewportNodes,
        };
      case "summary":
        return {
          mode,
          appPrefixes:
            prompt("Components prefixes, comma separated. (ex: app)")
              .split(",")
              .map((p) => p.trim()) || "app",
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
          allNodes,
          visibleNodes,
          hiddenNodes,
          inViewportNodes,
          outOfViewportNodes,
        };
    }
  }
  /**
   * Set of checks to determine if element is hidden.
   */
  function isHidden(element) {
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
  /**
   * Checks if element is in viewport.
   */
  function isInViewport(element) {
    return (
      element.offsetTop < window.innerHeight &&
      element.offsetTop > -element.offsetHeight &&
      element.offsetLeft > -element.offsetWidth &&
      element.offsetLeft < window.innerWidth
    );
  }
  /**
   * Adds summary div to references
   */
  function addSummary(nodes) {
    nodes.forEach((n) => {
      n.references.self.style.position = "relative";

      const node = document.createElement("DIV");
      const totalNode = document.createElement("SPAN");
      const visibleNode = document.createElement("SPAN");
      const hiddenNode = document.createElement("SPAN");

      const totalText = document.createTextNode(
        ` Total: ${n.visibleNodes + n.hiddenNodes} `
      );
      const visibleText = document.createTextNode(
        ` Visible: ${n.visibleNodes} `
      );
      const hiddenText = document.createTextNode(` Hidden: ${n.hiddenNodes} `);

      /**
       * Appending styles
       */
      Object.assign(node.style, {
        position: "absolute",
        top: "0",
        left: "0",
        "z-index": "999999",
        "font-size": "14px",
        display: "flex",
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
    const components = Array.from(document.querySelectorAll(name)).map((r) => {
      const childNodes = [r, ...r.querySelectorAll("*")];
      const hiddenNodes = [];
      const visibleNodes = [];
      const inViewportNodes = [];
      const outOfViewportNodes = [];

      childNodes.forEach((c) => {
        if (isHidden(c)) {
          hiddenNodes.push(c);
        } else {
          visibleNodes.push(c);
        }

        if (isInViewport(c)) {
          inViewportNodes.push(c);
        } else {
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
          visibleNodes,
          hiddenNodes,
          inViewportNodes,
          outOfViewportNodes,
        },
      };
    });

    if (showSummary) {
      addSummary(components);
    }

    return {
      all: components,
      visible: components.filter((c) => !c.hidden),
      hidden: components.filter((c) => c.hidden),
      inViewport: components.filter((c) => c.inViewport),
      outOfViewport: components.filter((c) => !c.inViewport),
    };
  }
  /**
   * Get summary data for all components
   */
  function getAllComponentsSummary(prefixes) {
    const components = [
      ...new Set(
        allNodes
          .filter((e) =>
            Array.isArray(prefixes)
              ? prefixes.some((p) => e.nodeName.startsWith(p.toUpperCase()))
              : e.nodeName.startsWith(prefix.toUpperCase())
          )
          .map((e) => e.nodeName)
      ),
    ]
      .map((name) => getSpecificComponentSummary(name))
      .reduce((acc, val) => [...acc, val[0]], []);

    return [
      {
        name: "📝TOTAL",
        visible: components
          .map((c) => c.visible)
          .reduce((acc, val) => acc + val, 0),
        hidden: components
          .map((c) => c.hidden)
          .reduce((acc, val) => acc + val, 0),
        inViewport: components
          .map((c) => c.inViewport)
          .reduce((acc, val) => acc + val, 0),
        outOfViewport: components
          .map((c) => c.outOfViewport)
          .reduce((acc, val) => acc + val, 0),
        nodes: allNodes.length,
        visibleNodes: visibleNodes.length,
        hiddenNodes: hiddenNodes.length,
        inViewportNodes: inViewportNodes.length,
        outOfViewportNodes: outOfViewportNodes.length,
        references: "----",
      },
      ...components,
    ];
  }
  /**
   * Get summary data for provided component name
   */
  function getSpecificComponentSummary(name) {
    const { all, visible, hidden, inViewport, outOfViewport } = findReferences(
      name.toUpperCase(),
      showSummaryInDOM
    );

    return [
      {
        name: `👉 ${name.toUpperCase()}`,
        // Components counters
        visible: visible.length,
        hidden: hidden.length,
        inViewport: inViewport.length,
        outOfViewport: outOfViewport.length,
        // Nodes counters
        nodes: all.map((r) => r.nodes).reduce((acc, val) => acc + val, 0),
        visibleNodes: all
          .map((r) => (!r.hidden ? r.visibleNodes : 0))
          .reduce((acc, val) => acc + val, 0),
        hiddenNodes: all
          .map((r) => (r.hidden ? r.nodes : r.hiddenNodes))
          .reduce((acc, val) => acc + val, 0),
        inViewportNodes: all
          .map((r) => r.inViewportNodes)
          .reduce((acc, val) => acc + val, 0),
        outOfViewportNodes: all
          .map((r) => r.outOfViewportNodes)
          .reduce((acc, val) => acc + val, 0),
        // References
        references: {
          visible,
          hidden,
          inViewport,
          outOfViewport,
        },
      },
      ...all,
    ];
  }

  switch (mode) {
    case "component":
      return console.table(getSpecificComponentSummary(name));
    case "summary":
      return console.table(getAllComponentsSummary(appPrefixes));
  }
}
```  
  
## [Snippets/get DOMEvent Listeners](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function getDOMEventListeners() {
  // Get all elements with event listeners
  const elements = [document, ...document.querySelectorAll("*")]
    .map((e) => {
      const elementListeners = window.getEventListeners(e);
      return {
        element: e,
        listeners: Object.keys(elementListeners)
          .map((key) => ({
            [key]: elementListeners[key],
          }))
          .reduce(
            (acc, listener) => ({
              ...acc,
              ...listener,
            }),
            {}
          ),
      };
    })
    .filter((el) => Object.keys(el.listeners).length);

  // Find unique listeners names
  const names = new Set(
    elements
      .map((e) => Object.keys(e.listeners))
      .reduce((acc, listener) => [...acc, ...listener], [])
  );

  // Form output table
  const table = [...names].reduce((acc, n) => {
    const withListener = elements.filter((e) => e.listeners[n]);
    const total = withListener.reduce(
      (acc, e) => acc + e.listeners[n].length,
      0
    );
    const activeListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => !l.passive).length,
      0
    );
    const activeReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => !l.passive).length ? [...acc, e] : acc,
      []
    );
    const passiveListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => l.passive).length,
      0
    );
    const passiveReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => l.passive).length ? [...acc, e] : acc,
      []
    );
    const onceListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => l.once).length,
      0
    );
    const onceReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => l.once).length ? [...acc, e] : acc,
      []
    );

    return [
      ...acc,
      {
        name: n,
        total,
        activeListeners,
        activeListeners,
        passiveListeners,
        onceListeners,
        references: {
          active: activeReferences,
          passive: passiveReferences,
          once: onceReferences,
        },
      },
    ];
  }, []);

  console.table([
    {
      name: "📝TOTAL",
      total: table.reduce((acc, val) => acc + val.total, 0),
      activeListeners: table.reduce((acc, val) => acc + val.activeListeners, 0),
      passiveListeners: table.reduce(
        (acc, val) => acc + val.passiveListeners,
        0
      ),
      onceListeners: table.reduce((acc, val) => acc + val.onceListeners, 0),
      references: "----",
    },
    ...table,
  ]);
}
```  
  
## [Snippets/get Nodes Info](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
function index(root = document.body) {
  const allNodes = [...root.querySelectorAll("*")];
  const notProcessed = allNodes.filter((n) => isHidden(n));
  const processed = allNodes.filter((n) => !isHidden(n));
  const visibility = processed.filter((n) => isVisibilityHidden(n));
  const opacity = processed.filter((n) => isOpacity0(n));
  const dimensions = processed.filter((n) => isHeightWidthOverflow(n));
  const transform = processed.filter((n) => isTransformHidden(n));
  const opacityFilter = processed.filter((n) => isFilterOpacity(n));

  /**
   * Finds elements that are not affecting layout of the page and will not be included in styles recalculation
   */
  function isHidden(element) {
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
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
    const styles = window.getComputedStyle(element);

    return (
      ((styles.height === "0" || styles.height === "0px") &&
        styles.overflow === "hidden") ||
      ((styles.width === "0" || styles.width === "0px") &&
        styles.overflow === "hidden") ||
      ((styles.height === "0" ||
        (styles.height === "0px" && styles.width === "0") ||
        styles.width === "0px") &&
        styles.overflow === "hidden")
    );
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
    return nodes.map((n) => ({
      self: n,
      children: n.querySelectorAll("*"),
    }));
  }

  function getSummary(name, nodes) {
    const children = nodes
      .map((n) => n.querySelectorAll("*").length + 1)
      .reduce((acc, val) => acc + val, 0);
    return {
      "hiding method": name,
      nodes: nodes.length,
      children,
      "potential savings (%)": Number(
        parseFloat((children / processed.length) * 100).toFixed(2)
      ),
      references: getReferences(nodes),
    };
  }

  console.table([
    {
      name: `📝TOTAL`,
      nodes: allNodes.length,
      processed: processed.length,
      notProcessed: notProcessed.length,
    },
  ]);
  const summary = [
    getSummary("visibility: none", visibility),
    getSummary("opacity: 0", opacity),
    getSummary("height: 0 || width: 0 && overflow: hidden", dimensions),
    getSummary("transform: scale(0)", transform),
    getSummary("filter: opacity(0)", opacityFilter),
  ];
  return console.table([
    {
      "hiding method": "👉SUMMARY",
      nodes: summary.reduce((acc, val) => acc + val.nodes, 0),
      children: summary.reduce((acc, val) => acc + val.children, 0),
      "potential savings (%)": Number(
        summary
          .reduce((acc, val) => acc + val["potential savings (%)"], 0)
          .toFixed(2)
      ),
      references: "----",
    },
    ...summary,
  ]);
}
```  
  
## [Snippets/lcp](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
/**
 * PerformanceObserver
 */
const po = new PerformanceObserver((list) => {
    let entries = list.getEntries();

    entries = dedupe(entries, "startTime");

    /**
     * Print all entries of LCP
     */
    entries.forEach((item, i) => {
        console.dir(item);
        console.log(
            `${i + 1} current LCP item : ${item.element}: ${item.startTime}`
        );
        /**
         * Highlight LCP elements on the page
         */
        item.element ? (item.element.style = "border: 5px dotted blue;") : console.warn('LCP not highlighted');
    });

    /**
     * LCP is the lastEntry in getEntries Array
     */
    const lastEntry = entries[entries.length - 1];
    /**
     * Print final LCP
     */
    console.log(`LCP is: ${lastEntry.startTime}`);
});

/**
 * Start observing for largest-contentful-paint
 * buffered true getEntries prior to this script execution
 */
po.observe({ type: "largest-contentful-paint", buffered: true });

function dedupe(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}
```  
  
## [Snippets/long task](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.table(entry.toJSON());
    }
  });
  // Start listening for `longtask` entries to be dispatched.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  console.log(`The browser doesn't support this API`)
}
```  
  
## [Snippets/make lazy img](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
const imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(i => i.setAttribute('loading', 'lazy'));
```  
  
## [Snippets/re apply dom](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
const bi = document.body.innerHTML;
document.body.innerHTML = '';
setTimeout(() => document.body.innerHTML = bi, 350);
```  
  
## [Snippets/resources hints](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
const rels = [
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "preconnect dns-prefetch",
    "prerender",
    "modulepreload",
];

rels.forEach((element) => {
    const linkElements = document.querySelectorAll(`link[rel="${element}"]`);
    const dot = linkElements.length > 0 ? "🟩" : "🟥";
    console.log(`${dot} ${element}`);
    linkElements.forEach((el) => console.log(el));
});
```  
  
## [Snippets/scripts loading](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
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
```  
  
## [Snippets/scroll up down](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
const scrollHeight = document.documentElement.scrollHeight;

window.scroll({
    top: scrollHeight,
    behavior: 'smooth'
});

// wait for a second, then scroll back up
setTimeout(() => window.scroll({
    top: 0,
    behavior: 'smooth'
}), 3000);
console.log('scroll done!');
```  
  
## [Snippets/time to first byte all](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const resourcesLoaded = [...entries].map((entry) => {
        let obj= {};
        // Some resources may have a responseStart value of 0, due
        // to the resource being cached, or a cross-origin resource
        // being served without a Timing-Allow-Origin header set.
        if (entry.responseStart > 0) {
            obj = {
                'TTFB (ms)': entry.responseStart,
                Resource: entry.name
            }
        }
        return obj
    })
    console.table(resourcesLoaded)
}).observe({
    type: 'resource',
    buffered: true
})
```  
  
## [Snippets/time to first byte document](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntriesByType('navigation')
    console.log(`TTFB (ms): ${pageNav.responseStart}`)
}).observe({
    type: 'navigation',
    buffered: true
})
```  
  
## [Snippets/xxx](https://github.com/push-based/web-performance-tools/tree/master/)  
```javascript  
```  
  
<!-- END-SNIPPETS -->











































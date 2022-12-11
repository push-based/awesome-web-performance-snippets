# Check first and third party script

## Description

List all scripts using PerformanceResourceTiming API and separating them by first and third party

[More Info](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming)

[Info On CORS](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#coping_with_cors)

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




<!-- END-HOW_TO -->

























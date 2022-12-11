# Check first and third party script timings

## Description

> Note: 
> This snippet is borrowed from [github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-timings).

<small>_This relies on the above script_</small>

_Run First And Third Party Script Info in the console first, then run this_

[Calculate Load Times - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#timing_resource_loading_phases)

<details><summary><a href='https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#coping_with_cors' target="_blank">Info on CORS (why some values are 0)</a></summary>

<p>

> Note: The properties which are returned as 0 by default when loading a resource from a domain other than the one of the web page itself: redirectStart, redirectEnd, domainLookupStart, domainLookupEnd, connectStart, connectEnd, secureConnectionStart, requestStart, and responseStart.

</p>
</details>
<br>

[More Info on TAO header - Akamai Developer Resources](https://developer.akamai.com/blog/2018/06/13/how-add-timing-allow-origin-headers-improve-site-performance-measurement)


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

javascript:(() => {var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
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
)()
``` 




</details>




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




<!-- END-HOW_TO -->













# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  

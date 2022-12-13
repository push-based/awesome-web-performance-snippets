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



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function createUniqueLists(firstParty, thirdParty) {
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    const firstPartyList = getUniqueListBy(firstParty, ["name"]);
    const thirdPartyList = getUniqueListBy(thirdParty, ["name"]);
    return { firstPartyList, thirdPartyList };
}
const { firstPartyList, thirdPartyList } = createUniqueLists(firstParty, thirdParty);
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
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function createUniqueLists(firstParty, thirdParty) {
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    const firstPartyList = getUniqueListBy(firstParty, ["name"]);
    const thirdPartyList = getUniqueListBy(thirdParty, ["name"]);
    return { firstPartyList, thirdPartyList };
}
const { firstPartyList, thirdPartyList } = createUniqueLists(firstParty, thirdParty);
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




</details>




<!-- END-HOW_TO -->












# Credits

Author: _Joan León_  
Source: _[github.com/nucliweb/webperf-snippets](https://github.com/nucliweb/webperf-snippets/blob/main/README.md#first-and-third-party-script-info)_  

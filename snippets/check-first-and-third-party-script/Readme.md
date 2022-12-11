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



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {// ex: katespade.com - list firsty party subdomains in HOSTS array
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
                    first.push({ ...resource.toJSON(), type: "First Party" });
                }
                else {
                    // add to third party script
                    third.push({ ...resource.toJSON(), type: "Third Party" });
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



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


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
                    first.push({ ...resource.toJSON(), type: "First Party" });
                }
                else {
                    // add to third party script
                    third.push({ ...resource.toJSON(), type: "Third Party" });
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




</details>




<!-- END-HOW_TO -->







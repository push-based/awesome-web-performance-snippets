import {EntryType} from "perf_hooks";

// ex: katespade.com - list firsty party subdomains in HOSTS array
const HOSTS = ["assets.katespade.com"];

function getScriptInfo():  {
    firstParty: { name: string }[],
    thirdParty: { name: string }[]
} {
    const resourceListEntries = performance.getEntriesByType("resource" as EntryType);
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
                } else {
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

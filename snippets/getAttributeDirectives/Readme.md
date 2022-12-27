## Description

Gets information about all attribute directives in the page or specific attribute directive type

## How to use it

<!-- START-HOW_TO[bookmark,console-tab,sources-tab,chromium] -->


| Technique   | Is Usable  |
| ----------- | ---------- |
| [Bookmark](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-bookmarks) |      ✔    | 
| [Console Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-console-tab.md) |      ✔    | 
| [Sources Tab](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-sources-tab.md) |      ✔    | 
| [Chromium](https://github.com/push-based/web-performance-tools/blob/main/docs/how-to-use-it-with-chromium.md)       |      ✔    |
    


### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function getAttributeDirectives() {
    const { name, showSummaryInDOM, appPrefixes, mode } = initializeFlow();
    /**
     * Filter out nodes that don't have an attribute
     */
    function filterAttribute(attribute, prefixes) {
        return Array.isArray(prefixes)
            ? prefixes.some((p) => attribute.name ? attribute.name.startsWith(p.toLowerCase()) : false)
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
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
                };
            case "summary":
                return {
                    mode,
                    appPrefixes: prompt("Directives prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map((p) => p.trim()) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
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
            const text = document.createTextNode(`${[...n.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name).length}`);
            node.appendChild(text);
            n.appendChild(node);
        });
    }
    /**
     * Finds references of the nodes that contain directive with given name
     */
    function findReferences(name) {
        const directives = Array.from(document.querySelectorAll(`[${name}]`)).map((r) => {
            return {
                name,
                hidden: isHidden(r),
                visible: !isHidden(r),
                inViewport: isInViewport(r),
                outOfViewport: !isInViewport(r),
                reference: r,
            };
        });
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
        const nodesWithDirectives = Array.from(document.body.querySelectorAll("*")).filter((e) => Array.from(e.attributes).some((a) => filterAttribute(a, prefixes)));
        const directives = 
        // Find unique components names in page
        [
            ...new Set(nodesWithDirectives
                .map((e) => [...e.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name))
                .reduce((acc, val) => [...acc, ...val], [])),
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
        const { all, visible, hidden, inViewport, outOfViewport } = findReferences(name);
        if (showSummary) {
            addSummary(all.map((e) => e.reference), name);
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
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function getAttributeDirectives() {
    const { name, showSummaryInDOM, appPrefixes, mode } = initializeFlow();
    /**
     * Filter out nodes that don't have an attribute
     */
    function filterAttribute(attribute, prefixes) {
        return Array.isArray(prefixes)
            ? prefixes.some((p) => attribute.name ? attribute.name.startsWith(p.toLowerCase()) : false)
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
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
                };
            case "summary":
                return {
                    mode,
                    appPrefixes: prompt("Directives prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map((p) => p.trim()) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
                        ? true
                        : false,
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
            const text = document.createTextNode(`${[...n.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name).length}`);
            node.appendChild(text);
            n.appendChild(node);
        });
    }
    /**
     * Finds references of the nodes that contain directive with given name
     */
    function findReferences(name) {
        const directives = Array.from(document.querySelectorAll(`[${name}]`)).map((r) => {
            return {
                name,
                hidden: isHidden(r),
                visible: !isHidden(r),
                inViewport: isInViewport(r),
                outOfViewport: !isInViewport(r),
                reference: r,
            };
        });
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
        const nodesWithDirectives = Array.from(document.body.querySelectorAll("*")).filter((e) => Array.from(e.attributes).some((a) => filterAttribute(a, prefixes)));
        const directives = 
        // Find unique components names in page
        [
            ...new Set(nodesWithDirectives
                .map((e) => [...e.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name))
                .reduce((acc, val) => [...acc, ...val], [])),
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
        const { all, visible, hidden, inViewport, outOfViewport } = findReferences(name);
        if (showSummary) {
            addSummary(all.map((e) => e.reference), name);
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




</details>




<!-- END-HOW_TO -->






















## Input

- Mode: summary/component
- For summary
  - Prefixes, separated with comma (ex: mat,cdk,app etc)
  - Apply summary to DOM (yes/no)
- For component
  - Directive name
  - Apply summary to DOM (yes/no)

## Features

- Provides summary for all directive instances and DOM on the page.
- Provides summary for specific directive type
- Optionally applies summary element with amount of directives to an element.

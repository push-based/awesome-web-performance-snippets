## Description

Gets information about all components in the page or specific component type

## Usage

## How to use it

<!-- START-HOW_TO[] -->




### Bookmark Snippet



<details>

<summary>Copy this code snippet into the bookmark to use it</summary>


```javascript

javascript:(() => {function index() {
    const { name, showSummaryInDOM, appPrefixes, mode, allNodes, visibleNodes, hiddenNodes, inViewportNodes, outOfViewportNodes, } = initializeFlow();
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
                    mode,
                    name: prompt("Component name"),
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
                    appPrefixes: prompt("Components prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map((p) => p.trim()) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
        nodes.forEach((n) => {
            n.references.self.style.position = "relative";
            const node = document.createElement("DIV");
            const totalNode = document.createElement("SPAN");
            const visibleNode = document.createElement("SPAN");
            const hiddenNode = document.createElement("SPAN");
            const totalText = document.createTextNode(` Total: ${n.visibleNodes + n.hiddenNodes} `);
            const visibleText = document.createTextNode(` Visible: ${n.visibleNodes} `);
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
            ...new Set(allNodes
                .filter((e) => Array.isArray(prefixes)
                ? prefixes.some((p) => e.nodeName.startsWith(p.toUpperCase()))
                : e.nodeName.startsWith(prefix.toUpperCase()))
                .map((e) => e.nodeName)),
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
        const { all, visible, hidden, inViewport, outOfViewport } = findReferences(name.toUpperCase(), showSummaryInDOM);
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
})()
``` 




</details>



## Console Tab Snippet

<details>

<summary>Copy this code snippet into the DevTools console Tab to use it</summary>


```javascript

function index() {
    const { name, showSummaryInDOM, appPrefixes, mode, allNodes, visibleNodes, hiddenNodes, inViewportNodes, outOfViewportNodes, } = initializeFlow();
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
                    mode,
                    name: prompt("Component name"),
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
                    appPrefixes: prompt("Components prefixes, comma separated. (ex: app)")
                        .split(",")
                        .map((p) => p.trim()) || "app",
                    showSummaryInDOM: prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
        nodes.forEach((n) => {
            n.references.self.style.position = "relative";
            const node = document.createElement("DIV");
            const totalNode = document.createElement("SPAN");
            const visibleNode = document.createElement("SPAN");
            const hiddenNode = document.createElement("SPAN");
            const totalText = document.createTextNode(` Total: ${n.visibleNodes + n.hiddenNodes} `);
            const visibleText = document.createTextNode(` Visible: ${n.visibleNodes} `);
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
            ...new Set(allNodes
                .filter((e) => Array.isArray(prefixes)
                ? prefixes.some((p) => e.nodeName.startsWith(p.toUpperCase()))
                : e.nodeName.startsWith(prefix.toUpperCase()))
                .map((e) => e.nodeName)),
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
        const { all, visible, hidden, inViewport, outOfViewport } = findReferences(name.toUpperCase(), showSummaryInDOM);
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




</details>




<!-- END-HOW_TO -->


















































































## Input

- Mode: summary/component
- For summary
  - Prefixes, separated with comma (ex: mat,cdk,app etc)
  - Apply summary to DOM (yes/no)
- For component
  - Component name
  - Apply summary to DOM (yes/no)

## Features

- Provides summary for all component instances and DOM on the page.
- Provides summary for specific component type
- Optionally applies summary element with amount of total/visible/hidden DOM nodes to an element.

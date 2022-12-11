## Description

Gets information about all components in the page or specific component type

## Usage

## How to use it

<!-- START-HOW_TO[] -->




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

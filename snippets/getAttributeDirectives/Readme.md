## Description

Gets information about all attribute directives in the page or specific attribute directive type

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

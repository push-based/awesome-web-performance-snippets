## Description

Gets information about event lieteners on the page.

Gets information about event lieteners on the page.
IMPORTANT: This script can not be run as a bookmarklet because it relies on console api getEventListeners();
 

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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function getDOMEventListeners() {
    // Get all elements with event listeners
    var elements = __spreadArray([document], document.querySelectorAll("*"), true).map(function (e) {
        var elementListeners = window.getEventListeners(e);
        return {
            element: e,
            listeners: Object.keys(elementListeners)
                .map(function (key) {
                var _a;
                return (_a = {},
                    _a[key] = elementListeners[key],
                    _a);
            })
                .reduce(function (acc, listener) { return (__assign(__assign({}, acc), listener)); }, {})
        };
    })
        .filter(function (el) { return Object.keys(el.listeners).length; });
    // Find unique listeners names
    var names = new Set(elements
        .map(function (e) { return Object.keys(e.listeners); })
        .reduce(function (acc, listener) { return __spreadArray(__spreadArray([], acc, true), listener, true); }, []));
    // Form output table
    var table = __spreadArray([], names, true).reduce(function (acc, n) {
        var withListener = elements.filter(function (e) { return e.listeners[n]; });
        var total = withListener.reduce(function (acc, e) { return acc + e.listeners[n].length; }, 0);
        var activeListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return !l.passive; }).length; }, 0);
        var activeReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return !l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var passiveListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.passive; }).length; }, 0);
        var passiveReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var onceListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.once; }).length; }, 0);
        var onceReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.once; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        return __spreadArray(__spreadArray([], acc, true), [
            {
                name: n,
                total: total,
                activeListeners: activeListeners,
                activeListeners: activeListeners,
                passiveListeners: passiveListeners,
                onceListeners: onceListeners,
                references: {
                    active: activeReferences,
                    passive: passiveReferences,
                    once: onceReferences
                }
            },
        ], false);
    }, []);
    console.table(__spreadArray([
        {
            name: "📝TOTAL",
            total: table.reduce(function (acc, val) { return acc + val.total; }, 0),
            activeListeners: table.reduce(function (acc, val) { return acc + val.activeListeners; }, 0),
            passiveListeners: table.reduce(function (acc, val) { return acc + val.passiveListeners; }, 0),
            onceListeners: table.reduce(function (acc, val) { return acc + val.onceListeners; }, 0),
            references: "----"
        }
    ], table, true));
}
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function getDOMEventListeners() {
    // Get all elements with event listeners
    var elements = __spreadArray([document], document.querySelectorAll("*"), true).map(function (e) {
        var elementListeners = window.getEventListeners(e);
        return {
            element: e,
            listeners: Object.keys(elementListeners)
                .map(function (key) {
                var _a;
                return (_a = {},
                    _a[key] = elementListeners[key],
                    _a);
            })
                .reduce(function (acc, listener) { return (__assign(__assign({}, acc), listener)); }, {})
        };
    })
        .filter(function (el) { return Object.keys(el.listeners).length; });
    // Find unique listeners names
    var names = new Set(elements
        .map(function (e) { return Object.keys(e.listeners); })
        .reduce(function (acc, listener) { return __spreadArray(__spreadArray([], acc, true), listener, true); }, []));
    // Form output table
    var table = __spreadArray([], names, true).reduce(function (acc, n) {
        var withListener = elements.filter(function (e) { return e.listeners[n]; });
        var total = withListener.reduce(function (acc, e) { return acc + e.listeners[n].length; }, 0);
        var activeListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return !l.passive; }).length; }, 0);
        var activeReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return !l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var passiveListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.passive; }).length; }, 0);
        var passiveReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.passive; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        var onceListeners = withListener.reduce(function (acc, e) { return acc + e.listeners[n].filter(function (l) { return l.once; }).length; }, 0);
        var onceReferences = withListener.reduce(function (acc, e) {
            return e.listeners[n].filter(function (l) { return l.once; }).length ? __spreadArray(__spreadArray([], acc, true), [e], false) : acc;
        }, []);
        return __spreadArray(__spreadArray([], acc, true), [
            {
                name: n,
                total: total,
                activeListeners: activeListeners,
                activeListeners: activeListeners,
                passiveListeners: passiveListeners,
                onceListeners: onceListeners,
                references: {
                    active: activeReferences,
                    passive: passiveReferences,
                    once: onceReferences
                }
            },
        ], false);
    }, []);
    console.table(__spreadArray([
        {
            name: "📝TOTAL",
            total: table.reduce(function (acc, val) { return acc + val.total; }, 0),
            activeListeners: table.reduce(function (acc, val) { return acc + val.activeListeners; }, 0),
            passiveListeners: table.reduce(function (acc, val) { return acc + val.passiveListeners; }, 0),
            onceListeners: table.reduce(function (acc, val) { return acc + val.onceListeners; }, 0),
            references: "----"
        }
    ], table, true));
}

``` 




</details>




<!-- END-HOW_TO -->













## Input

N/A

## Features

- Provides summary information about all event listeners on the page.

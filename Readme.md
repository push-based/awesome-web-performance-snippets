# Web Performance Snippets

<!-- START-SNIPPETS -->

## [Check lazy img](../snippets\check-lazy-img\index.js)  
```javascript  
const imgs = document.querySelectorAll('img');
const eager = Array.from(imgs)
    .map(i => i.getAttribute('loading'))
    .filter(l => !l).length;
console.log(eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)');
document.title= eager+ ' of ' + imgs.length + ' img\'s eager (LCP included)';
```  
  
## [Full relayout](../snippets\full-relayout\index.js)  
```javascript  
if(window.__rxa_full_relayout_listener === true) { console.log('You clicked too fast');}
window.performance.mark('relayout-start');
document.body.style.zoom === '1' ? document.body.style.zoom = '1.01' : document.body.style.zoom = '1';
window.__rxa_full_relayout_listener = true;
setTimeout(() => {
    if (window.__rxa_full_relayout_listener) {
        window.performance.mark('relayout-end');
        window.performance.measure('full-relayout', 'relayout-start', 'relayout-end');
        const duration = window.performance.getEntriesByName('full-relayout')[0].duration;
        console.log(`full-relayout: ${duration}`, duration > 50 ? '❌' : '✔');
        window.performance.clearMarks();
        window.performance.clearMeasures();
        window.__rxa_full_relayout_listener = false;
    }
});
```  
  
## [Gathering styles](../snippets\gathering-styles\index.js)  
```javascript  
console.log(Array.from(document.querySelectorAll('style'))
    .map(a => a.innerText)
    .reduce((a,b) => a + b));
```  
  
## [Get Attribute Directives](../snippets\getAttributeDirectives\index.js)  
```javascript  
function getAttributeDirectives() {
  const { name, showSummaryInDOM, appPrefixes, mode } = initializeFlow();

  /**
   * Filter out nodes that don't have an attribute
   */
  function filterAttribute(attribute, prefixes) {
    return Array.isArray(prefixes)
      ? prefixes.some((p) =>
          attribute.name ? attribute.name.startsWith(p.toLowerCase()) : false
        )
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
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
        };
      case "summary":
        return {
          mode,
          appPrefixes:
            prompt("Directives prefixes, comma separated. (ex: app)")
              .split(",")
              .map((p) => p.trim()) || "app",
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
              ? true
              : false,
        };
    }
  }

  /**
   * Set of checks to determine if element is hidden.
   */
  function isHidden(element) {
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  // Checks if element is in viewport
  function isInViewport(element) {
    return (
      element.offsetTop < window.innerHeight &&
      element.offsetTop > -element.offsetHeight &&
      element.offsetLeft > -element.offsetWidth &&
      element.offsetLeft < window.innerWidth
    );
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

      const text = document.createTextNode(
        `${
          [...n.attributes]
            .filter((a) => filterAttribute(a, prefixes))
            .map((a) => a.name).length
        }`
      );

      node.appendChild(text);

      n.appendChild(node);
    });
  }
  /**
   * Finds references of the nodes that contain directive with given name
   */
  function findReferences(name) {
    const directives = Array.from(document.querySelectorAll(`[${name}]`)).map(
      (r) => {
        return {
          name,
          hidden: isHidden(r),
          visible: !isHidden(r),
          inViewport: isInViewport(r),
          outOfViewport: !isInViewport(r),
          reference: r,
        };
      }
    );

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
    const nodesWithDirectives = Array.from(
      document.body.querySelectorAll("*")
    ).filter((e) =>
      Array.from(e.attributes).some((a) => filterAttribute(a, prefixes))
    );
    const directives =
      // Find unique components names in page
      [
        ...new Set(
          nodesWithDirectives
            .map((e) =>
              [...e.attributes]
                .filter((a) => filterAttribute(a, prefixes))
                .map((a) => a.name)
            )
            .reduce((acc, val) => [...acc, ...val], [])
        ),
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
    const { all, visible, hidden, inViewport, outOfViewport } = findReferences(
      name
    );

    if (showSummary) {
      addSummary(
        all.map((e) => e.reference),
        name
      );
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
  
## [Get Components Nodes](../snippets\getComponentsNodes\index.js)  
```javascript  
function index() {
  const {
    name,
    showSummaryInDOM,
    appPrefixes,
    mode,
    allNodes,
    visibleNodes,
    hiddenNodes,
    inViewportNodes,
    outOfViewportNodes,
  } = initializeFlow();
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
      } else {
        visibleNodes.push(n);
      }

      if (isInViewport(n)) {
        inViewportNodes.push(n);
      } else {
        outOfViewportNodes.push(n);
      }
    });
    switch (mode) {
      case "component":
        return {
          mode,
          name: prompt("Component name"),
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
          appPrefixes:
            prompt("Components prefixes, comma separated. (ex: app)")
              .split(",")
              .map((p) => p.trim()) || "app",
          showSummaryInDOM:
            prompt("Apply summary info to elements? (yes/no)", "no") === "yes"
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
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
  /**
   * Checks if element is in viewport.
   */
  function isInViewport(element) {
    return (
      element.offsetTop < window.innerHeight &&
      element.offsetTop > -element.offsetHeight &&
      element.offsetLeft > -element.offsetWidth &&
      element.offsetLeft < window.innerWidth
    );
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

      const totalText = document.createTextNode(
        ` Total: ${n.visibleNodes + n.hiddenNodes} `
      );
      const visibleText = document.createTextNode(
        ` Visible: ${n.visibleNodes} `
      );
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
        } else {
          visibleNodes.push(c);
        }

        if (isInViewport(c)) {
          inViewportNodes.push(c);
        } else {
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
      ...new Set(
        allNodes
          .filter((e) =>
            Array.isArray(prefixes)
              ? prefixes.some((p) => e.nodeName.startsWith(p.toUpperCase()))
              : e.nodeName.startsWith(prefix.toUpperCase())
          )
          .map((e) => e.nodeName)
      ),
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
    const { all, visible, hidden, inViewport, outOfViewport } = findReferences(
      name.toUpperCase(),
      showSummaryInDOM
    );

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
  
## [Get DOMEvent Listeners](../snippets\getDOMEventListeners\index.js)  
```javascript  
function getDOMEventListeners() {
  // Get all elements with event listeners
  const elements = [document, ...document.querySelectorAll("*")]
    .map((e) => {
      const elementListeners = window.getEventListeners(e);
      return {
        element: e,
        listeners: Object.keys(elementListeners)
          .map((key) => ({
            [key]: elementListeners[key],
          }))
          .reduce(
            (acc, listener) => ({
              ...acc,
              ...listener,
            }),
            {}
          ),
      };
    })
    .filter((el) => Object.keys(el.listeners).length);

  // Find unique listeners names
  const names = new Set(
    elements
      .map((e) => Object.keys(e.listeners))
      .reduce((acc, listener) => [...acc, ...listener], [])
  );

  // Form output table
  const table = [...names].reduce((acc, n) => {
    const withListener = elements.filter((e) => e.listeners[n]);
    const total = withListener.reduce(
      (acc, e) => acc + e.listeners[n].length,
      0
    );
    const activeListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => !l.passive).length,
      0
    );
    const activeReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => !l.passive).length ? [...acc, e] : acc,
      []
    );
    const passiveListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => l.passive).length,
      0
    );
    const passiveReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => l.passive).length ? [...acc, e] : acc,
      []
    );
    const onceListeners = withListener.reduce(
      (acc, e) => acc + e.listeners[n].filter((l) => l.once).length,
      0
    );
    const onceReferences = withListener.reduce(
      (acc, e) =>
        e.listeners[n].filter((l) => l.once).length ? [...acc, e] : acc,
      []
    );

    return [
      ...acc,
      {
        name: n,
        total,
        activeListeners,
        activeListeners,
        passiveListeners,
        onceListeners,
        references: {
          active: activeReferences,
          passive: passiveReferences,
          once: onceReferences,
        },
      },
    ];
  }, []);

  console.table([
    {
      name: "📝TOTAL",
      total: table.reduce((acc, val) => acc + val.total, 0),
      activeListeners: table.reduce((acc, val) => acc + val.activeListeners, 0),
      passiveListeners: table.reduce(
        (acc, val) => acc + val.passiveListeners,
        0
      ),
      onceListeners: table.reduce((acc, val) => acc + val.onceListeners, 0),
      references: "----",
    },
    ...table,
  ]);
}
```  
  
## [Get Nodes Info](../snippets\getNodesInfo\index.js)  
```javascript  
function index(root = document.body) {
  const allNodes = [...root.querySelectorAll("*")];
  const notProcessed = allNodes.filter((n) => isHidden(n));
  const processed = allNodes.filter((n) => !isHidden(n));
  const visibility = processed.filter((n) => isVisibilityHidden(n));
  const opacity = processed.filter((n) => isOpacity0(n));
  const dimensions = processed.filter((n) => isHeightWidthOverflow(n));
  const transform = processed.filter((n) => isTransformHidden(n));
  const opacityFilter = processed.filter((n) => isFilterOpacity(n));

  /**
   * Finds elements that are not affecting layout of the page and will not be included in styles recalculation
   */
  function isHidden(element) {
    return !(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  /**
   * This elements are still processed during style recalculation
   */
  function isVisibilityHidden(element) {
    return window.getComputedStyle(element).visibility === "hidden";
  }

  /**
   * This elements are still processed during style recalculation
   */
  function isOpacity0(element) {
    return window.getComputedStyle(element).opacity === "0";
  }

  /**
   * This elements are still processed during style recalculation
   */
  function isHeightWidthOverflow(element) {
    const styles = window.getComputedStyle(element);

    return (
      ((styles.height === "0" || styles.height === "0px") &&
        styles.overflow === "hidden") ||
      ((styles.width === "0" || styles.width === "0px") &&
        styles.overflow === "hidden") ||
      ((styles.height === "0" ||
        (styles.height === "0px" && styles.width === "0") ||
        styles.width === "0px") &&
        styles.overflow === "hidden")
    );
  }

  /**
   * This elements are still processed during style recalculation
   */
  function isTransformHidden(element) {
    return element.style.tranform === "scale(0)";
  }

  /**
   * This elements are still processed during style recalculation
   */
  function isFilterOpacity(element) {
    return element.style.filter === "opacity(0)";
  }

  /**
   * This elements are still processed during style recalculation
   */
  function getReferences(nodes) {
    return nodes.map((n) => ({
      self: n,
      children: n.querySelectorAll("*"),
    }));
  }

  function getSummary(name, nodes) {
    const children = nodes
      .map((n) => n.querySelectorAll("*").length + 1)
      .reduce((acc, val) => acc + val, 0);
    return {
      "hiding method": name,
      nodes: nodes.length,
      children,
      "potential savings (%)": Number(
        parseFloat((children / processed.length) * 100).toFixed(2)
      ),
      references: getReferences(nodes),
    };
  }

  console.table([
    {
      name: `📝TOTAL`,
      nodes: allNodes.length,
      processed: processed.length,
      notProcessed: notProcessed.length,
    },
  ]);
  const summary = [
    getSummary("visibility: none", visibility),
    getSummary("opacity: 0", opacity),
    getSummary("height: 0 || width: 0 && overflow: hidden", dimensions),
    getSummary("transform: scale(0)", transform),
    getSummary("filter: opacity(0)", opacityFilter),
  ];
  return console.table([
    {
      "hiding method": "👉SUMMARY",
      nodes: summary.reduce((acc, val) => acc + val.nodes, 0),
      children: summary.reduce((acc, val) => acc + val.children, 0),
      "potential savings (%)": Number(
        summary
          .reduce((acc, val) => acc + val["potential savings (%)"], 0)
          .toFixed(2)
      ),
      references: "----",
    },
    ...summary,
  ]);
}
```  
  
## [Make lazy img](../snippets\make-lazy-img\index.js)  
```javascript  
const imgs = document.querySelectorAll('img');
Array.from(imgs)
    .forEach(i => i.setAttribute('loading', 'lazy'));
```  
  
## [Re dom](../snippets\re-dom\index.js)  
```javascript  
const bi = document.body.innerHTML; document.body.innerHTML = '';
setTimeout(() => document.body.innerHTML = bi, 400);
```  
  
## [Scroll up down](../snippets\scroll-up-down\index.js)  
```javascript  
const scrollHeight = document.documentElement.scrollHeight;

window.scroll({
    top: scrollHeight,
    behavior: 'smooth'
});

// wait for a second, then scroll back up
setTimeout(() => window.scroll({
    top: 0,
    behavior: 'smooth'
}), 3000);
console.log('scroll done!');
```  
  
<!-- END-SNIPPETS -->











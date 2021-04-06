/**
 * Gets estimations for DOM nodes that are part of the layout of the body or specific DOM node.
 * Will include:
 * - Summary (number of DOM nodes, number of nodes that will be processed by the browser, number of DOM nodes that are not processed by the browser (hidden nodes)).
 * - Summary for DOM nodes that can be excluded from layout by applying display: none in addition to other hiding mechanisms.
 *
 * IMPORTANT: If you use this script as bookmarklet it will always get information for document.body. If used from console directly any DOM element can be passed.
 *
 * To run it as bookmarklet:
 * - Minify code using for example https://javascript-minifier.com/
 * - Wrap result in `javascript:(minification_result)();`
 * - Create new bookmark and paste wrapped result in URL field.
 */
function getNodesInfo(root = document.body) {
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

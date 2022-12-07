function genColor() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// console.log(shifts) to see full list of shifts above threshold
const shifts = [];

// threshold ex: 0.05
// Layout Shifts will be grouped by color.
// All nodes attributed to the shift will have a border with the corresponding color
// Shift value will be added above parent node.
// Will have all details related to that shift in dropdown
// Useful for single page applications and finding shifts after initial load

function findShifts(threshold) {
  return new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.value > threshold && !entry.hadRecentInput) {
        const color = genColor();
        shifts.push(entry);
        console.log(shifts);

        const valueNode = document.createElement("details");
        valueNode.innerHTML = `
<summary>Layout Shift: ${entry.value}</summary>
<pre>${JSON.stringify(entry, null, 2)}</pre>
`;
valueNode.style = `color: ${color};`;
entry.sources.forEach((source) => {
source.node.parentNode.insertBefore(valueNode, source.node);
source.node.style = `border: 2px ${color} solid`;
});
}
});
});
}

findShifts(0.05).observe({ entryTypes: ["layout-shift"] });

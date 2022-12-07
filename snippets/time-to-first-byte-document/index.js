new PerformanceObserver((entryList) => {
    const [pageNav] = entryList.getEntriesByType('navigation')
    console.log(`TTFB (ms): ${pageNav.responseStart}`)
}).observe({
    type: 'navigation',
    buffered: true
})

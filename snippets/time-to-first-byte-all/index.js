new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const resourcesLoaded = [...entries].map((entry) => {
        let obj= {};
        // Some resources may have a responseStart value of 0, due
        // to the resource being cached, or a cross-origin resource
        // being served without a Timing-Allow-Origin header set.
        if (entry.responseStart > 0) {
            obj = {
                'TTFB (ms)': entry.responseStart,
                Resource: entry.name
            }
        }
        return obj
    })
    console.table(resourcesLoaded)
}).observe({
    type: 'resource',
    buffered: true
})

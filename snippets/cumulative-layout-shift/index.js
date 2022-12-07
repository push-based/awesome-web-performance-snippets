try {
    let cumulativeLayoutShiftScore = 0;
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                cumulativeLayoutShiftScore += entry.value;
            }
        }
    });

    observer.observe({ type: "layout-shift", buffered: true });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            observer.takeRecords();
            observer.disconnect();

            console.log(`CLS: ${cumulativeLayoutShiftScore}`);
        }
    });
} catch (e) {
    console.log(`Browser doesn't support this API`);
}

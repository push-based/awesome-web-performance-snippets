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

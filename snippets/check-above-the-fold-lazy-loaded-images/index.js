function findATFLazyLoadedImages() {
    const lazy = document.querySelectorAll('[loading="lazy"], [data-src]');
    let lazyImages = [];
    lazy.forEach((tag) => {
        const position = parseInt(tag.getBoundingClientRect().top);
        if (position < window.innerHeight && position !== 0) {
            lazyImages = [...lazyImages, tag];
        }
    });
    return lazyImages.length > 0 ? lazyImages : false;
}

console.log(findATFLazyLoadedImages());

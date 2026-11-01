let applyTimer = null;
let outsideClickBound = false;
let lastViewportWidth = window.innerWidth;

function bindOutsideClick() {
    if (outsideClickBound) {
        return;
    }
    outsideClickBound = true;
    document.addEventListener('pointerdown', function (event) {
        const target = event.target;
        if (!isMorePanelOpen()) {
            return;
        }
        if (target.closest && target.closest('.gstv-more-button')) {
            return;
        }
        const panel = getMorePanel();
        if (panel && panel.contains(target)) {
            return;
        }
        closeMorePanel();
    }, true);
    window.addEventListener('resize', function () {
        if (window.innerWidth === lastViewportWidth) {
            return;
        }
        lastViewportWidth = window.innerWidth;
        if (isMorePanelOpen()) {
            closeMorePanel();
        }
    });
    document.addEventListener('scroll', function (event) {
        if (!isMorePanelOpen()) {
            return;
        }
        const panel = getMorePanel();
        if (panel && event.target && panel.contains(event.target)) {
            return;
        }
        closeMorePanel();
    }, true);
}

function observeDocument() {
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

const observer = new MutationObserver(() => {
    if (applyTimer !== null) {
        return;
    }
    applyTimer = setTimeout(() => {
        applyTimer = null;
        observer.disconnect();
        applyVerticals();
        observeDocument();
    }, 40);
});

function revealUnclaimedBars() {
    document.documentElement.classList.add('gstv-reveal');
}

function finishLoading() {
    applyVerticals();
    setTimeout(revealUnclaimedBars, 1000);
}

function start() {
    bindOutsideClick();
    applyVerticals();
    observeDocument();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', finishLoading);
    } else {
        finishLoading();
    }
}

start();

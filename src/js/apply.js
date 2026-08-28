function takeFoundItem(found, item, id) {
    if (!found[id]) {
        found[id] = item;
        return;
    }
    if (item.getAttribute('data-gstv-injected') === 'true') {
        item.remove();
        return;
    }
    if (found[id].getAttribute('data-gstv-injected') === 'true') {
        found[id].remove();
        found[id] = item;
    }
}

function applyVerticals() {
    const list = findTabList();
    if (!list) {
        return;
    }

    list.classList.add('gstv-bar');
    const query = getSearchQuery();
    const items = collectItems(list);
    const found = {};
    const extras = [];
    let moreItem = null;

    items.forEach((item) => {
        const id = identifyItem(item);
        if (id === 'more') {
            moreItem = item;
            return;
        }
        if (id && VERTICAL_ORDER.indexOf(id) !== -1) {
            takeFoundItem(found, item, id);
            return;
        }
        extras.push(item);
    });

    VERTICAL_ORDER.forEach((id) => {
        let item = found[id];
        if (!item) {
            const stale = list.querySelector(':scope > [data-gstv-injected="true"][data-gstv-id="' + id + '"]');
            item = stale || createVerticalItem(id, query);
        }
        paintItem(item, id);
        list.appendChild(item);
    });

    extras.forEach((item) => {
        if (item.parentElement === list) {
            list.appendChild(item);
        }
    });

    if (moreItem) {
        const leftover = moreItem.querySelector('[role="listitem"]');
        if (leftover) {
            paintItem(moreItem, 'more');
            list.appendChild(moreItem);
        } else {
            moreItem.style.display = 'none';
        }
    }

    hideEmptyOverflow(list);
}

let applyTimer = null;

const observer = new MutationObserver(() => {
    if (applyTimer !== null) {
        return;
    }
    applyTimer = setTimeout(() => {
        applyTimer = null;
        observer.disconnect();
        applyVerticals();
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }, 40);
});

function start() {
    applyVerticals();
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

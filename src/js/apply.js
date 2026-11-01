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

function placeMainTabs(list, found, query) {
    MAIN_ORDER.forEach((id) => {
        let item = found[id];
        if (!item) {
            const stale = list.querySelector(':scope > [data-gstv-injected="true"][data-gstv-id="' + id + '"]');
            item = stale || createVerticalItem(id, query);
        }
        paintItem(item, id);
        list.appendChild(item);
    });
}

function collectOverflow(found, extras, currentId) {
    const overflow = [];
    const seen = [];

    function add(item) {
        if (!item || seen.indexOf(item) !== -1) {
            return;
        }
        seen.push(item);
        overflow.push(item);
    }

    MORE_ORDER.forEach((id) => {
        if (id !== currentId && found[id]) {
            add(found[id]);
        }
    });
    extras.forEach(add);
    return overflow;
}

function applyVerticals() {
    if (isMorePanelOpen()) {
        return;
    }
    const list = findTabList();
    if (!list) {
        return;
    }

    list.classList.add('gstv-bar');
    placeToolsBar(list);
    const query = getSearchQuery();
    const currentId = identifyFromPage();
    const items = collectItems(list);
    const found = {};
    const extras = [];
    let googleMore = null;

    items.forEach((item) => {
        const id = identifyItem(item);
        if (id === 'more') {
            if (item.getAttribute('data-gstv-injected-more') === 'true') {
                return;
            }
            googleMore = item;
            return;
        }
        if (id && VERTICAL_ORDER.indexOf(id) !== -1) {
            takeFoundItem(found, item, id);
            return;
        }
        extras.push(item);
    });

    placeMainTabs(list, found, query);

    if (MORE_ORDER.indexOf(currentId) !== -1 && found[currentId]) {
        paintItem(found[currentId], currentId);
        list.appendChild(found[currentId]);
    }

    const overflow = collectOverflow(found, extras, currentId);
    const moreItem = ensureMoreItem(list);
    const panel = fillMorePanel(overflow);

    if (googleMore) {
        hideOriginalItem(googleMore);
    }

    if (panel.children.length === 0) {
        moreItem.style.display = 'none';
    } else {
        moreItem.style.display = '';
        list.appendChild(moreItem);
    }

    hideGoogleOverflow(list);
}

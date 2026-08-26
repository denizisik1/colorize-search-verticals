function findTabList() {
    const navigation = document.querySelector('div[role="navigation"] div[role="list"]');
    if (navigation) {
        return navigation;
    }
    const lists = document.querySelectorAll('div[role="list"]');
    for (let i = 0; i < lists.length; i++) {
        if (lists[i].querySelector('a[href*="udm="], a[href*="tbm="]')) {
            return lists[i];
        }
    }
    return null;
}

function getItemLabel(item) {
    const span = item.querySelector('.R1QWuf');
    if (span && span.textContent) {
        return span.textContent.trim();
    }
    return (item.textContent || '').replace(/\s+/g, ' ').trim();
}

function isMoreItem(item) {
    if (item.querySelector('[aria-label="More filters"]')) {
        return true;
    }
    if (item.querySelector('[aria-expanded][aria-controls]')) {
        const label = getItemLabel(item).toLowerCase();
        return label === 'more' || label.indexOf('more') === 0;
    }
    return false;
}

function identifyItem(item) {
    if (isMoreItem(item)) {
        return 'more';
    }
    if (item.querySelector('[jsname="KliEFc"], [data-mstk-u]')) {
        return 'ai';
    }
    const currentChip = item.querySelector('[aria-current="page"]');
    const disabledLink = item.querySelector('a[aria-disabled="true"]');
    if (currentChip || disabledLink) {
        return identifyFromPage();
    }
    const anchor = item.querySelector('a[href]');
    if (anchor) {
        const fromHref = identifyHref(anchor.getAttribute('href'));
        if (fromHref) {
            return fromHref;
        }
    }
    const label = getItemLabel(item).toLowerCase();
    if (LABEL_TO_ID[label]) {
        return LABEL_TO_ID[label];
    }
    return null;
}

function collectItems(list) {
    const mainItems = Array.from(list.querySelectorAll(':scope > [role="listitem"]'));
    const overflowItems = Array.from(list.querySelectorAll('[role="listitem"] [role="listitem"]'));
    return mainItems.concat(overflowItems);
}

function createVerticalItem(id, query) {
    const item = document.createElement('div');
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-gstv-id', id);
    item.setAttribute('data-gstv-injected', 'true');

    const isCurrent = identifyFromPage() === id;
    const link = document.createElement('a');
    link.className = 'C6AK7c';
    if (isCurrent) {
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('role', 'link');
        link.tabIndex = 0;
    } else {
        link.href = buildHref(id, query);
    }

    const chip = document.createElement('div');
    chip.className = 'mXwfNd gstv-chip';
    if (isCurrent) {
        chip.setAttribute('aria-current', 'page');
        chip.setAttribute('selected', '');
    }

    const label = document.createElement('span');
    label.className = 'R1QWuf';
    label.textContent = VERTICAL_META[id].label;

    chip.appendChild(label);
    link.appendChild(chip);
    item.appendChild(link);
    return item;
}

function findChip(item) {
    const chips = item.querySelectorAll('.mXwfNd');
    for (let i = 0; i < chips.length; i++) {
        const nestedItem = chips[i].closest('[role="listitem"]');
        if (nestedItem === item) {
            return chips[i];
        }
    }
    return null;
}

function paintItem(item, id) {
    item.setAttribute('data-gstv-id', id);
    item.title = VERTICAL_META[id] ? VERTICAL_META[id].label : id;
    const chip = findChip(item);
    if (chip) {
        chip.classList.add('gstv-chip');
    }
    if (id !== 'more' && id === identifyFromPage()) {
        item.classList.add('gstv-current');
    } else {
        item.classList.remove('gstv-current');
    }
}

function hideEmptyOverflow(list) {
    const wrappers = list.querySelectorAll('.sjVJQd, .rNHry');
    wrappers.forEach((wrapper) => {
        if (!wrapper.querySelector('[role="listitem"]')) {
            wrapper.style.display = 'none';
        }
    });
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
                return;
            }
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

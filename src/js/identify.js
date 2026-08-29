function hasVerticalLinks(root) {
    return !!root.querySelector('a[href*="udm="], a[href*="tbm="]');
}

function findLinkBar() {
    const links = document.querySelectorAll('a[href*="udm="], a[href*="tbm="]');
    if (links.length < 2) {
        return null;
    }
    let best = null;
    let bestCount = 0;
    const seen = [];
    const limit = Math.min(links.length, 24);
    for (let i = 0; i < limit; i++) {
        let node = links[i].parentElement;
        let depth = 0;
        while (node && node !== document.body && depth < 8) {
            if (seen.indexOf(node) === -1) {
                seen.push(node);
                const count = node.querySelectorAll('a[href*="udm="], a[href*="tbm="]').length;
                const compact = count >= 2 && count <= 20 && node.children.length <= 30;
                const nearTop = node.getBoundingClientRect().top + window.scrollY < 560;
                if (compact && nearTop && count > bestCount) {
                    best = node;
                    bestCount = count;
                }
            }
            node = node.parentElement;
            depth += 1;
        }
    }
    return best;
}

function findTabList() {
    const navigation = document.querySelector(
        'div[role="navigation"] div[role="list"], nav div[role="list"]'
    );
    if (navigation && hasVerticalLinks(navigation)) {
        return navigation;
    }
    const lists = document.querySelectorAll('[role="list"]');
    for (let i = 0; i < lists.length; i++) {
        if (hasVerticalLinks(lists[i])) {
            return lists[i];
        }
    }
    return findLinkBar();
}

function getItemAnchor(item) {
    if (item.matches && item.matches('a[href]')) {
        return item;
    }
    return item.querySelector('a[href]');
}

function getItemLabel(item) {
    const span = item.querySelector('.R1QWuf');
    if (span && span.textContent) {
        return span.textContent.trim();
    }
    return (item.textContent || '').replace(/\s+/g, ' ').trim();
}

function isMoreItem(item) {
    if (item.getAttribute('data-gstv-injected-more') === 'true') {
        return true;
    }
    if (item.getAttribute('aria-label') === 'More filters'
        || item.querySelector('[aria-label="More filters"]')) {
        return true;
    }
    const label = getItemLabel(item).toLowerCase();
    const isMoreLabel = label === 'more' || label.indexOf('more') === 0;
    if (!isMoreLabel) {
        return false;
    }
    if (item.querySelector('[aria-expanded][aria-controls]')
        || (item.matches && item.matches('[aria-expanded][aria-controls]'))) {
        return true;
    }
    if (item.matches && item.matches('button, [role="button"], summary')) {
        return true;
    }
    return !!item.querySelector('button, [role="button"], summary');
}

function identifyItem(item) {
    if (item.getAttribute('data-gstv-id') === 'more' || isMoreItem(item)) {
        return 'more';
    }
    if (item.querySelector('[jsname="KliEFc"], [data-mstk-u]')) {
        return 'ai';
    }
    const currentChip = item.querySelector('[aria-current="page"]')
        || (item.matches && item.matches('[aria-current="page"]'));
    const disabledLink = item.querySelector('a[aria-disabled="true"]')
        || (item.matches && item.matches('a[aria-disabled="true"]'));
    if (currentChip || disabledLink) {
        return identifyFromPage();
    }
    const anchor = getItemAnchor(item);
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
    if (mainItems.length > 0) {
        const overflowItems = Array.from(list.querySelectorAll('[role="listitem"] [role="listitem"]'));
        return mainItems.concat(overflowItems);
    }
    return Array.from(list.children).filter((child) => {
        if (child.getAttribute('data-gstv-injected-more') === 'true') {
            return true;
        }
        return !!getItemAnchor(child) || child.matches('button, [role="button"]');
    });
}

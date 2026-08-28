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

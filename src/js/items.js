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
    chip.setAttribute('data-gstv-id', id);
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
        if (nestedItem === item || (!nestedItem && chips[i].parentElement === item)) {
            return chips[i];
        }
    }
    const marked = item.querySelector(':scope > .gstv-chip, :scope > a > .gstv-chip');
    if (marked) {
        return marked;
    }
    const inner = item.querySelector(':scope > a > div, :scope > div');
    if (inner) {
        return inner;
    }
    if (item.matches('a')) {
        return item;
    }
    return null;
}

function paintItem(item, id) {
    item.setAttribute('data-gstv-id', id);
    item.title = VERTICAL_META[id] ? VERTICAL_META[id].label : id;
    const chip = findChip(item);
    if (chip) {
        chip.classList.add('gstv-chip');
        chip.setAttribute('data-gstv-id', id);
    }
    if (id !== 'more' && id === identifyFromPage()) {
        item.classList.add('gstv-current');
    } else {
        item.classList.remove('gstv-current');
    }
}

function hideGoogleOverflow(list) {
    list.querySelectorAll('.sjVJQd, .rNHry').forEach((wrapper) => {
        wrapper.classList.add('gstv-hidden');
    });
}

function hideOriginalItem(item) {
    item.classList.add('gstv-hidden');
}

function looksLikeTools(element) {
    if (!element) {
        return false;
    }
    if (element.id === 'hdtb-tls' || element.querySelector('#hdtb-tls')) {
        return true;
    }
    if (element.querySelector('[aria-controls="hdtbMenus"]')) {
        return true;
    }
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    return text === 'tools' || text.indexOf('tools') === 0;
}

function createCaret() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'gstv-caret');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 10l5 5 5-5z');
    svg.appendChild(path);
    return svg;
}

function ensureQuietCaret(chip) {
    if (!chip) {
        return;
    }
    if (chip.querySelector('.gstv-caret')) {
        return;
    }
    chip.querySelectorAll('svg').forEach((svg) => {
        svg.remove();
    });
    chip.appendChild(createCaret());
}

function placeToolsBar(list) {
    const parent = list.parentElement;
    if (parent) {
        parent.classList.add('gstv-bar-wrap');
    }
    let sibling = list.nextElementSibling;
    while (sibling) {
        if (looksLikeTools(sibling)) {
            sibling.classList.add('gstv-tools');
            const chip = sibling.querySelector('.mXwfNd');
            if (chip) {
                chip.classList.add('gstv-chip');
                chip.classList.add('gstv-quiet-chip');
                ensureQuietCaret(chip);
            }
            sibling.querySelectorAll('svg:not(.gstv-caret)').forEach((svg) => {
                svg.remove();
            });
            let node = sibling;
            let depth = 0;
            while (node && node !== document.body && depth < 6) {
                node.classList.add('gstv-unclip');
                node = node.parentElement;
                depth += 1;
            }
            return;
        }
        sibling = sibling.nextElementSibling;
    }
}


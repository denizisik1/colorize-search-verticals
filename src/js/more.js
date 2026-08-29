function supportsPopover() {
    return typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';
}

function getMorePanel() {
    return document.getElementById('gstv-more-panel');
}

function isMorePanelOpen() {
    const panel = getMorePanel();
    if (!panel) {
        return false;
    }
    if (supportsPopover() && panel.matches(':popover-open')) {
        return true;
    }
    return panel.getAttribute('data-gstv-open') === 'true';
}

function positionMorePanel(button) {
    const panel = getMorePanel();
    if (!button || !panel) {
        return;
    }
    const rect = button.getBoundingClientRect();
    const margin = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(280, viewportWidth - margin * 2);
    let left = rect.right - width;
    if (left < margin) {
        left = margin;
    }
    if (left + width > viewportWidth - margin) {
        left = Math.max(margin, viewportWidth - width - margin);
    }
    let top = rect.bottom + 8;
    const estimatedHeight = Math.min(viewportHeight * 0.7, 480);
    if (top + 160 > viewportHeight) {
        top = Math.max(margin, rect.top - 8 - Math.min(estimatedHeight, viewportHeight - margin * 2));
    }
    panel.style.setProperty('position', 'fixed', 'important');
    panel.style.setProperty('inset', 'auto', 'important');
    panel.style.setProperty('margin', '0', 'important');
    panel.style.setProperty('top', Math.round(top) + 'px', 'important');
    panel.style.setProperty('left', Math.round(left) + 'px', 'important');
    panel.style.setProperty('width', Math.round(width) + 'px', 'important');
    panel.style.setProperty('min-width', '0', 'important');
    panel.style.setProperty('max-width', Math.round(width) + 'px', 'important');
}

function setMoreButtonExpanded(expanded) {
    document.querySelectorAll('.gstv-more-button').forEach((button) => {
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
}

function closeMorePanel() {
    const panel = getMorePanel();
    if (!panel) {
        return;
    }
    if (supportsPopover() && panel.matches(':popover-open')) {
        panel.hidePopover();
    }
    panel.removeAttribute('data-gstv-open');
    if (!supportsPopover()) {
        panel.style.setProperty('display', 'none', 'important');
    }
    setMoreButtonExpanded(false);
}

function openMorePanel() {
    const panel = ensureMorePanel();
    const button = document.querySelector('.gstv-more-button');
    if (button) {
        positionMorePanel(button);
    }
    if (supportsPopover()) {
        if (!panel.matches(':popover-open')) {
            panel.showPopover();
        }
    } else {
        panel.setAttribute('data-gstv-open', 'true');
        panel.style.setProperty('display', 'block', 'important');
    }
    if (button) {
        positionMorePanel(button);
    }
    setMoreButtonExpanded(true);
}

function bindMorePanelEvents(panel) {
    if (panel.getAttribute('data-gstv-bound') === 'true') {
        return;
    }
    panel.setAttribute('data-gstv-bound', 'true');
    panel.addEventListener('beforetoggle', function (event) {
        if (event.newState === 'open') {
            const button = document.querySelector('.gstv-more-button');
            if (button) {
                positionMorePanel(button);
            }
        }
    });
}

function ensureMorePanel() {
    let panel = getMorePanel();
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'gstv-more-panel';
        panel.className = 'gstv-more-panel';
        document.documentElement.appendChild(panel);
    } else if (panel.parentElement !== document.documentElement) {
        document.documentElement.appendChild(panel);
    }
    if (supportsPopover()) {
        panel.setAttribute('popover', 'manual');
    }
    bindMorePanelEvents(panel);
    return panel;
}

function menuRowFromItem(item) {
    const id = identifyItem(item);
    if (id === 'more') {
        return null;
    }
    const label = (id && VERTICAL_META[id]) ? VERTICAL_META[id].label : getItemLabel(item);
    if (!label) {
        return null;
    }
    const anchor = getItemAnchor(item);
    let href = '';
    if (anchor) {
        href = anchor.getAttribute('href');
    } else if (id) {
        href = buildHref(id, getSearchQuery());
    }
    if (!href) {
        return null;
    }
    const row = document.createElement('a');
    row.className = 'gstv-menu-link';
    row.href = href;
    row.textContent = label;
    if (id) {
        row.setAttribute('data-gstv-id', id);
    }
    return row;
}

function fillMorePanel(overflow) {
    const panel = ensureMorePanel();
    const seen = [];
    panel.replaceChildren();
    overflow.forEach((item) => {
        hideOriginalItem(item);
        const row = menuRowFromItem(item);
        if (!row) {
            return;
        }
        const key = row.getAttribute('data-gstv-id') || row.href;
        if (seen.indexOf(key) !== -1) {
            return;
        }
        seen.push(key);
        panel.appendChild(row);
    });
    return panel;
}

function createMoreItem() {
    const item = document.createElement('div');
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-gstv-id', 'more');
    item.setAttribute('data-gstv-injected-more', 'true');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gstv-chip gstv-quiet-chip gstv-more-button';
    button.setAttribute('data-gstv-id', 'more');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    const label = document.createElement('span');
    label.textContent = 'More';
    button.appendChild(label);
    button.appendChild(createCaret());
    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (isMorePanelOpen()) {
            closeMorePanel();
        } else {
            openMorePanel();
        }
    });

    item.appendChild(button);
    ensureMorePanel();
    return item;
}

function ensureMoreItem(list) {
    const existing = list.querySelector(':scope > [data-gstv-injected-more="true"]');
    if (existing && existing.querySelector('.gstv-more-button')) {
        ensureMorePanel();
        return existing;
    }
    if (existing) {
        existing.remove();
    }
    return createMoreItem();
}

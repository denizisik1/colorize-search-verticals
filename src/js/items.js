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

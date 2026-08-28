function getSearchQuery() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('q');
    if (fromUrl) {
        return fromUrl;
    }
    const input = document.querySelector('textarea[name="q"], input[name="q"]');
    if (input && input.value) {
        return input.value;
    }
    return '';
}

function copyLocaleParams(target) {
    const current = new URLSearchParams(location.search);
    ['hl', 'gl', 'pws'].forEach((key) => {
        const value = current.get(key);
        if (value) {
            target.searchParams.set(key, value);
        }
    });
}

function buildHref(id, query) {
    if (id === 'maps') {
        return 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
    }
    if (id === 'flights') {
        return 'https://www.google.com/travel/flights?q=' + encodeURIComponent(query);
    }
    if (id === 'finance') {
        return 'https://www.google.com/finance?q=' + encodeURIComponent(query);
    }

    const url = new URL('/search', location.origin);
    url.searchParams.set('q', query);
    copyLocaleParams(url);
    const meta = VERTICAL_META[id];
    if (meta && meta.udm) {
        url.searchParams.set('udm', meta.udm);
    }
    if (meta && meta.tbm && !meta.udm) {
        url.searchParams.set('tbm', meta.tbm);
    }
    return url.pathname + url.search;
}

function identifyHref(href) {
    if (!href) {
        return null;
    }
    let url;
    try {
        url = new URL(href, location.origin);
    } catch (error) {
        return null;
    }
    const host = url.hostname;
    const path = url.pathname;
    if (host.indexOf('maps.google.') === 0 || path.indexOf('/maps') === 0) {
        return 'maps';
    }
    if (path.indexOf('/travel/flights') === 0) {
        return 'flights';
    }
    if (path.indexOf('/finance') === 0) {
        return 'finance';
    }
    const udm = url.searchParams.get('udm');
    if (udm && UDM_TO_ID[udm]) {
        return UDM_TO_ID[udm];
    }
    const tbm = url.searchParams.get('tbm');
    if (tbm && TBM_TO_ID[tbm]) {
        return TBM_TO_ID[tbm];
    }
    if ((path === '/search' || path === '/webhp') && !udm && !tbm) {
        return 'all';
    }
    return null;
}

function identifyFromPage() {
    return identifyHref(location.href) || 'all';
}

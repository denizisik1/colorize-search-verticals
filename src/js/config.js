const MAIN_ORDER = [
    'all',
    'images',
    'videos',
    'maps',
    'news',
    'shopping'
];

const MORE_ORDER = [
    'books',
    'forums',
    'shorts',
    'flights',
    'finance',
    'ai'
];

const VERTICAL_ORDER = MAIN_ORDER.concat(MORE_ORDER);

const VERTICAL_META = {
    all: { label: 'All' },
    images: { label: 'Images', udm: '2', tbm: 'isch' },
    videos: { label: 'Videos', udm: '7', tbm: 'vid' },
    maps: { label: 'Maps' },
    news: { label: 'News', udm: '12', tbm: 'nws' },
    shopping: { label: 'Shopping', udm: '28', tbm: 'shop' },
    books: { label: 'Books', udm: '36', tbm: 'bks' },
    forums: { label: 'Forums', udm: '18' },
    shorts: { label: 'Short videos', udm: '39' },
    flights: { label: 'Flights' },
    finance: { label: 'Finance' },
    ai: { label: 'AI Mode', udm: '50' }
};

const UDM_TO_ID = {
    '2': 'images',
    '7': 'videos',
    '12': 'news',
    '14': 'all',
    '18': 'forums',
    '28': 'shopping',
    '36': 'books',
    '39': 'shorts',
    '50': 'ai'
};

const TBM_TO_ID = {
    isch: 'images',
    vid: 'videos',
    nws: 'news',
    shop: 'shopping',
    bks: 'books',
    flm: 'flights'
};

const LABEL_TO_ID = {
    all: 'all',
    images: 'images',
    videos: 'videos',
    maps: 'maps',
    news: 'news',
    shopping: 'shopping',
    books: 'books',
    forums: 'forums',
    'short videos': 'shorts',
    shorts: 'shorts',
    flights: 'flights',
    finance: 'finance',
    'ai mode': 'ai'
};

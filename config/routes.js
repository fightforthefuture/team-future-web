var routes = {
    '/': ['pages', 'home'],
    '/developers': ['pages', 'developers'],
    '/account': ['accounts', 'edit'],
    '/messages/view/([0-9]+)': ['messages', 'view'],
    // easy way to do a catch-all
    '.*': ['pages', 'not_found']
}
const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    EXPLORE: '/explore',
    NOTIFICATIONS: '/notifications',
    MESSAGES: '/messages',
    BOOKMARKS: '/bookmarks',
    PROFILE: (id) => `/profile/${id}`,
}

export default ROUTES;
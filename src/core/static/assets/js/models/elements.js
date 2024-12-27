"use strict";

// Navigation Items
const navItems = [
    { label: 'Home', path: '/', isPublic: true },
    { label: 'About', path: '/about', isPublic: true },
    {
        label: 'Services', path: '/services', isPublic: true,
        subMenu: [
            { label: 'Game', path: '/services/game', isPublic: true },
            { label: 'Location', path: '/services/location', isPublic: true },
            { label: 'Map', path: '/services/map', isPublic: true },
            { label: 'Upload', path: '/services/upload', isPublic: true },
        ]
    },
    {
        label: 'Consume',
        path: '/consume',
        isPublic: true,
        subMenu: [
            { label: 'Read', path: '/consume/read', isPublic: true },
            { label: 'Listen', path: '/consume/listen', isPublic: true },
            { label: 'Watch', path: '/consume/watch', isPublic: true },
            { label: 'See', path: '/consume/see', isPublic: true }
        ]
    },
    { label: 'Contact', path: '/contact', isPublic: true },
    { label: 'Portal', path: '/portal', isPublic: false, roles: ['user', 'admin', 'superadmin'], subMenu: [
        { label: 'Dashboard', path: '/portal/dashboard', isPublic: false },
        { label: 'Posts', path: '/portal/posts', isPublic: false },
        { label: 'Settings', path: '/portal/settings', isPublic: false }
    ] },
    {
        label: 'Admin Panel',
        path: '/admin',
        isPublic: false,
        roles: ['superadmin'] // Accessible by super admins only
    },
    { label: 'Sign in', path: '/portal/signin', isPublic: true, requiresGuest: true },
    { label: 'Sign out', path: '/portal/signout', isPublic: false }
];

export { navItems };
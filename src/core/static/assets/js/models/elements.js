"use strict";

// Navigation Items
const navItems = [
    { label: " Home", path: "/", isPublic: true },
    { label: "About", path: "/about", isPublic: true },
    {
        label: "Projects",
        path: "/projects",
        isPublic: true,
        subMenu: [
            { label: "Game", path: "/projects/game", isPublic: true },
            { label: "Location", path: "/projects/location", isPublic: true },
            { label: "Map", path: "/projects/map", isPublic: true },
            { label: "Upload", path: "/projects/upload", isPublic: true },
            { label: "Jazzaz", path: "/projects/jazzaz", isPublic: true },
            { label: "Kartate", path: "/projects/kartate", isPublic: true },
            { label: "Kutbi", path: "/projects/kutbi", isPublic: true },
            {
                label: "Palestine Riders",
                path: "/projects/palestine-riders",
                isPublic: true,
            },
            { label: "Playdate", path: "/projects/playdate", isPublic: true },
            { label: "prjctX", path: "/projects/prjctx", isPublic: true },
            { label: "Sowar", path: "/projects/sowar", isPublic: true },
            { label: "Beladi", path: "/projects/beladi", isPublic: true },
        ],
    },
    {
        label: "Feeds",
        path: "/feeds",
        isPublic: true,
        subMenu: [
            { label: "Read", path: "/feeds/read", isPublic: true },
            { label: "Listen", path: "/feeds/listen", isPublic: true },
            { label: "Watch", path: "/feeds/watch", isPublic: true },
            { label: "See", path: "/feeds/see", isPublic: true },
        ],
    },
    { label: "Contact", path: "/contact", isPublic: true },
    {
        label: "Portal",
        path: "/portal",
        isPublic: false,
        roles: ["user", "admin", "superadmin"],
        subMenu: [
            { label: "Dashboard", path: "/portal/dashboard", isPublic: false },
            { label: "Posts", path: "/portal/posts", isPublic: false },
            { label: "Settings", path: "/portal/settings", isPublic: false },
        ],
    },
    {
        label: "Admin Panel",
        path: "/admin",
        isPublic: false,
        roles: ["superadmin"], // Accessible by super admins only
    },
    {
        label: "Sign in",
        path: "/portal/signin",
        isPublic: true,
        requiresGuest: true,
    },
    { label: "Sign out", path: "/portal/signout", isPublic: false },
];

export { navItems };
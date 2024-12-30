"use strict";

import apiCall from "./apiService.js";
import { navItems } from "../models/elements.js";

/** Create elements with attributes in a single line. */
const createElement = (tag, attributes) =>
    Object.assign(document.createElement(tag), attributes);

/** Set element dataset attributes. */
const setElementDataset = (element, dataset) => {
    for (const prop in dataset)
        element.setAttribute(`data-${prop}`, dataset[prop]);
};

/** Output a response into beutiful JSON string. */
const outputJson = (data) => JSON.stringify(data, null, 2);

// Function to generate the navigation menu
function generateNavMenu() {
    const user = JSON.parse(localStorage.getItem("user")),
        navContainer = document.getElementById("navBar"),
        currentPath = window.location.pathname;

    if (!user) return null;
    navContainer.innerHTML = ""; // Clear existing nav items

    // Sort in alphabetical order (A to Z)
    navItems.sort((a, b) => a.label.localeCompare(b.label));
    navItems.forEach((item) => {
        // Skip items based on guest status and roles
        if (item.requiresGuest && user.isLoggedIn) return;
        if (!item.isPublic && !user.isLoggedIn) return;
        if (item.roles && !item.roles.includes(user.role)) return;

        // Create main nav item
        const navItem = document.createElement("li");
        navItem.classList.add("nav-item");

        const link = document.createElement("a");
        link.classList.add("nav-link");
        link.href = item.path;
        link.textContent = item.label;

        // Add active class if current path matches the item's path
        if (item.path === currentPath) {
            link.classList.add("active");
        }

        if (item.subMenu) {
            // Create dropdown
            const dropdown = document.createElement("div");
            dropdown.classList.add("dropdown");

            const mainLink = document.createElement("a");
            mainLink.href = item.path;
            mainLink.textContent = item.label;
            mainLink.classList.add("dropdown-toggle");

            // Add active class if current path matches the item's path
            if (item.path === currentPath) {
                mainLink.classList.add("active");
            }

            dropdown.appendChild(mainLink);
            const subMenu = document.createElement("ul");
            subMenu.classList.add("dropdown-menu");

            // Sort in alphabetical order (A to Z)
            item.subMenu.sort((a, b) => a.label.localeCompare(b.label));
            item.subMenu.forEach((subItem) => {
                if (!subItem.isPublic && !user.isLoggedIn) return;

                const subMenuItem = document.createElement("li");
                const subMenuLink = document.createElement("a");
                subMenuLink.classList.add("nav-link");
                subMenuLink.href = subItem.path;
                subMenuLink.textContent = subItem.label;

                // Add active class if current path matches the submenu path
                if (subItem.path === currentPath) {
                    subMenuLink.classList.add("active");
                }

                subMenuItem.appendChild(subMenuLink);
                subMenu.appendChild(subMenuItem);
            });

            dropdown.appendChild(subMenu);
            navItem.appendChild(dropdown);
        } else {
            navItem.appendChild(link);
        }

        navContainer.appendChild(navItem);
    });

    const burger = document.getElementById("hamburgerX");
    if (burger) burger.addEventListener("click", toggleMenu);
}

// Toggle Mobile Menu
function toggleMenu() {
    const navBar = document.getElementById("navBar");
    navBar.classList.toggle("open");
}

function renderAccountContent() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user.isLoggedIn)
        return `<p>Please <a href="/portal/signin">Sign in</a> to manage your portal.</p>`;
    else
        return `
      <h2>Links</h2>
      <ul>
        <li><a href="/portal/dashboard">Dashboard</a></li>
        <li><a href="/portal/posts">Posts</a></li>
        <li><a href="/portal/settings">Settings</a></li>
        <ul>
          <li><a href="/portal/settings/billing">Billing information</a></li>
          <li><a href="/portal/settings/edit">Personal information</a></li>
          <li><a href="/portal/settings/privacy">Privacy settings</a></li>
          <li><a href="/portal/settings/profile">Profile</a></li>
        </ul>
      </ul>
    `;
}

function renderDashboardContent() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user.isLoggedIn)
        return `<p><a href="/portal/signup">Sign up</a>  or <a href="/portal/signin">Sign in</a> to access personalized features.</p>`;

    if (user.role === "admin") {
        return `
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a href="/manage-users">Manage Users</a></li>
          <li><a href="/content-approval">Content Approval</a></li>
          <li><a href="/site-metrics">View Site Metrics</a></li>
        </ul>
      `;
    } else
        return `
      <h2>Welcome back, ${user.name}!</h2>
      <p>Here are your recent activities and quick links:</p>
      <ul>
        <li><a href="/recent-reads">Recently Read</a></li>
        <li><a href="/my-content">My Content</a></li>
        <li><a href="/notifications">Notifications</a></li>
      </ul>
    `;
}

const BreadcrumbNavigation = () => {
    // Home > Services > Health
};

const UsersSideMenu = () => {
    // Profile
    // Subscriptions
    // Notifications
};

const SearchBar = () => {
    // Home > Services > Health
};

/** Show the loading icon. */
const loadIt = () =>
    (document.getElementById("loading-icon").style.display = "block");

/** Hide the loading icon. */
const unLoadIt = () =>
    (document.getElementById("loading-icon").style.display = "none");

/** Get all posts and render them to the page main element. */
const fetchAndRenderPosts = async () => {
    loadIt();

    try {
        const main = document.querySelector("main"),
            section = createElement("section", {
                id: "posts",
                classList: "flexy",
            }),
            hgroup = createElement("hgroup", {}),
            container = createElement("div", {
                classList: "flexy row posts container",
            }),
            heading = createElement("h2", {}),
            data = await apiCall("posts/?delay=5000");

        if (data.total > 0) {
            heading.textContent = "All posts";
            hgroup.append(
                heading,
                createElement("p", {
                    textContent:
                        "We found " +
                        (data.total === 1
                            ? "one post."
                            : `${data.total} posts.`),
                })
            );

            data.posts.forEach((post) => {
                const tags = createElement("div", {
                        classList: "flexy row tags",
                    }),
                    reactions = createElement("div", {
                        classList: "flexy row reactions",
                    }),
                    { likes, dislikes } = post.reactions;

                const article = createElement("article", {
                    classList: "flexy post",
                });

                setElementDataset(article, {
                    id: btoa(post.id),
                    userid: btoa(post.userId),
                    views: btoa(post.views),
                });

                post.tags.forEach((tag) => {
                    tags.appendChild(
                        createElement("a", {
                            href: `\\tags\\${tag}`,
                            title: tag,
                            textContent: tag,
                        })
                    );
                });

                reactions.append(
                    createElement("span", {
                        title: "Total likes",
                        textContent: likes,
                    }),
                    createElement("span", {
                        title: "Total dislikes",
                        textContent: dislikes,
                    })
                );

                article.append(
                    createElement("h3", {
                        title: post.title,
                        textContent: post.title,
                    }),
                    createElement("p", {
                        textContent: post.body,
                    }),
                    tags,
                    reactions
                );

                container.appendChild(article);
            });
        } else {
            heading.textContent = "This content isn't available at the moment";
            hgroup.append(
                heading,
                createElement("p", {
                    textContent:
                        "When this happens, it's usually because the owner only shared it with a small group of people or changed who can see it, or it's been deleted.",
                }),
                createElement("p", {}).appendChild(
                    createElement("a", {
                        href: "/feeds",
                        textContent: "Go to your feeds",
                    })
                )
            );
        }

        section.append(hgroup, container);
        main.appendChild(section);
    } catch (error) {
        console.error("Failed to fetch page content:", error);
    } finally {
        unLoadIt();
    }
};

export {
    generateNavMenu,
    renderAccountContent,
    renderDashboardContent,
    fetchAndRenderPosts,
};
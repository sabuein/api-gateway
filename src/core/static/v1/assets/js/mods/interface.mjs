"use strict";

import apiCall from "service";
import links from "links";
import { initializeYouTubePlaylists } from "media";
import { log } from "utils";

CSS.paintWorklet.addModule("css-component.js");

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

// Helper for displaying status messages.
const addMessage = (message) => {
    const messagesDiv = document.querySelector("#messages");
    messagesDiv.style.display = "block";
    const messageWithLinks = addDashboardLinks(message);
    messagesDiv.innerHTML += `> ${messageWithLinks}<br>`;
    log(`Debug: ${message}`);
    alert(message);
};

// Adds links for known Stripe objects to the Stripe dashboard.
const addDashboardLinks = (message) => {
    const piDashboardBase = "https://dashboard.stripe.com/test/payments";
    return message.replace(
        /(pi_(\S*)\b)/g,
        `<a href="${piDashboardBase}/$1" target="_blank">$1</a>`
    );
};

// Function to generate the navigation menu
function generateNavMenu() {
    const user = JSON.parse(localStorage.getItem("user")),
        navContainer = document.getElementById("navBar"),
        currentPath = window.location.pathname;

    if (!user) return null;
    navContainer.innerHTML = ""; // Clear existing nav items

    // Sort in alphabetical order (A to Z)
    links.nav.sort((a, b) => a.label.localeCompare(b.label));
    links.nav.forEach((item) => {
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

// console.log("links?.portal", links?.portal);
// console.log("links?.nav", links?.nav);

const getLinksAsList = (type) => {
    const list = createElement("ul", {
        classList: "flexy"
    });

    links[type]?.forEach((link) => {
        list.appendChild(createElement("li", {
            innerHTML: `<a href="${link.path}">${link.label}</a>`
        }));
    });

    return list;
};

const renderAccountContent = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const main = document.querySelector("main");
    if (!user || !user.isLoggedIn) {
        main.append(
            createElement("p", {
                textContent: "Please sign in to manage your portal.",
            }), createElement("a", {
                href: "/v1/portal/signin",
                textContent: "Sign in"
            })
        );
    } else main.append(createElement("h2", { textContent: "Links" }), getLinksAsList("portal"));
};

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
            data = await apiCall({
                endpoint: "https://dummyjson.com/posts/?delay=5000",
                external: true,
            });

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
        log("Ya sattār!", error);
    } finally {
        unLoadIt();
    }
};

const fetchAndRenderYouTubePlaylists = async () => {
    const container = document.getElementById("playlists");
    const data = await initializeYouTubePlaylists();

    data.items.map(({ id, snippet = {} }) => {
        const { title, thumbnails = {}, resourceId = {} } = snippet;
        const { medium } = thumbnails;

        const inner = createElement("div", {
            id: id,
            classList: "flexy"
        });
        inner.append(
            createElement("h3", { textContent: title }),
            createElement("img", {
                width: medium?.width ?? "fit-content",
                height: medium?.height ?? "auto",
                src: medium?.url ?? "https://app.abuein.com/assets/images/eye.svg",
                alt: "Thumbnail image",
            }),
            createElement("a", {
                href: `https://www.youtube.com/watch?v=${resourceId.videoId}`,
                textContent: title
            }),
        );
        container.appendChild(inner);
    });
};

/** Monitor a form input in order to update the state of a form's "submit" button based on whether or not a given field currently has a value. */
const monitorFormInputs = (input) => {
    try {
        const nameField = document.getElementById("userName");
const sendButton = document.getElementById("sendButton");

sendButton.disabled = true;
// [note: this is disabled since it causes this article to always load with this example focused and scrolled into view]
//nameField.focus();

nameField.addEventListener("input", (event) => {
  const elem = event.target;
  const valid = elem.value.length !== 0;

  if (valid && sendButton.disabled) {
    sendButton.disabled = false;
  } else if (!valid && !sendButton.disabled) {
    sendButton.disabled = true;
  }
});

    } catch (error) {
        log("Ya sattār!", error);
    }
};

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  /** Pressing the Enter key lets the user toggle between windowed and fullscreen presentation of the web page. */
  const simpleFullscreenUsage = () => {
    try {
        document.addEventListener(
            "keydown",
            (e) => {
              if (e.key === "Enter") {
                toggleFullScreen();
              }
            },
            false,
          );
          
    } catch (error) {
        log("Ya sattār!", error);
    }
  };

  
export {
    generateNavMenu,
    renderAccountContent,
    renderDashboardContent,
    fetchAndRenderPosts,
    fetchAndRenderYouTubePlaylists,
    createElement,
    addMessage,
};

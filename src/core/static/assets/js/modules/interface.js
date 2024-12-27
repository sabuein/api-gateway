"use strict";

import { navItems } from "../models/elements.js";

// Function to generate the navigation menu
function generateNavMenu() {
  const user = JSON.parse(localStorage.getItem("user")),
    navContainer = document.getElementById("navBar"),
    currentPath = window.location.pathname;
  
  if (!user) return null;
  navContainer.innerHTML = ""; // Clear existing nav items
  console.log("Hello iinnnnnn...>");

  navItems.forEach(item => {
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

          item.subMenu.forEach(subItem => {
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
    if (!user.isLoggedIn) return `<p>Please <a href="/portal/signin">Sign in</a> to manage your portal.</p>`;
    else return `
      <h2>Links</h2>
      <ul>
        <li><a href="/portal/dashboard">Dashboard</a></li>
        <li><a href="/portal/posts">Posts</a></li>
        <li><a href="/portal/settings">Settings</a></li>
        <ul>
          <li><a href="/portal/settings/billing">Billing information</a></li>
          <li><a href="/portal/settings/edit">Personal information</a></li>
          <li><a href="/portal/settings/privacy">Privacy Settings</a></li>
          <li><a href="/portal/settings/profile">Profile</a></li>
        </ul>
      </ul>
    `;
  }

function renderDashboardContent() {
  const user = JSON.parse(localStorage.getItem("user"));
    if (!user.isLoggedIn) return `<p><a href="/portal/signup">Sign up</a>  or <a href="/portal/signin">Sign in</a> to access personalized features.</p>`;
    
    if (user.role === "admin") {
      return `
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a href="/manage-users">Manage Users</a></li>
          <li><a href="/content-approval">Content Approval</a></li>
          <li><a href="/site-metrics">View Site Metrics</a></li>
        </ul>
      `;
    } else return `
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

export {
  generateNavMenu,
    renderAccountContent,
    renderDashboardContent,
    

};
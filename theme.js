(() => {
  "use strict";

  if (window.__holyWeekThemeInitialized) return;
  window.__holyWeekThemeInitialized = true;

  const STORAGE_KEY = "holyWeekTheme";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }

    return mediaQuery.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    const themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) return;

    const isDark = theme === "dark";
    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن");
    themeToggle.title = isDark ? "الوضع الفاتح" : "الوضع الداكن";
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }

  function initializeThemeToggle() {
    if (!document.body || document.querySelector(".theme-toggle")) return;

    const themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      saveTheme(nextTheme);
      applyTheme(nextTheme);
    });

    document.documentElement.appendChild(themeToggle);
    applyTheme(root.dataset.theme || getStoredTheme());
  }

  applyTheme(getStoredTheme());

  mediaQuery.addEventListener("change", (event) => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    } catch {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeThemeToggle, { once: true });
  } else {
    initializeThemeToggle();
  }
})();

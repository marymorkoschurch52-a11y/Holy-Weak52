(() => {
  "use strict";

  if (window.__holyWeekShareInitialized) return;
  window.__holyWeekShareInitialized = true;

  function initializeShareButtons() {
    document.querySelectorAll(".share-site-button").forEach((button) => {
      if (button.dataset.shareInitialized === "true") return;
      button.dataset.shareInitialized = "true";

      const defaultLabel = "مشاركة الموقع";
      const copiedLabel = "✓ تم نسخ الرابط";

      button.addEventListener("click", async () => {
        const shareData = {
          title: "أسبوع الآلام",
          text: "خريطة أسبوع الآلام — من أجلنا... مات وقام",
          url: window.location.href,
        };

        if (typeof navigator.share === "function") {
          try {
            await navigator.share(shareData);
          } catch (error) {
            if (error?.name !== "AbortError") console.error("Share failed:", error);
          }
          return;
        }

        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch {
          const fallbackInput = document.createElement("textarea");
          fallbackInput.value = window.location.href;
          fallbackInput.setAttribute("readonly", "true");
          fallbackInput.style.position = "fixed";
          fallbackInput.style.opacity = "0";
          document.body.appendChild(fallbackInput);
          fallbackInput.select();
          document.execCommand("copy");
          fallbackInput.remove();
        }

        button.querySelector(".share-site-label").textContent = copiedLabel;
        window.setTimeout(() => {
          button.querySelector(".share-site-label").textContent = defaultLabel;
        }, 2000);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShareButtons, { once: true });
  } else {
    initializeShareButtons();
  }
})();

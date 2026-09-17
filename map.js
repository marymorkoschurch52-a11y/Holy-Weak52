(() => {
  "use strict";

  if (window.__holyWeekMapInitialized) return;
  window.__holyWeekMapInitialized = true;

  function initializeMap() {
    const map = document.querySelector(".holy-map");
    const info = document.querySelector(".map-info");
    const title = document.querySelector(".map-info-title");
    const description = document.querySelector(".map-info-description");
    const days = document.querySelector(".map-days");
    const discover = document.querySelector(".map-discover");
    const close = document.querySelector(".map-info-close");
    const timeline = document.querySelector(".map-timeline");

    if (!map || !info || !title || !description || !days || !discover || !close) return;

    function closeInfo(focusMarker = false) {
      const activeMarker = document.querySelector(".map-marker.is-active");

      info.classList.remove("is-visible");
      info.setAttribute("aria-hidden", "true");
      map.removeAttribute("data-active-location");

      document.querySelectorAll(".map-marker.is-active").forEach((marker) => {
        marker.classList.remove("is-active");
      });

      if (focusMarker && activeMarker) activeMarker.focus();
    }

    function openInfo(marker) {
      document.querySelectorAll(".map-marker.is-active").forEach((activeMarker) => {
        activeMarker.classList.remove("is-active");
      });

      document.querySelectorAll(".map-day.is-active").forEach((day) => {
        day.classList.remove("is-active");
      });

      marker.classList.add("is-active");
      map.dataset.activeLocation = marker.dataset.location;
      title.textContent = marker.dataset.name;
      description.textContent = marker.dataset.description;
      days.textContent = `الأيام المرتبطة: ${marker.dataset.days}`;
      discover.dataset.page = marker.dataset.page;
      discover.setAttribute("aria-label", `استكشف يوم ${marker.dataset.name}`);
      info.classList.add("is-visible");
      info.setAttribute("aria-hidden", "false");
      close.focus();
    }

    map.addEventListener("click", (event) => {
      const marker = event.target.closest(".map-marker");
      if (marker) openInfo(marker);
    });

    close.addEventListener("click", () => closeInfo(true));

    timeline?.addEventListener("click", (event) => {
      const day = event.target.closest(".map-day");
      if (!day) return;

      const marker = map.querySelector(`.map-marker[data-location="${day.dataset.location}"]`);
      if (!marker) return;

      openInfo(marker);
      day.classList.add("is-active");
      marker.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMap, { once: true });
  } else {
    initializeMap();
  }
})();

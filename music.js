(() => {
  "use strict";

  const AUDIO_FILE = "./audio.mp3";

  const STORAGE_ENABLED = "holyWeekMusicEnabled";
  const STORAGE_POSITION = "holyWeekMusicPosition";

  // =========================================
  // Create audio
  // =========================================

  const audio = document.createElement("audio");

  audio.src = AUDIO_FILE;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 1;

  // No visible controls
  audio.controls = false;
  audio.style.display = "none";

  // =========================================
  // Create button
  // =========================================

  const button = document.createElement("button");

  button.type = "button";
  button.className = "music-toggle";

  button.setAttribute("aria-label", "تشغيل الموسيقى");
  button.setAttribute("title", "تشغيل الموسيقى");

  // =========================================
  // State
  // =========================================

  const savedEnabled =
    localStorage.getItem(STORAGE_ENABLED);

  // أول مرة = مقفولة
  let musicEnabled =
    savedEnabled === "true";

  // =========================================
  // Storage helpers
  // =========================================

  function saveEnabled() {
    localStorage.setItem(
      STORAGE_ENABLED,
      musicEnabled ? "true" : "false"
    );
  }

  function savePosition() {
    if (
      Number.isFinite(audio.currentTime) &&
      audio.currentTime >= 0
    ) {
      localStorage.setItem(
        STORAGE_POSITION,
        String(audio.currentTime)
      );
    }
  }

  function getSavedPosition() {
    const value = parseFloat(
      localStorage.getItem(STORAGE_POSITION) || "0"
    );

    return Number.isFinite(value) && value >= 0
      ? value
      : 0;
  }

  // =========================================
  // Button UI
  // =========================================

  function updateButton() {
    const isPlaying =
      !audio.paused &&
      !audio.ended;

    button.textContent = isPlaying
      ? "🔊"
      : "🔇";

    button.setAttribute(
      "aria-label",
      isPlaying
        ? "إيقاف الموسيقى"
        : "تشغيل الموسيقى"
    );

    button.setAttribute(
      "title",
      isPlaying
        ? "إيقاف الموسيقى"
        : "تشغيل الموسيقى"
    );
  }

  // =========================================
  // Restore position
  // =========================================

  function restorePosition() {
    const savedPosition = getSavedPosition();

    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      savedPosition < audio.duration
    ) {
      audio.currentTime = savedPosition;
    }
  }

  // =========================================
  // Start music
  // =========================================

  async function startMusic(fromUserClick = false) {
    musicEnabled = true;
    saveEnabled();

    try {
      await audio.play();

      updateButton();
    } catch (error) {
      /*
        If browser blocks autoplay,
        we DON'T pretend that music is playing.
      */

      if (!fromUserClick) {
        console.log(
          "Autoplay blocked. Waiting for user interaction."
        );
      }

      updateButton();
    }
  }

  // =========================================
  // Stop music
  // =========================================

  function stopMusic() {
    audio.pause();

    musicEnabled = false;

    saveEnabled();
    savePosition();

    updateButton();
  }

  // =========================================
  // Button click
  // =========================================

  button.addEventListener("click", async () => {
    if (audio.paused) {
      await startMusic(true);
    } else {
      stopMusic();
    }
  });

  // =========================================
  // Audio events
  // =========================================

  audio.addEventListener("loadedmetadata", () => {
    restorePosition();

    /*
      If the user had music enabled on the
      previous page, try to continue.
    */

    if (musicEnabled) {
      startMusic(false);
    }

    updateButton();
  });

  audio.addEventListener("play", () => {
    updateButton();
  });

  audio.addEventListener("pause", () => {
    savePosition();
    updateButton();
  });

  audio.addEventListener("timeupdate", () => {
    savePosition();
  });

  audio.addEventListener("ended", () => {
    updateButton();
  });

  audio.addEventListener("error", () => {
    console.error(
      "Music file could not be loaded:",
      AUDIO_FILE
    );

    musicEnabled = false;
    saveEnabled();

    updateButton();
  });

  // =========================================
  // Save before leaving page
  // =========================================

  window.addEventListener("beforeunload", () => {
    savePosition();
    saveEnabled();
  });

  window.addEventListener("pagehide", () => {
    savePosition();
    saveEnabled();
  });

  // Save music state before navigating between the static HTML pages.
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".page-link");

    if (!link) return;

    const page = link.dataset.page;

    if (!page) return;

    event.preventDefault();
    savePosition();
    saveEnabled();
    window.location.href = page;
  });

  // =========================================
  // Add elements
  // =========================================

  function initializeMusic() {
    if (!document.body) return;

    document.body.appendChild(audio);
    document.documentElement.appendChild(button);

    updateButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeMusic
    );
  } else {
    initializeMusic();
  }
})();
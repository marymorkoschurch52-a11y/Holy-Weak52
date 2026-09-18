(() => {
  "use strict";

  if (window.__holyWeekCandleInitialized) return;
  window.__holyWeekCandleInitialized = true;

  const STORAGE_KEY = "holyWeekCandleLit";
  const candleButton = document.createElement("button");
  const candleVisual = document.createElement("span");
  const candleBody = document.createElement("span");
  const wick = document.createElement("span");
  const flame = document.createElement("span");
  const prayerText = document.createElement("span");
  let isLit = false;
  let pointerFrame = 0;
  let previousPointer = null;
  const airCurrent = {
    x: 0,
    y: 0,
    rotate: 0,
    stretch: 1,
    glowX: 0,
    glowY: 0,
  };
  const targetAirCurrent = { ...airCurrent };

  candleButton.type = "button";
  candleButton.className = "candle-toggle";
  candleButton.setAttribute("aria-label", "إضاءة الشمعة");
  candleButton.setAttribute("aria-pressed", "false");
  candleButton.title = "إضاءة الشمعة";

  candleVisual.className = "candle-visual";
  candleBody.className = "candle-body";
  wick.className = "candle-wick";
  flame.className = "candle-flame";
  prayerText.className = "candle-prayer";
  prayerText.textContent = "صلِّ من أجلنا";

  candleBody.append(wick, flame);
  candleVisual.append(candleBody);
  candleButton.append(candleVisual, prayerText);

  function readLitState() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  function saveLitState() {
    try {
      localStorage.setItem(STORAGE_KEY, String(isLit));
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }

  function updateCandle() {
    candleButton.classList.toggle("is-lit", isLit);
    candleButton.setAttribute(
      "aria-label",
      isLit ? "إطفاء الشمعة" : "إضاءة الشمعة"
    );
    candleButton.setAttribute("aria-pressed", String(isLit));
    candleButton.title = isLit ? "إطفاء الشمعة" : "إضاءة الشمعة";
  }

  function setAirCurrent(values) {
    Object.assign(targetAirCurrent, values);

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(updateAirCurrent);
    }
  }

  function updateAirCurrent() {
    pointerFrame = 0;

    Object.keys(airCurrent).forEach((key) => {
      airCurrent[key] += (targetAirCurrent[key] - airCurrent[key]) * 0.14;
    });

    candleButton.style.setProperty("--candle-air-x", `${airCurrent.x.toFixed(2)}px`);
    candleButton.style.setProperty("--candle-air-y", `${airCurrent.y.toFixed(2)}px`);
    candleButton.style.setProperty("--candle-air-rotate", `${airCurrent.rotate.toFixed(2)}deg`);
    candleButton.style.setProperty("--candle-air-stretch", airCurrent.stretch.toFixed(3));
    candleButton.style.setProperty("--candle-air-glow-x", `${airCurrent.glowX.toFixed(2)}%`);
    candleButton.style.setProperty("--candle-air-glow-y", `${airCurrent.glowY.toFixed(2)}%`);

    const settling = Object.keys(airCurrent).some(
      (key) => Math.abs(targetAirCurrent[key] - airCurrent[key]) > 0.01
    );

    if (settling) {
      pointerFrame = window.requestAnimationFrame(updateAirCurrent);
    }
  }

  function initializePointerInteraction() {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    document.addEventListener("pointermove", (event) => {
      if (!isLit) return;

      const rect = candleVisual.getBoundingClientRect();
      const candleX = rect.left + rect.width / 2;
      const candleY = rect.top + rect.height * 0.3;
      const distance = Math.hypot(event.clientX - candleX, event.clientY - candleY);
      const influence = Math.max(0, 1 - distance / 220);

      if (!previousPointer) {
        previousPointer = { x: event.clientX, y: event.clientY };
        return;
      }

      const velocityX = Math.max(-1, Math.min(1, (event.clientX - previousPointer.x) / 18));
      const velocityY = Math.max(-1, Math.min(1, (event.clientY - previousPointer.y) / 18));
      previousPointer = { x: event.clientX, y: event.clientY };

      setAirCurrent({
        x: velocityX * influence * 3.2,
        y: velocityY * influence * 1.2,
        rotate: velocityX * influence * 8,
        stretch: 1 + Math.abs(velocityX + velocityY) * influence * 0.08,
        glowX: velocityX * influence * 5,
        glowY: velocityY * influence * 3,
      });
    });

    document.addEventListener("pointerleave", () => {
      previousPointer = null;
      setAirCurrent({ x: 0, y: 0, rotate: 0, stretch: 1, glowX: 0, glowY: 0 });
    });
  }

  function initializeCandle() {
    if (!document.body || document.querySelector(".candle-toggle")) return;

    isLit = readLitState();
    document.documentElement.appendChild(candleButton);
    updateCandle();
    initializePointerInteraction();
  }

  candleButton.addEventListener("click", () => {
    isLit = !isLit;
    saveLitState();
    updateCandle();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCandle, { once: true });
  } else {
    initializeCandle();
  }
})();

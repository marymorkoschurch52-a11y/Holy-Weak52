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

  function initializeCandle() {
    if (!document.body || document.querySelector(".candle-toggle")) return;

    isLit = readLitState();
    document.documentElement.appendChild(candleButton);
    updateCandle();
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

document.addEventListener('DOMContentLoaded', () => {
  const stations = Array.from(document.querySelectorAll('.station'));


  /* ---- build the side navigation dots ---- */
  const dotsList = document.getElementById('stationDots');
  const dotButtons = [];
  if (dotsList) {
    stations.forEach((station, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'اذهب إلى المحطة ' + (i + 1));
      btn.addEventListener('click', () => {
        station.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      li.appendChild(btn);
      dotsList.appendChild(li);
      dotButtons.push(btn);
    });
  }

  /* ---- scroll progress fill along the central path + active dot ---- */
  const progressFill = document.getElementById('progressFill');
  const pathSection = document.getElementById('path');

  let ticking = false;

  function updateOnScroll() {
    ticking = false;
    if (!pathSection) return;

    const rect = pathSection.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewportH * 0.5 - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;

    if (progressFill) progressFill.style.height = pct + '%';

    let activeIndex = -1;
    stations.forEach((station, i) => {
      const r = station.getBoundingClientRect();
      if (r.top < viewportH * 0.6) activeIndex = i;
    });

    dotButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === activeIndex);
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateOnScroll);
  updateOnScroll();
});

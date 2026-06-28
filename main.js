/* =============================================
   SHINEKZN — main.js
   - Water ripple canvas hero
   - Nav scroll effect & mobile toggle
   - Booking form submit handler
============================================= */

// ---- NAV ----
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navBurger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});


// ---- WATER CANVAS ----
(function () {
  const canvas = document.getElementById('waterCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, animId;

  const COLS = 80;
  const DAMP = 0.985;
  const SPEED = 0.3;

  let curr, prev;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    curr = new Float32Array(COLS * COLS);
    prev = new Float32Array(COLS * COLS);
  }

  function idx(x, y) { return y * COLS + x; }

  function ripple() {
    for (let y = 1; y < COLS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        const i = idx(x, y);
        curr[i] = (
          prev[idx(x - 1, y)] +
          prev[idx(x + 1, y)] +
          prev[idx(x, y - 1)] +
          prev[idx(x, y + 1)]
        ) / 2 - curr[i];
        curr[i] *= DAMP;
      }
    }
    [curr, prev] = [prev, curr];
  }

  function draw() {
    const cellW = W / COLS;
    const cellH = H / COLS;
    ctx.clearRect(0, 0, W, H);

    for (let y = 0; y < COLS - 1; y++) {
      for (let x = 0; x < COLS - 1; x++) {
        const v = Math.min(Math.abs(prev[idx(x, y)]) / 60, 1);
        const hue = 190 + v * 20;
        const light = 30 + v * 40;
        ctx.fillStyle = `hsla(${hue}, 60%, ${light}%, ${0.4 + v * 0.5})`;
        ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
  }

  function addDrop(cx, cy, strength) {
    const gx = Math.floor((cx / W) * COLS);
    const gy = Math.floor((cy / H) * COLS);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx > 0 && nx < COLS - 1 && ny > 0 && ny < COLS - 1) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          prev[idx(nx, ny)] += strength * Math.max(0, 1 - dist / 3);
        }
      }
    }
  }

  let tick = 0;
  function loop() {
    tick++;
    // Ambient random drops
    if (tick % 18 === 0) {
      addDrop(
        Math.random() * W,
        Math.random() * H,
        80 + Math.random() * 60
      );
    }
    ripple();
    draw();
    animId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse / touch drops
  canvas.addEventListener('mousemove', e => {
    if (Math.random() > 0.85) addDrop(e.offsetX, e.offsetY, 40);
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    addDrop(t.clientX - rect.left, t.clientY - rect.top, 60);
  }, { passive: true });

  loop();
})();


// ---- BOOKING FORM ----
const form = document.getElementById('bookingForm');
const success = document.getElementById('bookingSuccess');

if (form) {
  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e8633a';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate submission (replace with real backend / Formspree / EmailJS)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;

      // Also open WhatsApp with pre-filled message
      const name    = document.getElementById('name').value;
      const service = document.getElementById('service').value;
      const date    = document.getElementById('date').value;
      const vehicle = document.getElementById('vehicle').value;
      const msg = encodeURIComponent(
        `Hi ShineKZN! I'd like to book:\n` +
        `Name: ${name}\n` +
        `Service: ${service}\n` +
        `Vehicle: ${vehicle}\n` +
        `Date: ${date}`
      );
      window.open(`https://wa.me/27831234567?text=${msg}`, '_blank');
    }, 1200);
  });
}


// ---- SCROLL REVEAL ----
(function () {
  const items = document.querySelectorAll(
    '.service-card, .pricing-card, .testimonial, .trust__item, .about__text p'
  );
  if (!('IntersectionObserver' in window)) return;

  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
})();

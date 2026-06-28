/* =============================================
   SHINEKZN — main.js (IMPROVED)
   - Water ripple canvas hero with throttling
   - Nav scroll effect & mobile toggle with cleanup
   - Booking form with enhanced validation
   - Accessibility: prefers-reduced-motion support
   - Error handling for WhatsApp redirect
============================================= */

// ---- NAV ----
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

// Throttle scroll events to prevent excessive firing
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, 50);
}, { passive: true });

// Toggle mobile menu and ensure proper aria-expanded state
navBurger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', isOpen);
  navMobile.removeAttribute('hidden'); // Ensure visibility when opened
  
  // Clean up focus when closing
  if (!isOpen) {
    navMobile.querySelectorAll('a').forEach(link => link.blur());
  }
});

// Close mobile menu on link click and reset aria state
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
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
  const DROP_THROTTLE = 50; // ms between drops

  let curr, prev;
  let lastDropTime = 0;

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

  // Mouse drops — throttled to prevent performance issues
  canvas.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastDropTime > DROP_THROTTLE && Math.random() > 0.85) {
      addDrop(e.offsetX, e.offsetY, 40);
      lastDropTime = now;
    }
  }, { passive: true });

  // Touch drops
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

    // Enhanced validation with phone number check
    let valid = true;
    const phoneRegex = /^\+?27\d{9}$|^0\d{9}$/; // South African phone format
    
    form.querySelectorAll('[required]').forEach(field => {
      let fieldValid = true;
      
      if (!field.value.trim()) {
        fieldValid = false;
      } else if (field.type === 'tel' && !phoneRegex.test(field.value.replace(/\s/g, ''))) {
        // Validate phone number format (remove spaces for validation)
        fieldValid = false;
      }
      
      if (!fieldValid) {
        valid = false;
        field.style.borderColor = '#e8633a';
        field.setAttribute('aria-invalid', 'true');
        
        // Clear error on input
        field.addEventListener('input', function clearError() {
          field.style.borderColor = '';
          field.removeAttribute('aria-invalid');
          field.removeEventListener('input', clearError);
        }, { once: true });
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

      // Build WhatsApp message
      const name    = document.getElementById('name').value;
      const service = document.getElementById('service').value;
      const date    = document.getElementById('date').value;
      const vehicle = document.getElementById('vehicle').value;
      const location = document.getElementById('location').value || 'Not specified';
      const notes   = document.getElementById('notes').value || 'None';
      
      const msg = encodeURIComponent(
        `Hi ShineKZN! I'd like to book:\n` +
        `Name: ${name}\n` +
        `Service: ${service}\n` +
        `Vehicle: ${vehicle}\n` +
        `Date: ${date}\n` +
        `Location: ${location}\n` +
        `Notes: ${notes}`
      );
      
      // Handle WhatsApp redirect with error handling
      try {
        const whatsappWindow = window.open(`https://wa.me/27831234567?text=${msg}`, '_blank');
        if (!whatsappWindow) {
          // Fallback if popup blocked
          console.warn('WhatsApp popup blocked. Providing fallback message.');
          const fallbackMsg = document.createElement('div');
          fallbackMsg.innerHTML = `
            <p style="margin-top: 12px; font-size: 0.88rem; color: #4A6572;">
              <strong>WhatsApp didn't open?</strong> Copy and paste this to your message:
            </p>
            <p style="margin-top: 8px; padding: 12px; background: #f0f0f0; border-radius: 6px; font-size: 0.8rem; word-break: break-all;">
              ${decodeURIComponent(msg)}
            </p>
          `;
          success.appendChild(fallbackMsg);
        }
      } catch (err) {
        console.error('WhatsApp redirect failed:', err);
        // Display error message to user
        success.innerHTML += `<p style="margin-top: 12px; font-size: 0.88rem;">Please message us on WhatsApp: 083 123 4567</p>`;
      }
    }, 1200);
  });
}


// ---- SCROLL REVEAL ----
(function () {
  const items = document.querySelectorAll(
    '.service-card, .pricing-card, .testimonial, .trust__item, .about__text p'
  );
  
  // Check for IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    // Fallback: make all items visible immediately
    items.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  // Respect prefers-reduced-motion for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    items.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
  }

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

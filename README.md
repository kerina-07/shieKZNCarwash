# ShineKZN Car Wash Website 🚗💧

A modern, responsive car wash website built for a KwaZulu-Natal based business. Clean HTML, CSS & vanilla JavaScript — no frameworks, no build step, deploy anywhere.

## Live Preview

Open `index.html` in your browser, or deploy to [GitHub Pages](#deploy-to-github-pages) for free hosting.

---

## Features

- **Animated water ripple hero** — interactive canvas that responds to mouse & touch
- **Full service catalogue** — 6 services with descriptions and feature lists
- **Pricing section** — 3 clear tiers with a featured card highlight
- **Booking form** — validates inputs, opens a pre-filled WhatsApp message on submit
- **Mobile responsive** — hamburger nav, stacked layouts on small screens
- **Scroll reveal animations** — cards and sections fade in on scroll
- **Zulu-inspired geometric dividers** — SVG pattern accent tied to the KZN identity
- **Accessible** — keyboard focus visible, `aria-label`s on icon links, `prefers-reduced-motion` respected

---

## Project Structure

```
carwash-kzn/
├── index.html          # Single-page site
├── css/
│   └── style.css       # All styles (no preprocessor needed)
├── js/
│   └── main.js         # Canvas, nav, form, scroll reveal
└── README.md
```

---

## Customisation

### Business Details

Search `index.html` and `js/main.js` for these placeholders and replace them:

| Placeholder | Where | What to change |
|---|---|---|
| `ShineKZN` | nav, footer, `<title>` | Your business name |
| `27831234567` | WhatsApp links | Your number (country code + digits, no spaces/+) |
| `hello@shinekzn.co.za` | footer | Your email |
| `12 Wash Lane, Pinetown` | footer | Your address |
| `083 123 4567` | footer, booking section | Your display phone number |
| `2 000+` | hero badge | Your real stat |
| `4.9★` | about blob | Your Google rating |

### Colours

Edit the CSS variables at the top of `css/style.css`:

```css
:root {
  --teal:   #0D4F5C;   /* Primary brand colour */
  --coral:  #E8633A;   /* Accent / CTA colour  */
  --sand:   #E8D5A3;   /* Warm highlight        */
  --cream:  #F7F3EC;   /* Page background       */
  --dark:   #111820;   /* Dark sections         */
}
```

### Prices

Update the `R<span>` values in the Pricing section of `index.html`. VAT-inclusive pricing is noted — adjust the note if your pricing is exclusive.

---

## Booking / Form Backend

The form currently simulates a submission and opens WhatsApp. To wire up a real backend:

**Option A — Formspree (free tier, no server needed)**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option B — EmailJS (send directly from the browser)**
```js
// In js/main.js, replace the setTimeout block with:
emailjs.send('YOUR_SERVICE', 'YOUR_TEMPLATE', formData);
```

**Option C — Custom API**
Replace the `setTimeout` in `main.js` with a `fetch` POST to your endpoint.

---

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://yourusername.github.io/carwash-kzn/`

---

## Deploy to Netlify (One Click)

1. Drag the project folder into [netlify.com/drop](https://app.netlify.com/drop)
2. Done — you'll get a free `.netlify.app` URL instantly

---

## License

MIT — free to use, adapt, and deploy for your business.

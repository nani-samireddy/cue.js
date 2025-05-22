# @nani_samireddy/cue.js

[![npm version](https://img.shields.io/npm/v/@nani_samireddy/cue.js.svg)](https://www.npmjs.com/package/@nani_samireddy/cue.js)
[![npm downloads](https://img.shields.io/npm/dm/@nani_samireddy/cue.js.svg)](https://www.npmjs.com/package/@nani_samireddy/cue.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/nani-samireddy/cue.js?style=social)](https://github.com/nani-samireddy/cue.js/stargazers)

A lightweight, flexible, and beautifully designed JavaScript library for interactive product tours and feature walkthroughs. Guide your users with elegance and simplicity.

## ✨ Features

* **Lightweight & No Dependencies:** Built with vanilla JavaScript, keeping your bundle size small.
* **Declarative API:** Define your tours with simple, readable step configurations.
* **Smart Positioning:** Tooltips intelligently adjust to stay within the viewport.
* **Dynamic Content Support:** Guide users through elements that appear or change dynamically.
* **Customizable:** Easily extendable with custom styling, callbacks, and element targeting.
* **Event Hooks:** Integrate with analytics or trigger custom actions at various tour lifecycle points.
* **Keyboard Navigation:** Accessible tour controls for a better user experience.

---

## 🚀 Installation

### npm

Install the package using npm:

```bash
npm install @nani_samireddy/cue.js
````

### Yarn

Install the package using Yarn:

```bash
yarn add @nani_samireddy/cue.js
```

### CDN

You can quickly include Cue.js in your project using a CDN (Content Delivery Network).

**Minified Version (Recommended for Production):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@1.0.0/dist/cue.min.css">
<script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@1.0.0/dist/cue.min.js"></script>
```

**Unminified Version (For Development/Debugging):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@1.0.0/dist/cue.css">
<script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@1.0.0/dist/cue.umd.js"></script>
```

*Note: Replace `1.0.0` with the latest version number available on npm/CDN.*

-----

## 💡 Usage

### HTML Structure

Ensure your HTML elements have unique IDs or accessible CSS classes for `Cue.js` to target.

```html
<button id="start-tour-button">Start Guided Tour</button>
<div id="my-first-feature">...</div>
<span class="important-setting">...</span>
```

### JavaScript

If you're using a module bundler (like Webpack, Vite, Parcel), import `Cue` like this:

```javascript
import Cue from '@nani_samireddy/cue.js';

// Also import the CSS. How this works depends on your bundler's configuration.
// Common ways:
// import '@nani_samireddy/cue.js/dist/cue.css'; // Or cue.min.css
// import '@nani_samireddy/cue.js/style.css'; // If you've configured your bundler to look in src/ for 'style.css'
```

If you're using the **CDN version** or **vanilla JavaScript**, `Cue` will be globally available as `window.Cue`.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cue.js
    const cue = new Cue({
        // Global options (optional)
        overlay: true,          // Show dimmed overlay (default: true)
        showProgress: true,     // Show "Step X of Y" (default: false)
        showBullets: true,      // Show navigation dots (default: false)
        nextLabel: 'Continue',  // Custom button text
        debug: true             // Enable console logging for development
    });

    const tourSteps = [
        {
            target: '#my-first-feature', // Required: CSS selector or DOM element
            title: 'Welcome!',
            content: 'This is the first feature you should explore.',
            position: 'bottom' // Optional: 'top', 'bottom', 'left', 'right', 'center', 'auto'
        },
        {
            target: '.important-setting',
            title: 'Important Settings',
            content: 'Don\'t forget to customize your preferences here.',
            position: 'left',
            // Step-specific option overrides
            showButtons: false, // Hide default buttons for this step
            preStep: () => {
                console.log('Preparing for the settings step...');
                // You can show/hide elements or fetch data here.
            },
            postStep: () => {
                console.log('Finished settings step.');
            }
        },
        {
            target: '#start-tour-button',
            title: 'That\'s it!',
            content: 'You\'re ready to start exploring. Click "Done" to finish the tour.',
            position: 'top'
        }
    ];

    cue.setSteps(tourSteps);

    // Start the tour when a button is clicked
    document.getElementById('start-tour-button').addEventListener('click', () => {
        cue.start();
    });

    // --- Event Hooks (Optional) ---
    cue.onStart(() => {
        console.log('Tour started!');
    });

    cue.onChange((stepData, currentIndex) => {
        console.log(`Moved to step ${currentIndex + 1}: ${stepData.title}`);
        // Integrate with analytics: `trackEvent('Cue.js Tour Step', { step: currentIndex + 1, title: stepData.title });`
    });

    cue.onComplete(() => {
        console.log('Tour completed! 🎉');
        // Redirect, show a success message, etc.
    });

    cue.onExit((currentStepIndex) => {
        console.log(`Tour exited at step ${currentStepIndex + 1}.`);
    });
});
```

-----

## 🎨 Styling

Cue.js comes with beautiful, modern default styles. You can easily customize the look and feel using CSS variables:

```css
/* Custom styles in your own CSS file */
:root {
    --cue-primary-color: #6a0dad;      /* Deep Purple */
    --cue-accent-color: #ff6f00;       /* Orange Accent */
    --cue-bg-color: #f0f8ff;           /* Alice Blue background */
    --cue-border-radius: 12px;         /* More rounded corners */
    --cue-shadow-lg: 0 15px 25px rgba(0, 0, 0, 0.15); /* Stronger shadow */
}

/* You can also override specific classes */
.custom-cta-tooltip {
    background-color: #4CAF50;
    color: white;
    border: none;
    font-weight: bold;
}
.custom-cta-tooltip .cue-tooltip-title {
    color: white;
}
.custom-cta-tooltip::before {
    border-color: #4CAF50 transparent transparent transparent !important;
}
```

-----

## 🤝 Contributing

We welcome contributions to Cue.js\! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

-----

## 📄 License

Cue.js is [MIT licensed](https://www.google.com/search?q=LICENSE).

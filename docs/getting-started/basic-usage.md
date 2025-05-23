# Basic Usages

## Basic Usage

This guide will walk you through the simplest way to create your very first interactive tour with Cue.js. Our goal is to get something visible on your page quickly, demonstrating how easy it is to integrate Cue.js into different environments.

***

### 1. Prepare Your HTML

First, you'll need HTML elements on your page that Cue.js can "target." These are the elements that the tour steps will highlight and associate with tooltips.

Ensure your HTML includes a `start-tour-button` and at least one element with a unique `id` or a distinctive class.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Cue.js Tour</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.min.css">
    <style>
        /* Basic demo styling */
        body { font-family: sans-serif; margin: 40px; }
        .feature-box { border: 1px solid #ccc; padding: 20px; margin-top: 20px; border-radius: 8px; }
        #start-tour-button {
            padding: 10px 20px; background-color: #007bff; color: white;
            border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Welcome to My App!</h1>
    <p>A simple application to showcase Cue.js tours.</p>

    <div id="dashboard-widget" class="feature-box">
        <h2>Your Dashboard Widget</h2>
        <p>This is a key area displaying important information.</p>
    </div>

    <div id="settings-area" class="feature-box">
        <h2>User Settings</h2>
        <p>Manage your preferences and profile.</p>
    </div>

    <button id="start-tour-button">Start Guided Tour</button>

    <script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.min.js"></script>

    <script src="app.js"></script> </body>
</html>
```

***

### 2. Using Cue.js in Your Project

Cue.js is framework-agnostic, meaning it works seamlessly with vanilla JavaScript or popular libraries and frameworks like React.

#### A. Vanilla JavaScript

This is the most direct way to integrate Cue.js by using it globally in your HTML.

**Create a file named `app.js` (or similar) and link it in your HTML as shown above:**

```javascript
// app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create a new instance of Cue.js
    const cue = new Cue(); // 'Cue' is available globally via the CDN script

    // 2. Define your tour steps as an array of objects
    const tourSteps = [
        {
            target: '#dashboard-widget', // CSS selector for the element
            title: 'Your Dashboard Overview',
            content: 'This widget provides a quick glance at your most important data.',
            position: 'bottom'
        },
        {
            target: '#settings-area',
            title: 'Manage Your Settings',
            content: 'Access your profile and application preferences here.',
            position: 'left'
        }
    ];

    // 3. Load the steps into your Cue.js instance
    cue.setSteps(tourSteps);

    // 4. Start the tour when a button is clicked
    const startTourButton = document.getElementById('start-tour-button');
    if (startTourButton) {
        startTourButton.addEventListener('click', () => {
            cue.start();
        });
    }
});
```

#### B. React

When using React (or other component-based frameworks), you'll typically install Cue.js via npm and manage its lifecycle within a component using hooks like `useEffect`.

**1. Install Cue.js:**

```bash
npm install @nani_samireddy/cue.js
```

**2. Create a React Component (e.g., `TourInitiator.jsx`):**

```jsx
// TourInitiator.jsx
import React, { useEffect, useRef } from 'react';
import Cue from '@nani_samireddy/cue.js'; // Import Cue.js
import '@nani_samireddy/cue.js/dist/cue.min.css'; // Import Cue.js CSS

function TourInitiator() {
    const tourButtonRef = useRef(null); // Ref to target the button

    useEffect(() => {
        const cue = new Cue({
            overlay: true,
            showProgress: true,
            showBullets: true,
            nextLabel: 'Next',
            debug: false
        });

        const tourSteps = [
            {
                target: '#dashboard-widget', // Target by ID
                title: 'Welcome to Your Dashboard!',
                content: 'This is where you can see your key metrics at a glance.',
                position: 'bottom'
            },
            {
                // You can also target elements using refs within React components
                target: '#settings-area',
                title: 'Configure Your Preferences',
                content: 'Customize your experience in the settings section.',
                position: 'left'
            }
        ];

        cue.setSteps(tourSteps);

        const handleStartTour = () => {
            cue.start();
        };

        // Attach event listener to the button once the component mounts
        const button = tourButtonRef.current;
        if (button) {
            button.addEventListener('click', handleStartTour);
        }

        // Cleanup: Important to remove event listeners and exit tour if component unmounts
        return () => {
            if (button) {
                button.removeEventListener('click', handleStartTour);
            }
            if (cue.isTourActive) {
                cue.exit();
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        // Render the button that will start the tour
        <button id="start-tour-button" ref={tourButtonRef}>Start Guided Tour</button>
    );
}

export default TourInitiator;
```

**3. Integrate into your `App.jsx` (or main component):**

```jsx
// App.jsx
import React from 'react';
import TourInitiator from './TourInitiator'; // Import your tour component

function App() {
    return (
        <div className="App">
            <h1>Welcome to My App!</h1>
            <p>A simple application to showcase Cue.js tours.</p>

            <div id="dashboard-widget" className="feature-box">
                <h2>Your Dashboard Widget</h2>
                <p>This is a key area displaying important information.</p>
            </div>

            <div id="settings-area" className="feature-box">
                <h2>User Settings</h2>
                <p>Manage your preferences and profile.</p>
            </div>

            {/* Render your TourInitiator component which contains the button */}
            <TourInitiator />
        </div>
    );
}

export default App;
```

> **Tip:** While `useRef` is shown for the button, you can also target elements in React using their `id` attribute directly in your `tourSteps` array, as shown for `#dashboard-widget` and `#settings-area`.

***

### 3. Understanding the Core Properties

In the example above, we defined a single tour step with four essential properties:

* **`target` (Required)**
  * This is the CSS selector (e.g., `"#my-first-feature"`, `".my-class"`) or a direct JavaScript `HTMLElement` reference that Cue.js should highlight and associate with the tooltip.
  * **Tip:** Ensure your `target` accurately points to an existing element on your page before the tour starts.
* **`title` (Optional)**
  * A string that appears as the main heading in your tour step's tooltip.
  * Keep it concise and descriptive.
* **`content` (Optional)**
  * A string that provides the main explanation or message within the tour step's tooltip.
  * This can contain basic HTML if you need rich text (e.g., `<strong>bold</strong>`).
* **`position` (Optional)**
  * Determines where the tooltip appears relative to its `target` element.
  * Common values are `'top'`, `'bottom'`, `'left'`, `'right'`, `'center'`.
  * If omitted, Cue.js will try to automatically determine the best position to keep the tooltip visible (`'auto'`).



***

### 4. Live Demo: Try It Yourself!

Experience the basic usage of Cue.js live in this interactive demo. Click the "Start Basic Tour" button within the preview to see Cue.js in action! This demo uses **Vanilla JavaScript**.

{% embed url="https://stackblitz.com/edit/stackblitz-starters-kjrisjha?file=script.js" %}

***

### What Happens Next?

With these simple steps, when you click the "Start Tour" button, Cue.js will:

1. Dim the rest of your page with an overlay.
2. Draw a highlight around your designated `target` element.
3. Display a tooltip with your `title` and `content` at the specified `position`.
4. Provide "Next" and "Done" buttons to control the tour.

Congratulations! You've just created your first Cue.js tour.

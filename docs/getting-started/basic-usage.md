# Basic Usages

This guide will walk you through the simplest way to create your very first interactive tour with Cue.js. Our goal is to get something visible on your page as quickly as possible!

***

### 1. Prepare Your HTML

First, you'll need an HTML element on your page that Cue.js can "target." This is the element that the tour step will highlight and associate with a tooltip.

Add a simple element with a unique `id` (or a distinctive class) to your `<body>`. Also, ensure you have included the Cue.js library (via CDN or local file) and your custom script.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Cue.js Tour</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.min.css">
</head>
<body>

    <h1>Welcome to My App!</h1>
    <p id="my-first-feature">This is a cool feature we want to highlight.</p>

    <button id="start-tour-button">Start Tour</button>

    <script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.min.js"></script>

    <script>
        // Your JavaScript will go here
    </script>
</body>
</html>
```

### 2. Initialize and Start Your Tour

Now, let's add the JavaScript code to your `<script>` tag (or a separate `.js` file linked in your HTML) to define and start your first tour step.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create a new instance of Cue.js
    const cue = new Cue(); // No options needed for the simplest tour

    // 2. Define your tour steps as an array of objects
    const tourSteps = [
        {
            target: '#my-first-feature', // The CSS selector for the element to highlight
            title: 'Awesome Feature!',    // The title of the tooltip
            content: 'This is where all the magic happens in our application.', // The main content of the tooltip
            position: 'bottom'            // Position the tooltip below the target
        }
    ];

    // 3. Load the steps into your Cue.js instance
    cue.setSteps(tourSteps);

    // 4. Start the tour when a button is clicked
    document.getElementById('start-tour-button').addEventListener('click', () => {
        cue.start();
    });
});
```

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

### What Happens Next?

With these simple steps, when you click the "Start Tour" button, Cue.js will:

1. Dim the rest of your page with an overlay.
2. Draw a highlight around your designated `target` element.
3. Display a tooltip with your `title` and `content` at the specified `position`.
4. Provide "Next" and "Done" buttons to control the tour.

Congratulations! You've just created your first Cue.js tour.

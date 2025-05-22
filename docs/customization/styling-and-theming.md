# Styling and Theming

Cue.js comes with a modern, clean, and Figma-inspired default design that looks great out of the box. However, it's built to be highly customizable so you can seamlessly integrate it into your application's existing brand and aesthetic.

There are two primary ways to customize the styling: using **CSS Variables** for global theming, and applying **Step-Specific Classes** for unique steps.

***

### 1. Global Theming with CSS Variables

The easiest and most recommended way to apply your brand's colors, fonts, and spacing to Cue.js is by overriding its CSS variables. All of Cue.js's default styles are built using these variables, making global changes simple.

To override them, simply define these variables in a CSS file that loads _after_ `cue.min.css` (or `cue.css`), typically in your main `style.css` or a dedicated theme file.

#### Key CSS Variables

Here are some of the most commonly used CSS variables you can override:

| Variable Name                | Purpose                                       | Default Value (approx.) |
| ---------------------------- | --------------------------------------------- | ----------------------- |
| `--cue-primary-color`        | Main accent color (buttons, highlight border) | `#1a73e8` (Blue)        |
| `--cue-accent-color`         | Hover/active state for primary elements       | `#673ab7` (Purple)      |
| `--cue-text-color`           | Main text color inside tooltips               | `#3c4043` (Dark Gray)   |
| `--cue-subtle-text-color`    | Secondary text color (content, progress)      | `#70757a` (Medium Gray) |
| `--cue-bg-color`             | Background color of tooltips                  | `#ffffff` (White)       |
| `--cue-light-bg-color`       | Subtle background for interactive elements    | `#f8f9fa` (Light Gray)  |
| `--cue-border-color`         | Borders on tooltips and internal elements     | `#e0e0e0` (Light Gray)  |
| `--cue-border-radius`        | Global border-radius for highlights/tooltips  | `8px`                   |
| `--cue-button-border-radius` | Border-radius for buttons                     | `6px`                   |
| `--cue-shadow-lg`            | Main shadow for tooltips (elevation)          | `0 10px 15px...`        |
| `--cue-overlay-color`        | Color of the dimmed background overlay        | `rgba(0, 0, 0, 0.4)`    |
| `--cue-transition-duration`  | Duration of CSS transitions                   | `0.3s`                  |
| `--cue-z-index`              | Base z-index for tour elements                | `99999`                 |

#### Example: Changing Primary Color and Roundness

Let's say your brand uses a vibrant green and prefers very rounded corners.

```css
/* In your custom-theme.css file (loaded AFTER cue.min.css) */
:root {
    --cue-primary-color: #4CAF50;          /* Vibrant Green */
    --cue-accent-color: #388E3C;           /* Darker Green for hover */
    --cue-border-radius: 16px;             /* More rounded corners */
    --cue-button-border-radius: 12px;      /* Match button roundness */
    --cue-bg-color: #e8f5e9;               /* Lighter green background for tooltips */
    --cue-text-color: #212121;             /* Darker text for contrast */
}
```

By adding this CSS, all Cue.js elements will automatically update to use your new color scheme and border-radius values.

***

### 2. Step-Specific Styling with Classes

For unique tour steps that require a different look from the rest of the tour (e.g., a critical warning step, or a branded call-to-action step), you can apply custom CSS classes to individual tooltips and highlights.

Use the `tooltipClass` and `highlightClass` properties within your step object:

```javascript
const tourSteps = [
    {
        target: '#my-cta-button',
        title: 'Exclusive Offer!',
        content: 'Click here to get a special discount just for you.',
        position: 'top',
        tooltipClass: 'my-custom-tooltip',    // <-- Custom class for the tooltip
        highlightClass: 'my-custom-highlight' // <-- Custom class for the highlight
    },
    {
        target: '#delete-button',
        title: 'Critical Action',
        content: 'This action cannot be undone. Please confirm carefully.',
        position: 'left',
        tooltipClass: 'warning-tooltip'       // <-- Another custom class
    }
];
```

Then, define these custom classes in your CSS. They will override Cue.js's default styles (or the CSS variables you've set) for that specific step.

```css
/* In your custom-styles.css */

.my-custom-tooltip {
    background-color: #FFC107; /* Bright yellow background */
    color: #333;               /* Dark text */
    border: 2px solid #FFA000; /* Darker yellow border */
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.5); /* Yellow glow */
}
.my-custom-tooltip .cue-tooltip-title { /* Target the title within your custom tooltip */
    color: #9c27b0; /* A different color for the title */
}
.my-custom-tooltip::before { /* Adjust tooltip arrow color if needed */
    border-color: #FFC107 transparent transparent transparent !important;
}

.my-custom-highlight {
    border-color: #FFC107; /* Match highlight border to tooltip */
    background-color: rgba(255, 193, 7, 0.1); /* Translucent yellow fill */
}


.warning-tooltip {
    background-color: #F44336; /* Red background for warning */
    color: white;              /* White text */
    border: 1px solid #D32F2F; /* Darker red border */
}
.warning-tooltip .cue-tooltip-title {
    color: white;
}
.warning-tooltip::before {
    border-color: #F44336 transparent transparent transparent !important;
}
```

***

### 3. Advanced Overrides (Direct Class Modification)

For very advanced customization, you can directly target and override Cue.js's internal class names (e.g., `.cue-tooltip`, `.cue-highlight`, `.cue-button`).

> **Caution:**
>
> * Be mindful of CSS specificity. Ensure your custom rules are strong enough to override the defaults.
> * Directly overriding internal classes might be more prone to breaking if future library updates change these class names (though we strive for stability). CSS variables and custom classes are generally safer.

```css
/* Example of directly overriding a Cue.js internal class */
.cue-button.cue-next {
    background-color: #607d8b; /* Change default next button color */
    color: #ECEFF1;
    font-weight: bold;
}
.cue-button.cue-next:hover {
    background-color: #455A64;
}
```

***

### Tips for Effective Styling

* **Use Browser Dev Tools:** Inspect Cue.js elements in your browser's developer tools (F12) to understand their structure and existing styles. This will help you identify which CSS variables or classes to target.
* **Maintain Accessibility:** Always ensure your custom color combinations have sufficient contrast for readability, especially for text on backgrounds.
* **Keep it Organized:** Place all your custom Cue.js styles in a dedicated CSS file to keep your project clean.

***

### Next Steps

Now that you've mastered styling, let's look at how you can take full control of tour navigation.

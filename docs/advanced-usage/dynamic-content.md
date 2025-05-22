# Dynamic Content

Many modern web applications feature content that loads asynchronously, appears based on user interaction, or is conditionally rendered. This "dynamic content" can pose a challenge for guided tours, as the elements you want to highlight might not be present in the DOM when the tour is initialized or when a specific step is activated.

Cue.js provides powerful step-specific options to gracefully handle dynamic content and ensure a smooth tour experience.

***

### The Challenge

By default, Cue.js will try to find the `target` element for each step just before that step is displayed. If the element isn't found, the tour might stop or behave unexpectedly. Dynamic content scenarios (e.g., loading data from an API, lazy-loaded components, tabbed interfaces) require a way to:

1. **Ensure the target element is present and ready** before Cue.js tries to highlight it.
2. **Handle situations where the target element genuinely cannot be found**, even after preparation.

***

### Solutions in Cue.js

Cue.js addresses these challenges with two key step properties: `preStep` and `onTargetNotFound`.

#### 1. `preStep` for Preparation

The `preStep` callback allows you to execute custom code _before_ a tour step's highlight and tooltip are displayed. This is the perfect place to manipulate the DOM, trigger data loads, or open UI elements that contain your target.

* **Type:** `Function` (supports `async` functions)
* **When it fires:** Just before the current step's visual elements appear on the page.
* **Arguments:** `(stepData)` - The full object of the step about to be displayed.
* **Key Feature:** If `preStep` is an `async` function, Cue.js will **wait** for the returned Promise to resolve before rendering the step. This is crucial for asynchronous operations.

**Use Case 1: Revealing a Hidden Element**

Imagine you have a section of your page that is initially hidden, and a tour step needs to highlight an element within it.

```html
<button id="show-details-button">Show Details</button>
<div id="details-panel" style="display: none; padding: 20px; border: 1px solid #ccc; margin-top: 10px;">
    <h3>Product Information</h3>
    <p id="product-price">Price: $99.99</p>
</div>
```

```javascript
const cue = new Cue();

cue.setSteps([
    {
        target: '#show-details-button',
        title: 'See Product Details',
        content: 'Click this button to reveal more information about the product.',
        position: 'bottom'
    },
    {
        target: '#product-price', // Target is inside a hidden div
        title: 'Check the Price',
        content: 'This is the current price. It was hidden initially!',
        position: 'right',
        scrollToElement: true,
        // --- Use preStep to make the parent element visible ---
        preStep: (stepData) => {
            console.log(`PreStep for '${stepData.title}': Revealing details panel.`);
            const detailsPanel = document.getElementById('details-panel');
            if (detailsPanel) {
                detailsPanel.style.display = 'block'; // Make the panel visible
            }
        }
    }
]);

document.getElementById('start-tour-button').addEventListener('click', () => {
    cue.start();
});

// Example: To ensure the button click in step 1 reveals the panel for step 2:
// You'd typically let the user click the button, then use cue.nextStep()
// Or, if step 1 is just an intro, use preStep on step 2 to reveal.
```

**Use Case 2: Opening a Tab or Accordion Section**

If your target is inside a tab that's not currently active or an accordion section that's closed:

```javascript
{
    target: '#advanced-settings-tab',
    title: 'Advanced Settings',
    content: 'Click here to open the advanced settings tab.',
    position: 'bottom'
},
{
    target: '#privacy-option', // This is inside the 'advanced-settings-tab-content'
    title: 'Privacy Controls',
    content: 'Manage your privacy preferences here.',
    position: 'right',
    preStep: (stepData) => {
        console.log(`PreStep for '${stepData.title}': Activating advanced settings tab.`);
        // Assuming your tab system has an API to activate a tab
        activateTab('advanced-settings');
    }
}
```

**Use Case 3: Waiting for Asynchronous Data (Async `preStep`)**

If your target element is rendered only after an API call completes:

```javascript
{
    target: '#loaded-content-area',
    title: 'Dynamically Loaded Data',
    content: 'This section displays data fetched from our API.',
    position: 'bottom',
    preStep: async (stepData) => {
        console.log(`PreStep for '${stepData.title}': Fetching data...`);
        // Simulate an API call
        const response = await fetch('/api/dynamic-data');
        const data = await response.json();
        document.getElementById('loaded-content-area').innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        `;
        console.log('Data loaded and rendered.');
    }
}
```

> **Tip:** You can combine `preStep` with `scrollToElement: true` to ensure that after your content is revealed/loaded, the tour automatically scrolls to it for the user.

#### 2. `onTargetNotFound` for Graceful Handling

Sometimes, even with `preStep`, a target element might genuinely not appear (e.g., a server error, user permissions prevent rendering, a network issue). The `onTargetNotFound` callback allows you to control the tour's behavior in such scenarios.

* **Type:** `Function`
* **When it fires:** When Cue.js attempts to find the `target` element for a step, and `document.querySelector()` (or the direct `HTMLElement` reference) returns `null`.
* **Arguments:** `(stepData)` - The full object of the step whose target was not found.
* **Return Value:**
  * Return `'skip'` to automatically skip the current step and proceed to the next one in the tour.
  * Return `'stop'` to immediately stop the entire tour at this point.
  * If nothing is returned, the tour will stop by default (equivalent to `'stop'`).

**Use Case: Skipping a Step for Unavailable Features**

Consider a tour that includes a step for a premium feature, which might not be visible to free users.

```javascript
const cue = new Cue();

cue.setSteps([
    // ... some initial steps ...
    {
        target: '#premium-dashboard-widget', // This element might not exist for non-premium users
        title: 'Premium Analytics Dashboard',
        content: 'Unlock advanced insights with your premium subscription.',
        position: 'right',
        onTargetNotFound: (stepData) => {
            console.warn(`Target "${stepData.target}" not found. Skipping step.`);
            alert(`The "${stepData.title}" feature is not available. Skipping this part of the tour.`);
            return 'skip'; // Skip this step and proceed to the next one
        }
    },
    // ... subsequent steps for all users ...
    {
        target: '#common-settings-button',
        title: 'General Settings',
        content: 'Here are settings everyone can access.',
        position: 'bottom'
    }
]);

document.getElementById('start-tour-button').addEventListener('click', () => {
    cue.start();
});
```

***

### Combining `preStep` and `onTargetNotFound`

For robust handling, it's often best to use both `preStep` (to _try_ to make the element available) and `onTargetNotFound` (to handle cases where it _still_ isn't available).

```javascript
{
    target: '#dynamic-chart-canvas',
    title: 'Your Performance Chart',
    content: 'This chart will update with your latest data.',
    position: 'bottom',
    preStep: async (stepData) => {
        console.log(`PreStep: Attempting to load chart for '${stepData.title}'...`);
        try {
            const chartData = await fetch('/api/user-chart-data').then(res => res.json());
            // Assume renderChart function creates the canvas
            renderChart('dynamic-chart-canvas', chartData);
            console.log('Chart data loaded and rendered.');
        } catch (error) {
            console.error('Failed to load chart data:', error);
            // This error will lead to onTargetNotFound if #dynamic-chart-canvas isn't created
        }
    },
    onTargetNotFound: (stepData) => {
        console.warn(`Chart target "${stepData.target}" not found after preStep. Network issue or data error.`);
        alert('Could not load the chart for this step. Skipping this part of the tour.');
        return 'skip'; // Skip to the next step
    }
}
```

***

### Next Steps

By effectively using `preStep` and `onTargetNotFound`, you can build tours that are resilient to the dynamic nature of modern web applications.

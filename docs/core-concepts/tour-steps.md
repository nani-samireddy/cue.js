# Tour Steps

At the core of every Cue.js tour is an array of **step objects**. Each object in this array defines a single point in your guided experience: what element to highlight, what message to show, and how it behaves.

Understanding these step properties is crucial for building effective and dynamic tours.

***

### The Anatomy of a Tour Step

A basic tour step is a JavaScript object that you pass within an array to the `cue.setSteps()` method.

```javascript
const myTour = new Cue();
myTour.setSteps([
    {
        // Properties of the first step object
        target: '#my-element-id',
        title: 'Step 1 Title',
        content: 'This is the description for step 1.',
        position: 'bottom'
    },
    {
        // Properties of the second step object
        target: '.another-element-class',
        title: 'Step 2 Title',
        content: 'More details here.',
        position: 'right'
    }
]);
```

#### 1. `target` (Required)

The most fundamental property. This tells Cue.js _what_ element on your page this step is about.

* **Type:** `string` (CSS Selector) or `HTMLElement`
* **Description:**
  * If a `string`, it must be a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) (e.g., `"#myId"`, `".myClass"`, `"div[data-attribute='value']"`). Cue.js will use `document.querySelector()` to find this element.
  * If an `HTMLElement`, you can pass a direct reference to a DOM element you've already obtained (e.g., `document.getElementById('myId')`).
* **Technical Consideration:** When using a string selector, Cue.js re-queries the DOM for the `target` element _before displaying each step_. This is powerful for dynamic content, as the element doesn't need to exist when you initially call `setSteps()`, but it _must_ be present in the DOM by the time its step is about to be shown.

```javascript
// Targeting by ID (most common)
{ target: '#main-navigation' }

// Targeting by class
{ target: '.product-card:first-child' }

// Targeting by data attribute
{ target: '[data-tour-id="welcome-message"]' }

// Targeting a direct DOM element reference
const myElement = document.querySelector('.some-dynamic-div');
// ... later ...
{ target: myElement } // Be careful: `myElement` must exist when `setSteps` is called, unless preStep is used!
```

> **Tip:** For reliable targeting, especially when elements might load asynchronously or appear later, use unique IDs. If IDs aren't feasible, ensure your CSS selectors are robust and don't match unintended elements.

#### 2. `title` (Optional)

* **Type:** `string`
* **Description:** A concise heading that appears at the top of the tour step's tooltip. Use it to quickly summarize the purpose of the step.

```javascript
{
    target: '#user-profile-icon',
    title: 'Your Profile & Settings' // Clear and to the point
}
```

#### 3. `content` (Optional)

* **Type:** `string`
* **Description:** The main body text of the tour step's tooltip. Use this to provide detailed instructions, explanations, or context. Basic HTML (like `<strong>`, `<em>`, `<br>`) can be included to format your text.

```javascript
{
    target: '#notifications-bell',
    title: 'New Notifications',
    content: 'Click here to see all your <strong>unread messages</strong> and recent activity. Keep an eye on this bell for important updates!'
}
```

#### 4. `position` (Optional)

Controls where the tooltip appears relative to its `target` element.

* **Type:** `string`
* **Default:** `'auto'` (or the global `tooltipPosition` option)
* **Values:**
  * `'top'`: Tooltip appears above the target.
  * `'bottom'`: Tooltip appears below the target.
  * `'left'`: Tooltip appears to the left of the target.
  * `'right'`: Tooltip appears to the right of the target.
  * `'center'`: Tooltip appears in the center of the viewport (useful for general announcements, not tied to a specific element).
  * `'auto'`: Cue.js will intelligently try to find the best available position (prioritizing `bottom`, then `top`, then `right`, then `left`) to ensure the tooltip is fully visible within the current viewport.

```javascript
// Tooltip at the top
{ target: '#dashboard-chart', position: 'top' }

// Tooltip at the bottom
{ target: '#filter-button', position: 'bottom' }

// Tooltip in the center of the screen (no specific target highlighted)
{ target: 'body', position: 'center', title: 'Welcome Tour!', content: 'Let\'s begin your journey.' }
```

#### 5. `padding` (Optional)

Adjusts the space around the highlighted target element.

* **Type:** `number`
* **Default:** `10` (pixels) (or the global `padding` option)
* **Description:** Controls the padding between the `target` element and the highlight border. A larger number increases the space.

```javascript
{
    target: '#small-icon',
    title: 'Click this small icon',
    content: 'We added extra padding to make it easier to see the highlight.',
    padding: 20 // 20 pixels of padding around the icon
}
```

#### 6. `scrollToElement` (Optional)

Determines if the page should automatically scroll to make the target visible.

* **Type:** `boolean`
* **Default:** `true` (or the global `scrollToElement` option)
* **Description:** If `true`, Cue.js will smoothly scroll the page to ensure the `target` element is in the viewport and properly centered (vertically). Set to `false` if you want to manage scrolling yourself or if the element is always visible.

```javascript
// This step will automatically scroll into view
{ target: '#hidden-section', title: 'Hidden Content', scrollToElement: true }

// This step will NOT automatically scroll
{ target: '#header-logo', title: 'Always Visible', scrollToElement: false }
```

#### 7. `disableInteraction` (Optional)

Prevents user interaction with the highlighted element during the step.

* **Type:** `boolean`
* **Default:** `false`
* **Description:** If `true`, the `target` element will become non-interactive (clicks, hovers, inputs will be disabled). This is useful for "read-only" steps where you want the user to absorb information without accidentally activating the element. The overlay click-to-exit functionality remains active unless disabled globally.

```javascript
{
    target: '#submit-button',
    title: 'Review Your Form',
    content: 'Please check all fields before proceeding. This button is temporarily disabled.',
    disableInteraction: true // User cannot click the button during this step
}
```

#### 8. `showButtons` (Optional)

Overrides the global setting for displaying navigation buttons on a specific step.

* **Type:** `boolean`
* **Default:** `true` (or the global `showButtons` option)
* **Description:** If `false`, the "Next", "Back", "Skip", and "Done" buttons will not appear in the tooltip for this step. You would typically use this if you want to implement custom navigation logic or require a specific user action on the `target` to proceed.

```javascript
// This step will have no default navigation buttons
{
    target: '#form-field',
    title: 'Fill this out',
    content: 'Complete this field to continue the tour.',
    showButtons: false
}
```

#### 9. `preStep` (Optional)

A callback function executed _before_ a step is displayed.

* **Type:** `Function` (`async` function supported)
* **Description:** This function runs just before the highlight and tooltip for the step appear. It's incredibly powerful for:
  * **Showing/Hiding elements:** Making a hidden element visible.
  * **Opening/Closing menus:** Navigating to a different state of your UI.
  * **Fetching data:** Waiting for asynchronous operations to complete.
  * **Animations:** Starting an animation that prepares the target.
* **Arguments:** Receives the `step` object as an argument.
* **Asynchronous Support:** You can define `preStep` as an `async` function. Cue.js will wait for the `Promise` to resolve before displaying the step.

```javascript
{
    target: '#dropdown-menu',
    title: 'Select an Option',
    content: 'Click here to open the dropdown and make your selection.',
    position: 'bottom',
    preStep: async (step) => {
        console.log(`Pre-step for ${step.title}: Opening dropdown...`);
        const dropdown = document.getElementById('dropdown-menu');
        dropdown.classList.add('open'); // Assume 'open' class makes it visible
        // Simulate an API call or complex UI rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Dropdown should be open now.');
    }
}
```

#### 10. `postStep` (Optional)

A callback function executed _after_ a step is hidden.

* **Type:** `Function` (`async` function supported)
* **Description:** This function runs after the user has left the current step (either by navigating to the next/previous step, skipping the tour, or completing it). It's useful for:
  * **Cleaning up UI:** Hiding elements revealed by `preStep`.
  * **Resetting state:** Closing open menus or modals.
  * **Tracking:** Logging that a user passed this specific step.
* **Arguments:** Receives the `step` object as an argument.
* **Asynchronous Support:** Can also be an `async` function.

```javascript
{
    target: '#sidebar-panel',
    title: 'Explore the Sidebar',
    content: 'This panel gives you quick access to tools.',
    postStep: (step) => {
        console.log(`Post-step for ${step.title}: Closing sidebar if open.`);
        const sidebar = document.getElementById('sidebar-panel');
        sidebar.classList.remove('active'); // Assume 'active' makes it visible
    }
}
```

#### 11. `onTargetNotFound` (Optional)

A callback function for handling cases where a step's `target` element is missing.

* **Type:** `Function`
* **Description:** If Cue.js cannot find the element specified by `target` for a step, this function will be called. This prevents the tour from abruptly stopping if an element is missing (e.g., due to dynamic content not loading, or a user permission preventing its display).
* **Arguments:** Receives the `step` object as an argument.
* **Return Value:**
  * Return `'skip'` to automatically skip the current step and proceed to the next one.
  * Return `'stop'` to stop the tour gracefully at this point.
  * If nothing is returned, the tour will stop by default (equivalent to `'stop'`).

```javascript
{
    target: '#premium-feature-button', // This button might not exist for free users
    title: 'Premium Feature',
    content: 'Unlock advanced capabilities with our premium plan.',
    onTargetNotFound: (step) => {
        console.warn(`Target "${step.target}" not found. User might not have access.`);
        alert('This feature is not available for your current plan. Skipping tour step.');
        return 'skip'; // Skip this step and continue the tour
    }
}
```

***

### Putting It All Together: A Comprehensive Step Example

Here's an example combining several properties for a more complex tour step:

```javascript
{
    target: '#dynamic-dashboard-widget',
    title: 'Your Personalized Widget',
    content: 'This widget provides real-time updates tailored to your activity.',
    position: 'right',
    padding: 15,
    scrollToElement: true,
    disableInteraction: true,
    preStep: async (step) => {
        console.log(`Pre-step: Ensuring '${step.target}' is loaded...`);
        // Simulate waiting for a widget to load via API
        await new Promise(resolve => setTimeout(resolve, 800));
        const widget = document.querySelector(step.target);
        if (widget) {
            widget.style.opacity = '1'; // Make sure it's visible if it was hidden
        }
    },
    postStep: (step) => {
        console.log(`Post-step: Cleanup for '${step.target}'.`);
        const widget = document.querySelector(step.target);
        if (widget) {
            // Optional: revert visibility or state
            // widget.style.opacity = '0.5';
        }
    },
    onTargetNotFound: (step) => {
        console.error(`Error: Widget "${step.target}" not found! Tour cannot proceed here.`);
        alert('The dashboard widget failed to load. Please try again later.');
        return 'stop'; // Stop the tour
    }
}
```

***

### Next Steps

Now that you're familiar with defining individual tour steps, let's explore how to customize the visual appearance of your tours.

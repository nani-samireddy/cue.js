# Tour Lifecycle Events

Cue.js provides a set of powerful event hooks that allow you to execute custom JavaScript code at specific moments during your tour's lifecycle. This is essential for integrating with analytics, performing dynamic UI updates, or managing tour flow based on user interactions or application state.

***

### How to Register Event Callbacks

You can register a callback function for each event using methods on your `Cue` instance. You can register multiple callbacks for the same event.

```javascript
const cue = new Cue();

// Register a callback for the 'onStart' event
cue.onStart(() => {
    console.log('The tour has officially begun!');
});

// Register another callback for the 'onChange' event
cue.onChange((stepData, currentIndex) => {
    console.log(`Now viewing step ${currentIndex + 1}: ${stepData.title}`);
});
```

All callback functions receive the `Cue` instance as their `this` context.

***

### Available Event Hooks

| Event Method           | When it Fires                                                                                            | Arguments Passed to Callback (`(arg1, arg2, ... )`) |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `cue.onStart()`        | Once, when `cue.start()` is called and the first step is about to be shown.                              | `()` (No arguments)                                 |
| `cue.onBeforeChange()` | Just _before_ the tour transitions to a new step. Elements are not yet visible.                          | `(stepData, newStepIndex)`                          |
| `cue.onChange()`       | After a step's elements (highlight, tooltip) are initially displayed and positioned.                     | `(stepData, currentStepIndex)`                      |
| `cue.onAfterChange()`  | After a step's elements have fully animated into place and are stable.                                   | `(stepData, currentStepIndex)`                      |
| `cue.onExit()`         | When the tour is stopped prematurely (e.g., user clicks 'Skip', presses Esc, or `cue.exit()` is called). | `(currentStepIndex)`                                |
| `cue.onComplete()`     | When the user successfully navigates to the very last step and clicks 'Done'.                            | `()` (No arguments)                                 |
| `cue.onResize()`       | Whenever the browser window is resized while the tour is active.                                         | `()` (No arguments)                                 |

***

### Event Details & Use Cases

#### `cue.onStart(callback)`

* **Fires:** Exactly once, as soon as `cue.start()` is invoked, before any visual elements of the first step appear.
* **Arguments:** None.
* **Use Cases:**
  * **Analytics:** Log that a user has started a specific tour.
  * **UI Preparation:** Disable other interactive elements on the page that might interfere with the tour.
  * **Initial Setup:** Perform any global setup required for the tour.

```javascript
cue.onStart(() => {
    console.log('User began the onboarding tour!');
    // Example: Disable a "Help" button to avoid conflict
    document.getElementById('help-button').disabled = true;
    // Example: Track start with Google Analytics
    // gtag('event', 'tour_started', { 'tour_name': 'onboarding_guide' });
});
```

#### `cue.onBeforeChange(callback)`

* **Fires:** Just before the tour transitions from one step to another. At this point, the _new_ step's data is available, but its visual elements are not yet on the screen, and the old step's elements might still be visible.
* **Arguments:**
  * `stepData`: The full object for the _new_ step that the tour is about to transition to.
  * `newStepIndex`: The 0-based index of the _new_ step.
* **Use Cases:**
  * **Conditional Logic:** Perform checks on the `newStepIndex` or `stepData` to decide if specific actions are needed _before_ the step renders.
  * **Early UI Adjustments:** Prepare elements that need to be ready precisely when the new step is about to appear.

```javascript
cue.onBeforeChange((stepData, newIndex) => {
    console.log(`Preparing to show step ${newIndex + 1}: ${stepData.title}`);
    if (stepData.target === '#some-dynamic-panel') {
        // Potentially pre-load content or trigger an animation here
        // (though `preStep` is often better for async operations tied to a specific step)
    }
});
```

#### `cue.onChange(callback)`

* **Fires:** Immediately after a step's overlay, highlight, and tooltip elements have been added to the DOM and initially positioned. This happens as soon as the step appears on screen, even if CSS transitions are still animating.
* **Arguments:**
  * `stepData`: The full object for the _currently displayed_ step.
  * `currentStepIndex`: The 0-based index of the _currently displayed_ step.
* **Use Cases:**
  * **Analytics:** Track views of individual tour steps.
  * **Dynamic Content:** Update text or subtle UI elements based on the current step.
  * **Debugging:** Log current step information.

```javascript
cue.onChange((stepData, currentIndex) => {
    console.log(`User is on step ${currentIndex + 1}: ${stepData.title}`);
    // Example: Update a custom progress bar outside of Cue.js
    // updateProgressBar(currentIndex + 1, tourSteps.length);
    // Example: Track a step view with analytics
    // mixpanel.track('Tour Step Viewed', { 'tour_name': 'onboarding', 'step_index': currentIndex + 1, 'step_title': stepData.title });
});
```

#### `cue.onAfterChange(callback)`

* **Fires:** A short delay (matching `transitionDuration`) after `onChange`. This means all CSS transitions for the step's elements should have completed, and the step is fully stable visually.
* **Arguments:**
  * `stepData`: The full object for the _currently displayed_ step.
  * `currentStepIndex`: The 0-based index of the _currently displayed_ step.
* **Use Cases:**
  * **Post-Animation Actions:** Perform actions that should only happen once the UI is settled (e.g., precise focus management, or enabling/disabling elements based on stable positions).
  * **Confirm Visual Readiness:** Ensures the step is fully presented before performing sensitive UI changes or tests.

```javascript
cue.onAfterChange((stepData, currentIndex) => {
    console.log(`Step ${currentIndex + 1} is now fully stable.`);
    // Example: Trigger an subtle animation on the target element itself
    // document.querySelector(stepData.target).classList.add('pulse-effect');
});
```

#### `cue.onExit(callback)`

* **Fires:** When the tour is stopped prematurely by the user (clicking 'Skip', pressing `Escape`, clicking the overlay if `overlayClickExits` is true) or by calling `cue.exit()` programmatically.
* **Arguments:**
  * `currentStepIndex`: The 0-based index of the step that was active when the tour was exited.
* **Use Cases:**
  * **Cleanup:** Re-enable previously disabled UI elements, close any open temporary modals or menus.
  * **Analytics:** Record that a tour was abandoned and at which step.
  * **State Reset:** Reset any application state that was modified specifically for the tour.

```javascript
cue.onExit((stepIndex) => {
    console.log(`Tour exited by user at step ${stepIndex + 1}.`);
    // Example: Re-enable the help button
    document.getElementById('help-button').disabled = false;
    // Example: Track abandonment
    // analytics.track('Tour Abandoned', { 'tour_name': 'onboarding_guide', 'last_step': stepIndex + 1 });
});
```

#### `cue.onComplete(callback)`

* **Fires:** Only when the user successfully navigates through all steps and clicks the "Done" button on the very last step.
* **Arguments:** None.
* **Use Cases:**
  * **Success Message:** Display a "Tour Complete!" message or animation.
  * **Post-Tour Actions:** Redirect the user, open a survey, or grant a badge.
  * **Analytics:** Record a successful tour completion.

```javascript
cue.onComplete(() => {
    console.log('Tour finished! All steps completed.');
    alert('Congratulations! You've successfully completed the tour.');
    // Example: Track completion
    // analytics.track('Tour Completed', { 'tour_name': 'onboarding_guide' });
});
```

#### `cue.onResize(callback)`

* **Fires:** When the browser window is resized while the tour is currently active.
* **Arguments:** None.
* **Use Cases:**
  * **Debugging:** Monitor layout changes.
  * **Custom Refresh:** While Cue.js automatically calls `_positionElements()` on resize, if you have very complex custom UI around the tour elements, you might need to trigger additional layout logic.

```javascript
cue.onResize(() => {
    console.log('Window resized. Cue.js elements have been re-positioned.');
    // If you have external elements that need to re-layout on tour resize, do it here.
});
```

***

### Important Considerations for Callbacks

* **Keep Callbacks Lean:** Avoid heavy, blocking operations inside callbacks, especially those that fire frequently like `onChange` or `onAfterChange`, to maintain a smooth user experience.
* **Error Handling:** If your callbacks perform complex logic, consider wrapping them in `try...catch` blocks to prevent errors in your custom code from breaking the entire tour.
* **Asynchronous Operations:** For `preStep` and `postStep`, you can use `async` functions and `await` to ensure operations complete before the tour proceeds or finishes, respectively.

***

### Next Steps

Now that you understand the lifecycle and event hooks, let's explore how to customize the visual appearance of your tours.

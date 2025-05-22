# API Reference

This document serves as the complete and definitive reference for all public methods, configuration options, and event hooks available in Cue.js.

***

### 1. Global Configuration Options (`new Cue(options)`)

When you create a new `Cue.js` instance, you can pass an `options` object to its constructor to customize its global behavior.

```javascript
const cue = new Cue({
    overlay: false,
    showProgress: true,
    nextLabel: 'Continue',
    debug: true
});
```

| Option               | Type      | Default Value | Description                                                                                                                                              |
| -------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overlay`            | `boolean` | `true`        | If `true`, a dimmed, semi-transparent overlay will cover the rest of the page, visually emphasizing the highlighted element.                             |
| `overlayClickExits`  | `boolean` | `true`        | If `true` and `overlay` is also `true`, clicking anywhere on the overlay will exit the tour.                                                             |
| `showProgress`       | `boolean` | `false`       | If `true`, a "Step X of Y" text will be displayed in the tooltip.                                                                                        |
| `showBullets`        | `boolean` | `false`       | If `true`, small navigation dots (bullets) representing each step will be displayed in the tooltip. Clicking them navigates to the step.                 |
| `showButtons`        | `boolean` | `true`        | If `true`, the default "Next", "Back", "Skip", and "Done" navigation buttons will appear in the tooltip. Can be overridden per step.                     |
| `keyboardNavigation` | `boolean` | `true`        | If `true`, users can navigate the tour using keyboard keys (`ArrowRight` / `Spacebar` for next, `ArrowLeft` for previous, `Escape` to exit).             |
| `nextLabel`          | `string`  | `'Next'`      | The text displayed on the "Next" button.                                                                                                                 |
| `prevLabel`          | `string`  | `'Back'`      | The text displayed on the "Back" button.                                                                                                                 |
| `skipLabel`          | `string`  | `'Skip'`      | The text displayed on the "Skip Tour" button. If an empty string, the button will not appear.                                                            |
| `doneLabel`          | `string`  | `'Done'`      | The text displayed on the "Done" button (appears on the last step when it's the final action).                                                           |
| `scrollToElement`    | `boolean` | `true`        | If `true`, the page will automatically scroll to ensure the `target` element is visible within the viewport.                                             |
| `exitOnEsc`          | `boolean` | `true`        | If `true`, pressing the `Escape` key will immediately exit the tour.                                                                                     |
| `exitOnOverlayClick` | `boolean` | `true`        | This option is synonymous with `overlayClickExits`. If `true` and `overlay` is also `true`, clicking the overlay will exit the tour.                     |
| `debug`              | `boolean` | `false`       | If `true`, enables verbose logging to the browser console for debugging purposes, showing internal actions and warnings.                                 |
| `tooltipPosition`    | `string`  | `'auto'`      | The default position for tooltips relative to their target elements. Possible values: `'top'`, `'bottom'`, `'left'`, `'right'`, `'center'`, or `'auto'`. |
| `padding`            | `number`  | `10`          | The default padding (in pixels) around the highlighted `target` element.                                                                                 |
| `buttonClass`        | `string`  | `''`          | A custom CSS class string to be applied to all default navigation buttons. Useful for applying consistent custom button styles.                          |
| `highlightClass`     | `string`  | `''`          | A custom CSS class string to be applied to the highlight element. Useful for applying consistent custom highlight styles.                                |
| `tooltipClass`       | `string`  | `''`          | A custom CSS class string to be applied to the tooltip container. Useful for applying consistent custom tooltip styles.                                  |
| `transitionDuration` | `number`  | `300`         | The duration (in milliseconds) of CSS transitions for tour elements (highlight, tooltip, overlay). Should ideally match your CSS `transition-duration`.  |

***

### 2. Step Object Properties

Each individual step in your tour is defined by an object within the array you pass to `cue.setSteps()`. These properties allow you to customize each step's behavior and appearance.

```javascript
cue.setSteps([
    {
        target: '#my-element',
        title: 'My Step',
        content: 'Explanation here',
        position: 'right',
        disableInteraction: true
        // ... and other properties
    }
]);
```

| Property             | Type                    | Required | Default Value            | Description                                                                                                                                                                                                                        |
| -------------------- | ----------------------- | -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`             | `string \| HTMLElement` | Yes      | `None`                   | The CSS selector (e.g., `"#myId"`, `".myClass"`) or a direct DOM `HTMLElement` reference that Cue.js should highlight and associate with the tooltip. Required for the step to function.                                           |
| `title`              | `string`                | No       | `''`                     | The main heading or title displayed at the top of the tour step's tooltip.                                                                                                                                                         |
| `content`            | `string`                | No       | `''`                     | The primary explanatory text or message displayed within the tour step's tooltip. Can contain basic HTML (e.g., `<strong>`, `<em>`, `<br>`).                                                                                       |
| `position`           | `string`                | No       | Global `tooltipPosition` | Overrides the global `tooltipPosition` for this specific step. Values: `'top'`, `'bottom'`, `'left'`, `'right'`, `'center'`, or `'auto'`.                                                                                          |
| `highlightClass`     | `string`                | No       | Global `highlightClass`  | A custom CSS class string to be applied to the highlight element for _this specific step_. Overrides the global setting.                                                                                                           |
| `tooltipClass`       | `string`                | No       | Global `tooltipClass`    | A custom CSS class string to be applied to the tooltip container for _this specific step_. Overrides the global setting.                                                                                                           |
| `padding`            | `number`                | No       | Global `padding`         | The padding (in pixels) around the highlighted element for _this specific step_. Overrides the global setting.                                                                                                                     |
| `scrollToElement`    | `boolean`               | No       | Global `scrollToElement` | Overrides the global `scrollToElement` setting. If `true`, the page will automatically scroll to make the target element visible before this step is displayed.                                                                    |
| `disableInteraction` | `boolean`               | No       | `false`                  | If `true`, the `target` element will become non-interactive (clicks, hovers, inputs disabled) during this step. Useful for "read-only" steps.                                                                                      |
| `showButtons`        | `boolean`               | No       | Global `showButtons`     | Overrides the global `showButtons` setting for _this specific step_. If `false`, no default navigation buttons will appear in the tooltip for this step.                                                                           |
| `preStep`            | `Function`              | No       | `None`                   | A callback function executed _before_ this step's visual elements are displayed. Useful for making hidden elements visible, opening tabs, or performing asynchronous tasks (supports `async` functions which Cue.js will `await`). |
| `postStep`           | `Function`              | No       | `None`                   | A callback function executed _after_ this step's visual elements are hidden (when navigating away or exiting the tour from this step). Useful for cleanup or post-step actions (supports `async` functions).                       |
| `onTargetNotFound`   | `Function`              | No       | Exits tour               | A callback function invoked if the `target` element for this step cannot be found in the DOM. Must return `'skip'` to skip this step, or `'stop'` to stop the entire tour. If nothing is returned, the tour stops.                 |

***

### 3. Instance Methods

These are the public methods available on a `Cue` instance (`cue = new Cue();`).

* **`cue.setSteps(steps: Array<object>): Cue`**
  * **Description:** Defines the sequence of tour steps. This method must be called before `cue.start()`.
  * **Returns:** The `Cue` instance, allowing for method chaining.
* **`cue.start(initialStepIndex?: number): void`**
  * **Description:** Begins the tour. Optionally, you can specify a 0-based index to start the tour from a particular step.
  * **Returns:** `void`
* **`cue.goToStep(index: number): void`**
  * **Description:** Navigates the tour to a specific step by its 0-based index. If the tour is not active, it will first start the tour at that step.
  * **Returns:** `void`
* **`cue.nextStep(): void`**
  * **Description:** Advances the tour to the next step. If the current step is the last one, the tour will complete and trigger `onComplete`.
  * **Returns:** `void`
* **`cue.prevStep(): void`**
  * **Description:** Moves the tour back to the previous step.
  * **Returns:** `void`
* **`cue.exit(): void`**
  * **Description:** Immediately stops the tour and removes all Cue.js elements from the DOM. Triggers the `onExit` event.
  * **Returns:** `void`
* **`cue.refresh(): void`**
  * **Description:** Recalculates and re-positions the current step's highlight and tooltip. Useful if the page layout changes dynamically after a step has loaded (e.g., content loads, sidebar expands).
  * **Returns:** `void`
* **`cue.getCurrentStep(): object \| null`**
  * **Description:** Returns the full step object of the currently displayed tour step. Returns `null` if no tour is active.
  * **Returns:** `object` (the step data) or `null`.
* **`cue.getCurrentStepIndex(): number`**
  * **Description:** Returns the 0-based index of the currently displayed tour step. Returns `-1` if no tour is active.
  * **Returns:** `number`.

***

### 4. Event Hooks

Cue.js provides a set of event hooks that allow you to execute custom JavaScript code at specific moments during your tour's lifecycle. You register callbacks using methods like `cue.onStart(callback)`.

| Event Method           | When it Fires                                                                                            | Arguments Passed to Callback (`(arg1, arg2, ... )`) |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `cue.onStart()`        | Once, when `cue.start()` is called and the first step is about to be shown.                              | `()` (No arguments)                                 |
| `cue.onBeforeChange()` | Just _before_ the tour transitions to a new step. Elements are not yet visible.                          | `(stepData, newStepIndex)`                          |
| `cue.onChange()`       | After a step's elements (highlight, tooltip) are initially displayed and positioned.                     | `(stepData, currentStepIndex)`                      |
| `cue.onAfterChange()`  | After a step's elements have fully animated into place and are stable.                                   | `(stepData, currentStepIndex)`                      |
| `cue.onExit()`         | When the tour is stopped prematurely (e.g., user clicks 'Skip', presses Esc, or `cue.exit()` is called). | `(currentStepIndex)`                                |
| `cue.onComplete()`     | When the user successfully navigates to the very last step and clicks 'Done'.                            | `()` (No arguments)                                 |
| `cue.onResize()`       | Whenever the browser window is resized while the tour is active.                                         | `()` (No arguments)                                 |

> **Tip:** Learn more about how to effectively use these events for analytics, dynamic UI updates, and flow control in the [Tour Lifecycle & Events](../core-concepts/tour-lifecycle-events.md) page.

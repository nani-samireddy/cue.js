# Custom Navigation

By default, Cue.js provides intuitive "Next", "Back", "Skip", and "Done" buttons within the tooltip. However, you might want to customize their labels, hide them for certain steps, or even implement entirely custom navigation logic based on user actions outside the tooltip.

Cue.js offers flexible options and methods to achieve this.

***

### 1. Customizing Button Labels

The simplest form of customization is changing the text labels of the default navigation buttons. You can do this globally when initializing your `Cue` instance:

| Option      | Default Value | Description                                |
| ----------- | ------------- | ------------------------------------------ |
| `nextLabel` | `'Next'`      | Text for the "Next" button.                |
| `prevLabel` | `'Back'`      | Text for the "Back" button.                |
| `skipLabel` | `'Skip'`      | Text for the "Skip Tour" button.           |
| `doneLabel` | `'Done'`      | Text for the "Done" button (on last step). |

```javascript
const cue = new Cue({
    nextLabel: 'Proceed &rarr;', // More engaging "Next" button
    prevLabel: '&larr; Go Back', // Custom "Back" button
    skipLabel: 'No Thanks',      // A softer "Skip"
    doneLabel: 'All Set!'        // A friendly "Done"
});

cue.setSteps([
    // ... your tour steps
]);

cue.start();
```

***

### 2. Hiding Default Buttons

You might want to hide the standard navigation buttons if you require the user to perform a specific action on the highlighted element before proceeding, or if you're building completely custom navigation.

#### A. Hiding Globally

To hide buttons for the entire tour:

```javascript
const cue = new Cue({
    showButtons: false // Hides all default navigation buttons for the entire tour
});

cue.setSteps([
    // ... your tour steps
]);

cue.start();
```

#### B. Hiding Per Step

To hide buttons only for specific steps:

```javascript
const tourSteps = [
    {
        target: '#my-info-display',
        title: 'Important Note',
        content: 'Read this information carefully.',
        showButtons: false // No buttons on this step, user must advance programmatically
    },
    {
        target: '#next-button',
        title: 'Click Here',
        content: 'Click the button to continue.',
        showButtons: true // Buttons will appear on this step (if globally enabled)
    }
];

const cue = new Cue();
cue.setSteps(tourSteps);
cue.start();
```

***

### 3. Programmatic Tour Control

When you hide the default buttons or want to advance the tour based on user interactions _outside_ the tooltip, you'll use Cue.js's public methods:

* `cue.nextStep()`: Advances to the next step. If it's the last step, it completes the tour.
* `cue.prevStep()`: Goes back to the previous step.
* `cue.exit()`: Immediately stops the tour and removes all Cue.js elements.
* `cue.goToStep(index)`: Jumps directly to a specific step by its 0-based index.

#### A. Advancing on Custom Button Click

Imagine you have a custom "Got It!" button on your page, and you want clicking it to advance the tour.

```html
<div id="tour-controls">
    <button id="custom-next">Got It!</button>
</div>
```

```javascript
const cue = new Cue({
    showButtons: false // Hide Cue.js's built-in buttons
});

cue.setSteps([
    {
        target: '#some-element',
        title: 'See this',
        content: 'Click "Got It!" below to continue.',
        // No specific button settings needed here if global showButtons is false
    }
    // ... more steps
]);

cue.onStart(() => {
    // Show your custom controls when the tour starts
    document.getElementById('tour-controls').style.display = 'block';
});

cue.onExit(() => {
    // Hide your custom controls when the tour ends
    document.getElementById('tour-controls').style.display = 'none';
});

document.getElementById('custom-next').addEventListener('click', () => {
    cue.nextStep(); // Programmatically move to the next step
});

document.getElementById('start-tour-button').addEventListener('click', () => {
    cue.start();
});
```

#### B. Advancing on Form Input

You can make the tour advance only after a user interacts with a form field.

```html
<input type="text" id="username-field" placeholder="Enter your username">
```

```javascript
const cue = new Cue();

cue.setSteps([
    {
        target: '#username-field',
        title: 'Enter Username',
        content: 'Type your desired username here to proceed.',
        showButtons: false, // User must type to advance
        // You might use postStep to clear the field or do something else
    }
]);

// Listener for the input field
document.getElementById('username-field').addEventListener('input', (event) => {
    if (cue.isTourActive && cue.getCurrentStepIndex() === 0 && event.target.value.length >= 3) {
        // If tour is active, on first step, and user typed at least 3 chars
        cue.nextStep(); // Advance the tour
    }
});

document.getElementById('start-tour-button').addEventListener('click', () => {
    cue.start();
});
```

#### C. Exiting the Tour from Custom Controls

You can also create a custom "Exit Tour" button:

```html
<button id="custom-exit">Quit Tour</button>
```

```javascript
// Assume `cue` instance and `tourSteps` are defined
document.getElementById('custom-exit').addEventListener('click', () => {
    cue.exit(); // Programmatically exit the tour
});
```

#### D. Jumping to Specific Steps

The `cue.goToStep(index)` method is useful for non-linear tours or if you want to allow users to navigate directly to certain parts of a long tour.

```javascript
// Tour with multiple steps
const tourSteps = [
    { /* Step 0 */ target: '#intro', title: 'Intro' },
    { /* Step 1 */ target: '#features', title: 'Features' },
    { /* Step 2 */ target: '#settings', title: 'Settings' }
];
const cue = new Cue().setSteps(tourSteps);

// Example: Go directly to the 'Settings' step (index 2)
document.getElementById('go-to-settings-button').addEventListener('click', () => {
    cue.goToStep(2); // Jumps to the third step
});
```

***

### Next Steps

With control over tour navigation, you're ready to tackle more complex scenarios.

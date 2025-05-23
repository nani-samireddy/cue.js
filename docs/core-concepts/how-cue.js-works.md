# How Cue.Js Works

Cue.js is designed to make creating interactive user tours intuitive and efficient. At its heart, it translates your simple tour definitions into a dynamic, guided experience on your web page.

***

### 1. The Declarative Approach

Instead of writing complex JavaScript code to manipulate the DOM for every single step of your tour, you simply **declare** what each step should look like and where it should point. Cue.js takes this declarative configuration and handles all the underlying logic.

This approach offers several benefits:

* **Simplicity:** Define tours with straightforward JavaScript objects.
* **Readability:** Your tour logic is easy to understand and maintain.
* **Flexibility:** Easily reorder, add, or remove steps without rewriting interaction logic.

***

### 2. The Core Elements on Your Page

When a Cue.js tour is active, it dynamically injects and manages three primary elements into your HTML document to create the guided experience:

#### A. The Overlay

* **Purpose:** To dim the rest of the page and focus the user's attention on the current tour step's target element.
* **Appearance:** A semi-transparent layer that covers the entire viewport.
* **Behavior:** By default, clicking outside the highlighted area (on the overlay) will end the tour. This can be configured.

#### B. The Highlight

* **Purpose:** To visually emphasize the specific HTML element that the current tour step is referencing.
* **Appearance:** A distinct border and a subtle translucent fill around the `target` element, making it stand out from the dimmed background.
* **Behavior:** Its position and size dynamically adjust to precisely fit around your targeted element, with optional padding.

#### C. The Tooltip

* **Purpose:** To display the instructional content for the current tour step.
* **Appearance:** A floating card-like popup containing the step's title, content, navigation buttons, and optional progress indicators/bullets.
* **Behavior:** It intelligently positions itself relative to the `target` element (e.g., top, bottom, left, right). Cue.js has an "auto" positioning logic that tries to find the best spot to keep the tooltip fully visible within the user's viewport.

***

### 3. The Tour Lifecycle

A Cue.js tour follows a predictable lifecycle, allowing you to hook into various stages to perform custom actions (like sending analytics data, or showing/hiding dynamic content).

1. **Initialization (`new Cue()`):** You create an instance of the library.
2. **Step Definition (`setSteps()`):** You provide an array of step objects that define your tour.
3. **Tour Start (`start()`):** The tour begins.
   * The `onStart` event is triggered.
4. **Step Transition (`goToStep()`, `nextStep()`, `prevStep()`):** When moving between steps:
   * The `onBeforeChange` event is triggered (before the new step is rendered).
   * The old step's elements are animated out, and the new step's elements are created and positioned.
   * The `onChange` event is triggered (after the new step is initially displayed).
   * The new step's elements animate into place.
   * The `onAfterChange` event is triggered (after the new step is fully animated and stable).
5. **Tour End (`exit()`):** The tour finishes prematurely (e.g., user clicks "Skip" or `Escape`, or `cue.exit()` is called).
   * The `onExit` event is triggered.
6. **Tour Completion (`onComplete`):** The user progresses through all steps and clicks the "Done" button on the final step.
   * The `onComplete` event is triggered.

> **Tip:** Understanding these lifecycle events is key for building advanced and dynamic tours. You can learn more about them in the Tour Lifecycle & Events page.

### Try It Now

{% embed url="https://stackblitz.com/edit/stackblitz-starters-fihnmknq?embed=1&file=script.js" fullWidth="true" %}

***

### Next Steps

Now that you understand the fundamental principles, let's dive deeper into how you define each individual step in your tour.

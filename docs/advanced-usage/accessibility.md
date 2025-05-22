# Accessibility

Creating accessible web experiences is paramount. Guided tours, while helpful, can inadvertently create barriers for users with disabilities if not implemented carefully. Cue.js is built with accessibility in mind, providing a solid foundation, but achieving a fully accessible tour also depends on how you define your content and choose your targets.

***

### 1. Built-in Accessibility Features

Cue.js incorporates several features to make your tours more accessible out-of-the-box:

#### A. Keyboard Navigation

Users who rely on keyboards (e.g., for motor disabilities) can easily navigate your tours:

* **`Escape` key:** Exits the current tour.
* **`ArrowRight` or `Spacebar`:** Moves to the next tour step.
* **`ArrowLeft`:** Moves to the previous tour step.

You can configure these behaviors globally:

* **`exitOnEsc` (boolean, default: `true`):** Controls if the `Escape` key exits the tour.
* **`keyboardNavigation` (boolean, default: `true`):** Controls if `ArrowRight`/`Spacebar` and `ArrowLeft` keys navigate the tour.

```javascript
const cue = new Cue({
    keyboardNavigation: false, // Disable keyboard navigation if not desired
    exitOnEsc: false           // Disable Esc key exit
});
```

#### B. Focus Management

When a tour step is active, Cue.js ensures that the tooltip (and thus its interactive elements like buttons) receives focus, allowing keyboard users to interact with the tour controls immediately.

***

### 2. Your Responsibilities for Accessible Tours

While Cue.js provides the framework, the content you place within your tour steps and the elements you choose to highlight also play a crucial role in accessibility.

#### A. Accessible Target Elements

The elements you target (`target` property) should ideally be accessible themselves.

* **Semantic HTML:** Use appropriate HTML elements (e.g., `<button>`, `<a>`, `<input>`) rather than generic `div`s with click handlers, when possible.
* **Keyboard Focusable:** Ensure that interactive target elements can be focused using the Tab key.
* **Meaningful Labels:** Provide accessible names for interactive elements (e.g., using `aria-label`, `aria-labelledby`, or visually descriptive text).

#### B. Accessible Tooltip Content

The information you present in your `title` and `content` properties needs to be readable and understandable for everyone.

* **Clear Language:** Use plain, concise language. Avoid jargon where possible.
* **Sufficient Color Contrast:** Ensure the text colors in your tooltips have enough contrast against their background colors. The default Figma-inspired styles aim for good contrast, but if you're using custom `tooltipClass` styles or CSS variables, verify this.
  * **Tip:** Use online contrast checkers or browser developer tools to verify contrast ratios (aim for at least 4.5:1 for normal text).
* **Text Alternatives:** If you embed images or custom icons directly into your `content` using HTML, provide appropriate `alt` attributes or `aria-label`s for screen reader users.

#### C. Custom Navigation & Interaction

If you implement custom navigation logic (e.g., hiding default buttons and advancing the tour with your own buttons or form interactions), ensure:

* **Keyboard Operable:** Your custom buttons are focusable (`tabindex="0"`) and trigger with `Enter`/`Space`.
* **Clear Instructions:** Provide very clear instructions in the tooltip content on _how_ to proceed if default buttons are hidden.

#### D. ARIA Attributes (Advanced)

While Cue.js manages some basic ARIA for its main elements, if you create highly complex interactive custom content within your tooltips, you might need to add specific ARIA roles and properties to make them fully understandable by screen readers.

***

### 3. Testing Your Tour's Accessibility

Beyond simply using Cue.js's built-in features, it's highly recommended to perform accessibility testing:

* **Keyboard-Only Navigation:** Try navigating your entire tour using only the Tab, Shift+Tab, Spacebar, Enter, and Arrow keys. Can you access all tour controls and understand where you are?
* **Screen Reader Testing:** Use a screen reader (e.g., NVDA for Windows, VoiceOver for macOS, Narrator for Windows) to listen to your tour. Does it convey the correct information and guide the user effectively?
* **Browser Developer Tools:** Most modern browsers have an "Accessibility" tab in their developer tools that can help inspect the accessibility tree and identify issues.

> **Accessibility is an ongoing journey.**\
> Regularly test your tours with real users (especially those with disabilities) and use automated accessibility checkers to identify and address potential barriers. Your commitment to accessibility enhances the experience for all users.

***

### Next Steps

Now that you understand how to make your tours accessible, consider how to gain insights into their effectiveness.

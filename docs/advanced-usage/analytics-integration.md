# Analytics Integration

Understanding how users interact with your guided tours is crucial for optimizing your onboarding flows, feature adoption, and overall user experience. Cue.js makes it easy to send detailed engagement data to your analytics platform, allowing you to gain valuable insights.

### Why Track Tour Analytics?

* **Measure Effectiveness:** Determine if your tours are being completed and if they lead to desired user actions.
* **Identify Drop-off Points:** Pinpoint exactly where users are abandoning your tours, indicating areas for improvement in your steps or content.
* **Optimize Onboarding:** Refine your onboarding experience by understanding which tour flows lead to higher activation rates.
* **Feature Adoption:** Track if new features introduced via tours are being utilized.
* **Personalization:** Inform future tour content or user segments based on past tour engagement.

***

### How Cue.js Helps

Cue.js exposes several [Tour Lifecycle Events](https://www.google.com/search?q=tour-lifecycle-events.md) that serve as perfect trigger points for sending analytics data. You can hook into these events to track various aspects of tour engagement.

#### Key Events for Analytics Integration

Here are the primary Cue.js events you'll want to use for analytics, along with examples for common platforms (adapt these to your specific analytics SDK):

**1. `cue.onStart(callback)`**

* **Purpose:** To track when a user begins a tour.
* **When it fires:** Exactly once, when `cue.start()` is called.

```javascript
// Example with Google Analytics 4 (gtag.js)
cue.onStart(() => {
    console.log('Analytics: Tour started!');
    gtag('event', 'tour_started', {
        'tour_name': 'onboarding_guide',
        'tour_version': '1.0' // Consider adding versioning for A/B tests or updates
    });
});

// Example with Mixpanel
// cue.onStart(() => {
//     console.log('Mixpanel: Tour started!');
//     mixpanel.track('Tour Started', {
//         'Tour Name': 'Onboarding Guide',
//         'Tour Version': '1.0'
//     });
// });
```

**2. `cue.onChange(callback)`**

* **Purpose:** To track individual step views and progression through the tour.
* **When it fires:** After a step's elements (highlight, tooltip) are displayed and positioned.

```javascript
// Example with Google Analytics 4 (gtag.js)
cue.onChange((stepData, currentIndex) => {
    console.log(`Analytics: Viewing step ${currentIndex + 1}: ${stepData.title}`);
    gtag('event', 'tour_step_view', {
        'tour_name': 'onboarding_guide',
        'step_index': currentIndex + 1,
        'step_title': stepData.title,
        'tour_progress_percentage': Math.round(((currentIndex + 1) / cue.steps.length) * 100)
    });
});

// Example with Mixpanel
// cue.onChange((stepData, currentIndex) => {
//     console.log(`Mixpanel: Step viewed!`);
//     mixpanel.track('Tour Step Viewed', {
//         'Tour Name': 'Onboarding Guide',
//         'Step Index': currentIndex + 1,
//         'Step Title': stepData.title
//     });
// });
```

**3. `cue.onComplete(callback)`**

* **Purpose:** To track successful tour completion. This is a key success metric.
* **When it fires:** When the user navigates through all steps and clicks the "Done" button on the final step.

```javascript
// Example with Google Analytics 4 (gtag.js)
cue.onComplete(() => {
    console.log('Analytics: Tour completed!');
    gtag('event', 'tour_completed', {
        'tour_name': 'onboarding_guide',
        'completed_successfully': true
    });
});

// Example with Mixpanel
// cue.onComplete(() => {
//     console.log('Mixpanel: Tour completed!');
//     mixpanel.track('Tour Completed', {
//         'Tour Name': 'Onboarding Guide',
//         'Status': 'Success'
//     });
// });
```

**4. `cue.onExit(callback)`**

* **Purpose:** To track when a user abandons or skips a tour. This helps identify friction points.
* **When it fires:** When the tour is stopped prematurely (e.g., user clicks 'Skip', presses Esc, clicks overlay, or `cue.exit()` is called programmatically).

```javascript
// Example with Google Analytics 4 (gtag.js)
cue.onExit((currentStepIndex) => {
    console.log(`Analytics: Tour abandoned at step ${currentStepIndex + 1}.`);
    gtag('event', 'tour_abandoned', {
        'tour_name': 'onboarding_guide',
        'last_step_index': currentStepIndex + 1,
        'reason': 'skipped_or_exited' // You might infer more specific reasons if possible
    });
});

// Example with Mixpanel
// cue.onExit((currentStepIndex) => {
//     console.log(`Mixpanel: Tour abandoned!`);
//     mixpanel.track('Tour Abandoned', {
//         'Tour Name': 'Onboarding Guide',
//         'Last Step Index': currentStepIndex + 1
//     });
// });
```

***

### General Analytics Implementation Tips

* **Consistency is Key:** Use consistent event names and property structures across all your analytics implementations.
* **Contextual Data:** Always include relevant contextual data with your events (e.g., `tour_name`, `step_index`, `user_id` if available).
* **Platform Specifics:** Adapt the examples to the exact API and data model of your chosen analytics platform.
* **Privacy:** Be mindful of user privacy regulations (e.g., GDPR, CCPA). Only collect necessary data and respect user consent settings.
* **Testing:** Thoroughly test your analytics implementation by observing events in your analytics platform's debug view or real-time reports.

***

### Next Steps

By leveraging these event hooks, you can gain deep insights into your users' tour experiences.

# Conditional Tours

Modern web applications often cater to diverse user groups, roles, or states. A "one-size-fits-all" tour might not be relevant or effective for everyone. Cue.js allows you to create **conditional tours** that adapt dynamically, providing a more personalized and effective onboarding or feature discovery experience.

***

### Why Use Conditional Tours?

* **Personalization:** Show different features to administrators vs. regular users.
* **Onboarding:** Provide a specific tour for new users, and a "what's new" tour for returning users.
* **A/B Testing:** Test different tour flows to see which performs better.
* **Feature Flags:** Guide users through features that are only enabled for certain users or in certain environments.
* **Progress-Based:** Only show a tour or step if a user has completed a prerequisite task.

***

### Methods for Implementing Conditional Logic

There are two primary strategies for building conditional tours in Cue.js:

#### 1. Dynamically Defining Tour Steps (Recommended)

This is the most common and robust approach. You build different `tourSteps` arrays based on your application's conditions _before_ you call `cue.start()`.

* **How it works:** Your JavaScript logic evaluates user data, feature flags, or application state. Based on these conditions, it constructs a specific `tourSteps` array and then passes that array to `cue.setSteps()`.
* **Advantages:**
  * **Clean:** The tour only contains steps relevant to the current user from the beginning.
  * **Efficient:** Cue.js doesn't need to process or try to find elements for irrelevant steps.
  * **Clear Logic:** The branching logic for your tours is explicit in your code.

**Example: Tour for New vs. Returning Users**

Imagine you want to show a longer onboarding tour for first-time users, but a shorter "new features" tour for existing users.

```javascript
// Assume `isNewUser` is determined by your backend or local storage
const isNewUser = localStorage.getItem('hasVisitedBefore') === null;

let tourSteps = [];

if (isNewUser) {
    console.log('User is new, showing full onboarding tour.');
    tourSteps = [
        {
            target: '#main-logo',
            title: 'Welcome to Our App!',
            content: 'Let\'s get you acquainted with the basics.',
            position: 'bottom'
        },
        {
            target: '#dashboard-summary',
            title: 'Your Dashboard Overview',
            content: 'See your key metrics at a glance.',
            position: 'right'
        },
        {
            target: '#profile-settings',
            title: 'Setup Your Profile',
            content: 'Complete your profile for a personalized experience.',
            position: 'left'
        },
        // ... more onboarding steps ...
    ];
} else {
    console.log('User is returning, showing new features tour.');
    tourSteps = [
        {
            target: '#new-analytics-tab',
            title: 'New: Advanced Analytics!',
            content: 'We\'ve just launched powerful new reporting tools.',
            position: 'bottom'
        },
        {
            target: '#recent-activity-feed',
            title: 'Improved Activity Feed',
            content: 'Now with real-time updates and better filtering.',
            position: 'top'
        }
    ];
}

const cue = new Cue();
cue.setSteps(tourSteps);

document.getElementById('start-tour-button').addEventListener('click', () => {
    cue.start();
});

// Mark user as returning after their first visit
if (isNewUser) {
    cue.onComplete(() => {
        localStorage.setItem('hasVisitedBefore', 'true');
    });
}
```

***

#### 2. Conditionally Skipping Steps (Runtime Logic)

While dynamically defining `tourSteps` is generally preferred, you might sometimes need to conditionally skip individual steps based on very specific runtime conditions that are evaluated _just before_ that step would appear.

* **How it works:** You use the `preStep` callback (which runs _before_ a step is displayed) to check a condition. If the condition is not met, you programmatically advance the tour to the next step using `cue.nextStep()`, effectively skipping the current one.
* **Advantages:** Useful for complex scenarios where you can't easily pre-filter the `tourSteps` array, or when a step's relevance depends on a user's action or data that might only be ready very late.
* **Consideration:** This can make your tour logic slightly more complex to follow, as the `tourSteps` array might appear to have more steps than are actually shown.

**Example: Skip a Step if a Prerequisite is Not Met**

Suppose a step highlights a "Pro Features" button, but only if the user has completed a specific "onboarding task".

```javascript
// Assume this function checks if the user has completed a task
function hasCompletedOnboardingTask() {
    // Replace with actual logic, e.g., checking user state, API response, etc.
    return localStorage.getItem('onboardingTaskDone') === 'true';
}

const cue = new Cue();

cue.setSteps([
    {
        target: '#intro-message',
        title: 'Welcome!',
        content: 'Let\'s start the tour.',
        position: 'center'
    },
    {
        target: '#pro-features-button',
        title: 'Explore Pro Features',
        content: 'Unlock advanced capabilities with a Pro account.',
        position: 'bottom',
        // --- Conditionally skip this step using preStep ---
        preStep: (stepData) => {
            if (!hasCompletedOnboardingTask()) {
                console.log(`Skipping step '${stepData.title}': Onboarding task not completed.`);
                // If condition not met, immediately go to the next step
                cue.nextStep(); // This skips the current step
                return; // Stop further preStep execution for this instance
            }
            console.log(`PreStep: Showing '${stepData.title}' as prerequisite is met.`);
        }
    },
    {
        target: '#regular-settings',
        title: 'General Settings',
        content: 'Manage your basic preferences.',
        position: 'right'
    }
]);

document.getElementById('start-tour-button').addEventListener('click', () => {
    // For demo: Toggle the prerequisite status
    const isDone = hasCompletedOnboardingTask();
    localStorage.setItem('onboardingTaskDone', isDone ? 'false' : 'true');
    alert(`Onboarding task status toggled to: ${!isDone}`);
    cue.start();
});
```

**Implicit Skipping with `onTargetNotFound`**

Recall that if a `target` element cannot be found, the `onTargetNotFound` callback can be used to either `'skip'` the step or `'stop'` the tour. This serves as another form of conditional skipping, specifically for situations where the element's presence determines the tour flow.

***

### Important Considerations

* **User Experience:** Ensure conditional tours don't feel disjointed. Users should not feel like parts of the tour are missing randomly. Provide clear messaging if a step is skipped.
* **Testing:** Thoroughly test all possible conditions and tour paths.
* **Analytics:** Use the [Tour Lifecycle Events](https://www.google.com/search?q=tour-lifecycle-events.md) to track which tour version a user experienced or which steps were skipped. This data is invaluable for optimizing your tours.

***

### Next Steps

With the ability to create dynamic and conditional tours, you can now personalize the user experience.

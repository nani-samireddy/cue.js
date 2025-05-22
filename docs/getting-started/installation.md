---
description: >-
  Get started with Cue.js. Learn how to install the lightweight JavaScript tour
  library via npm, Yarn, or CDN for quick integration into your web project
---

# Installation

<figure><img src="../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

Getting started with Cue.js is quick and easy. You can integrate it into your project using popular package managers like npm or Yarn, or you can simply include it directly via a Content Delivery Network (CDN).

***

### Choose Your Installation Method

#### npm

If you're using Node.js and a package manager like npm, run the following command in your project's terminal:

```bash
npm install @nani_samireddy/cue.js
```

This will add `cue.js` as a dependency in your `package.json` file.

Once installed, you can import Cue.js into your JavaScript modules:

```javascript
// For ES Modules (used with bundlers like Webpack, Vite, Parcel)
import Cue from '@nani_samireddy/cue.js';

// Don't forget to import the CSS as well!
// The exact path might vary slightly based on your bundler's configuration.
import '@nani_samireddy/cue.js/dist/cue.min.css'; // Or cue.css for development
```

#### Yarn

If you prefer Yarn as your package manager, use this command in your project's terminal:

```bash
yarn add @nani_samireddy/cue.js
```

This will add `cue.js` as a dependency in your `package.json` file.

After installation, you can import Cue.js into your JavaScript modules:

```javascript
// For ES Modules (used with bundlers like Webpack, Vite, Parcel)
import Cue from '@nani_samireddy/cue.js';

// Don't forget to import the CSS as well!
// The exact path might vary slightly based on your bundler's configuration.
import '@nani_samireddy/cue.js/dist/cue.min.css'; // Or cue.css for development
```

#### CDN

For the quickest setup, you can include Cue.js directly in your HTML using CDN links. This is ideal for simple projects or prototyping, as it doesn't require any build tools.

Place these lines in the `<head>` section of your HTML file:

**Minified Version (Recommended for Production):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@<VERSION>/dist/cue.min.css">
<script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@<VERSION>/dist/cue.min.js"></script>
```

**Unminified Version (For Development/Debugging):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.css">
<script src="https://cdn.jsdelivr.net/npm/@nani_samireddy/cue.js@latest/dist/cue.umd.js"></script>
```

When using the CDN version, the `Cue` class will be globally available via `window.Cue`.

```javascript
// Accessing the global Cue object
const cue = new Cue({ /* options */ });
// ...
```

***

### Next Steps

Once installed, you're ready to create your first tour!


# Contributing to Cue.js

Thank you for considering contributing to Cue.js! We appreciate your help in making this library even better.

Please take a moment to review this document to understand our contribution guidelines.

## 💡 How Can I Contribute?

There are many ways to contribute, not just by writing code:

* **Reporting Bugs:** If you find a bug, please open an issue on GitHub.
* **Suggesting Features:** Have an idea for a new feature? Open an issue to discuss it.
* **Improving Documentation:** Spotted a typo, or something unclear in the `README.md` or other docs? Pull requests are welcome!
* **Writing Code:** Fix bugs, implement new features, improve performance.
* **Testing:** Help us identify issues and ensure stability.
* **Community Support:** Answer questions, share knowledge.

## 🐛 Reporting Bugs

When reporting a bug, please include:

1.  A clear and concise description of the bug.
2.  Steps to reproduce the behavior.
3.  Expected behavior.
4.  Actual behavior.
5.  Screenshots or GIFs if applicable.
6.  Your environment (Browser, OS, Cue.js version).

**Please create a new issue on GitHub for each bug report.**

## ✨ Suggesting Features

When suggesting a new feature, please include:

1.  A clear and concise description of the proposed feature.
2.  The problem it solves or the use case it addresses.
3.  Any examples or mockups that help illustrate the idea.

**Please create a new issue on GitHub for feature requests.**

## 💻 Code Contributions

### Setup Development Environment

1.  **Fork** the Cue.js repository on GitHub.
2.  **Clone** your forked repository to your local machine:
    ```bash
    git clone [https://github.com/nani-samireddy/cue.js.git](https://github.com/nani-samireddy/cue.js.git)
    cd cue.js
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a new branch** for your changes:
    ```bash
    git checkout -b feature/my-new-feature-name
    # or
    git checkout -b bugfix/fix-issue-number
    ```

### Making Changes

* Make your changes in the `src/` directory.
* Ensure your code adheres to the existing coding style.
* Run `npm run build` to compile your changes into the `dist/` folder.
* Test your changes thoroughly. You can open `index.html` locally to test (remember to link `dist/cue.umd.js` and `dist/cue.css`).

### Submitting a Pull Request (PR)

1.  **Commit your changes** with a clear and concise commit message.
    * Good commit message examples:
        * `feat: Add new 'center' tooltip position`
        * `fix(tooltip): Correct arrow positioning in IE11`
        * `docs: Update usage examples in README`
    * Use conventional commits if possible (e.g., `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `build:`).
2.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/my-new-feature-name
    ```
3.  **Open a Pull Request** on the original Cue.js repository.
    * Provide a clear title and description of your changes.
    * Reference any related issues (e.g., "Closes #123").
    * Ensure all checks (if any automated CI/CD is set up) pass.

## 📝 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

Thank you for your contributions!

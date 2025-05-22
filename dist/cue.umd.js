(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Cue = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var cue$1 = {};

	var hasRequiredCue;

	function requireCue () {
		if (hasRequiredCue) return cue$1;
		hasRequiredCue = 1;
		// cue.js

		(function () {
		    class Cue { // Renamed from IntroJS
		        constructor(options = {}) {
		            this.options = {
		                overlay: true,
		                overlayClickExits: true,
		                showProgress: false,
		                showBullets: false,
		                showButtons: true,
		                keyboardNavigation: true,
		                nextLabel: 'Next',
		                prevLabel: 'Back',
		                skipLabel: 'Skip',
		                doneLabel: 'Done',
		                scrollToElement: true,
		                exitOnEsc: true,
		                exitOnOverlayClick: true,
		                debug: false,
		                tooltipPosition: 'auto', // Default global position
		                padding: 10,
		                buttonClass: '',
		                highlightClass: '',
		                tooltipClass: '',
		                transitionDuration: 300, // in ms, ensure this matches CSS for smooth transitions
		                ...options
		            };

		            this.steps = [];
		            this.currentStepIndex = -1;
		            this.isTourActive = false;

		            this.elements = {
		                overlay: null,
		                highlight: null,
		                tooltip: null
		            };

		            this.callbacks = {
		                onStart: [],
		                onBeforeChange: [],
		                onChange: [],
		                onAfterChange: [],
		                onExit: [],
		                onComplete: [],
		                onResize: []
		            };

		            this._eventHandlers = {}; // Store references for proper removal

		            this._setupEventListeners();
		        }

		        // --- Public API Methods ---

		        /**
		         * Sets the steps for the tour.
		         * @param {Array<object>} steps - An array of step objects.
		         * @returns {Cue} The Cue instance for chaining.
		         */
		        setSteps(steps) {
		            // Filter out steps without a target, and ensure targets are processed
		            this.steps = steps.filter(step => step.target).map(step => ({
		                ...step,
		                // Pre-resolve target element if it's a string, for performance/simplicity
		                _targetElement: typeof step.target === 'string' ? document.querySelector(step.target) : step.target
		            }));
		            return this; // For chaining
		        }

		        /**
		         * Starts the tour.
		         * @param {number} [initialStepIndex=0] - The 0-based index of the step to start from.
		         */
		        start(initialStepIndex = 0) {
		            if (this.isTourActive) {
		                this._log('Tour already active, exiting current and restarting.');
		                this.exit(); // If a tour is already running, exit it cleanly before starting a new one.
		            }

		            if (!this.steps || this.steps.length === 0) {
		                console.warn('Cue.js: No steps defined. Call setSteps() first.');
		                return;
		            }

		            this.isTourActive = true;
		            this.currentStepIndex = initialStepIndex;

		            this._triggerCallbacks('onStart');
		            this._showStep(this.currentStepIndex);
		        }

		        /**
		         * Navigates to a specific step by its index.
		         * @param {number} index - The 0-based index of the step to navigate to.
		         */
		        goToStep(index) {
		            if (!this.isTourActive) {
		                this._log('Tour not active. Call start() first.');
		                return;
		            }
		            if (index < 0 || index >= this.steps.length) {
		                console.warn(`Cue.js: Step index ${index} is out of bounds.`);
		                return;
		            }
		            this._showStep(index);
		        }

		        /**
		         * Advances to the next step in the tour. If it's the last step, the tour completes.
		         */
		        nextStep() {
		            if (this.currentStepIndex < this.steps.length - 1) {
		                this._showStep(this.currentStepIndex + 1);
		            } else {
		                // Reached the last step and clicked next/done
		                this.exit();
		                this._triggerCallbacks('onComplete');
		            }
		        }

		        /**
		         * Goes back to the previous step in the tour.
		         */
		        prevStep() {
		            if (this.currentStepIndex > 0) {
		                this._showStep(this.currentStepIndex - 1);
		            }
		        }

		        /**
		         * Stops the tour and cleans up all elements.
		         */
		        exit() {
		            if (!this.isTourActive) return;

		            this.isTourActive = false;
		            // When exiting, `oldStepIndex` in `_cleanupElements` will correctly refer to the last active step
		            // because `currentStepIndex` is still set to the last step at this point.
		            this._cleanupElements(false, this.currentStepIndex);
		            this._triggerCallbacks('onExit', this.currentStepIndex);
		            this.currentStepIndex = -1; // Reset index after callbacks
		            this._log('Tour exited.');
		        }

		        /**
		         * Recalculates the position of the current step's highlight and tooltip.
		         * Useful if the page layout changes dynamically.
		         */
		        refresh() {
		            if (this.isTourActive && this.currentStepIndex !== -1) {
		                this._positionElements();
		            }
		        }

		        // --- Event Listener Registration Methods ---
		        onStart(callback) { this.callbacks.onStart.push(callback); return this; }
		        onBeforeChange(callback) { this.callbacks.onBeforeChange.push(callback); return this; }
		        onChange(callback) { this.callbacks.onChange.push(callback); return this; }
		        onAfterChange(callback) { this.callbacks.onAfterChange.push(callback); return this; }
		        onExit(callback) { this.callbacks.onExit.push(callback); return this; }
		        onComplete(callback) { this.callbacks.onComplete.push(callback); return this; }
		        onResize(callback) { this.callbacks.onResize.push(callback); return this; }

		        /**
		         * Returns the data object of the current step.
		         * @returns {object|null}
		         */
		        getCurrentStep() {
		            return this.steps[this.currentStepIndex] || null;
		        }

		        /**
		         * Returns the 0-based index of the current step.
		         * @returns {number}
		         */
		        getCurrentStepIndex() {
		            return this.currentStepIndex;
		        }

		        // --- Internal Helper Methods ---

		        _log(...args) {
		            if (this.options.debug) {
		                console.log('%cCue.js:', 'color: #7B68EE; font-weight: bold;', ...args);
		            }
		        }

		        _getStepOptions(stepIndex) {
		            const step = this.steps[stepIndex];
		            if (!step) return null;
		            return {
		                target: step.target, // Original target selector/element
		                _targetElement: step._targetElement, // Pre-resolved DOM element
		                title: step.title || '',
		                content: step.content || '',
		                position: step.position || this.options.tooltipPosition,
		                highlightClass: step.highlightClass || this.options.highlightClass,
		                tooltipClass: step.tooltipClass || this.options.tooltipClass,
		                padding: typeof step.padding === 'number' ? step.padding : this.options.padding,
		                scrollToElement: typeof step.scrollToElement === 'boolean' ? step.scrollToElement : this.options.scrollToElement,
		                disableInteraction: typeof step.disableInteraction === 'boolean' ? step.disableInteraction : false,
		                showButtons: typeof step.showButtons === 'boolean' ? step.showButtons : this.options.showButtons,
		                // Add any other step-specific options here that were part of the step object
		                ...step // Include all other properties from the original step object
		            };
		        }

		        async _showStep(index) {
		            const oldStepIndexForCleanup = this.currentStepIndex; // Capture current step index *before* updating
		            const stepOptions = this._getStepOptions(index);
		            if (!stepOptions) {
		                this.exit();
		                return;
		            }

		            // Always try to re-query the target element if it's a string, as DOM might change
		            const targetElement = typeof stepOptions.target === 'string'
		                ? document.querySelector(stepOptions.target)
		                : stepOptions._targetElement; // Use pre-resolved if not a string

		            if (!targetElement) {
		                console.warn(`Cue.js: Target element "${stepOptions.target}" not found for step ${index}.`);
		                if (typeof stepOptions.onTargetNotFound === 'function') {
		                    const action = await Promise.resolve(stepOptions.onTargetNotFound(stepOptions));
		                    if (action === 'skip') {
		                        this._log(`Skipping step ${index} due to target not found.`);
		                        this.nextStep(); // Try next step
		                        return;
		                    } else if (action === 'stop') {
		                        this._log(`Stopping tour due to target not found for step ${index}.`);
		                        this.exit();
		                        return;
		                    }
		                }
		                this.exit(); // Default behavior if target not found and no handler or handler didn't return 'skip'/'stop'
		                return;
		            }

		            // Call preStep if defined and is a function
		            if (typeof stepOptions.preStep === 'function') {
		                await Promise.resolve(stepOptions.preStep(stepOptions));
		            }

		            this._triggerCallbacks('onBeforeChange', stepOptions, index);
		            this.currentStepIndex = index; // Update current step index

		            // Cleanup old elements while allowing them to fade out, if applicable
		            this._cleanupElements(true, oldStepIndexForCleanup); // Pass true for stepping and the old index for cleanup

		            // Create and position elements for the new step
		            this._createElements(targetElement, stepOptions);
		            this._positionElements();

		            // Add the 'active' class to trigger CSS transitions and make them visible
		            // This is done after positioning to avoid flickering during initial render
		            if (this.elements.overlay) this.elements.overlay.classList.add('active');
		            if (this.elements.highlight) this.elements.highlight.classList.add('active');
		            if (this.elements.tooltip) this.elements.tooltip.classList.add('active');


		            // Handle interaction disabling for the CURRENT target element
		            if (stepOptions.disableInteraction) {
		                // When interaction is disabled for the target, the highlight should also
		                // not allow events to pass through to the element it covers.
		                // However, the overlay still needs to allow clicks to exit if overlayClickExits is true.
		                if (this.elements.highlight) {
		                     this.elements.highlight.style.pointerEvents = 'none'; // Highlight itself is not interactive
		                }
		                targetElement.style.pointerEvents = 'none'; // Disable interaction on the actual target
		            } else {
		                // When interaction is enabled for the target, the highlight should also allow events to pass through
		                if (this.elements.highlight) {
		                    this.elements.highlight.style.pointerEvents = 'none'; // Allows clicks to pass through highlight to target
		                }
		                targetElement.style.removeProperty('pointer-events'); // Ensure target is re-enabled
		            }

		            if (stepOptions.scrollToElement) {
		                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		            }

		            this._triggerCallbacks('onChange', stepOptions, index);
		            // Use a slight delay for onAfterChange if CSS transitions are used
		            setTimeout(() => {
		                this._triggerCallbacks('onAfterChange', stepOptions, index);
		            }, this.options.transitionDuration);
		        }

		        _createElements(targetElement, stepOptions) {
		            const body = document.body;

		            // Overlay
		            if (this.options.overlay) {
		                this.elements.overlay = document.createElement('div');
		                this.elements.overlay.className = 'cue-overlay'; // Updated class name
		                if (this.options.overlayClickExits) {
		                    this._eventHandlers.overlayClick = () => this.exit();
		                    this.elements.overlay.addEventListener('click', this._eventHandlers.overlayClick);
		                }
		                body.appendChild(this.elements.overlay);
		            }

		            // Highlight
		            this.elements.highlight = document.createElement('div');
		            this.elements.highlight.className = 'cue-highlight'; // Updated class name
		            if (stepOptions.highlightClass) {
		                this.elements.highlight.classList.add(stepOptions.highlightClass);
		            }
		            body.appendChild(this.elements.highlight);

		            // Tooltip
		            this.elements.tooltip = document.createElement('div');
		            this.elements.tooltip.className = 'cue-tooltip'; // Updated class name
		            if (stepOptions.tooltipClass) {
		                this.elements.tooltip.classList.add(stepOptions.tooltipClass);
		            }

		            const title = stepOptions.title ? `<div class="cue-tooltip-title">${stepOptions.title}</div>` : '';
		            const content = stepOptions.content ? `<div class="cue-tooltip-content">${stepOptions.content}</div>` : '';

		            let progress = '';
		            if (this.options.showProgress && this.steps.length > 1) {
		                progress = `<div class="cue-progress">Step ${this.currentStepIndex + 1} of ${this.steps.length}</div>`;
		            }

		            let bullets = '';
		            if (this.options.showBullets && this.steps.length > 1) {
		                bullets = '<div class="cue-bullets">';
		                for (let i = 0; i < this.steps.length; i++) {
		                    bullets += `<span class="cue-bullet ${i === this.currentStepIndex ? 'active' : ''}" data-step-index="${i}"></span>`;
		                }
		                bullets += '</div>';
		            }

		            let buttons = '';
		            if (stepOptions.showButtons) {
		                const isFirst = this.currentStepIndex === 0;
		                const isLast = this.currentStepIndex === this.steps.length - 1;
		                const buttonClass = this.options.buttonClass ? ` ${this.options.buttonClass}` : '';

		                buttons = `
                    <div class="cue-buttons">
                        ${this.options.skipLabel ? `<button class="cue-button cue-skip${buttonClass}"><span>${this.options.skipLabel}</span></button>` : ''}
                        ${!isFirst && this.options.prevLabel ? `<button class="cue-button cue-prev${buttonClass}"><span>${this.options.prevLabel}</span></button>` : ''}
                        ${!isLast && this.options.nextLabel ? `<button class="cue-button cue-next${buttonClass}"><span>${this.options.nextLabel}</span></button>` : ''}
                        ${isLast && this.options.doneLabel ? `<button class="cue-button cue-done${buttonClass}"><span>${this.options.doneLabel}</span></button>` : ''}
                    </div>
                `;
		            }

		            this.elements.tooltip.innerHTML = `
                ${title}
                ${content}
                ${progress}
                ${bullets}
                ${buttons}
            `;
		            body.appendChild(this.elements.tooltip);

		            // Add event listeners for buttons within the tooltip
		            if (stepOptions.showButtons) {
		                const skipButton = this.elements.tooltip.querySelector('.cue-skip');
		                if (skipButton) {
		                    this._eventHandlers.skipClick = () => this.exit();
		                    skipButton.addEventListener('click', this._eventHandlers.skipClick);
		                }
		                const prevButton = this.elements.tooltip.querySelector('.cue-prev');
		                if (prevButton) {
		                    this._eventHandlers.prevClick = () => this.prevStep();
		                    prevButton.addEventListener('click', this._eventHandlers.prevClick);
		                }
		                const nextButton = this.elements.tooltip.querySelector('.cue-next');
		                if (nextButton) {
		                    this._eventHandlers.nextClick = () => this.nextStep();
		                    nextButton.addEventListener('click', this._eventHandlers.nextClick);
		                }
		                const doneButton = this.elements.tooltip.querySelector('.cue-done');
		                if (doneButton) {
		                    this._eventHandlers.doneClick = () => {
		                        this.exit();
		                        this._triggerCallbacks('onComplete');
		                    };
		                    doneButton.addEventListener('click', this._eventHandlers.doneClick);
		                }
		            }

		            if (this.options.showBullets) {
		                const bulletContainer = this.elements.tooltip.querySelector('.cue-bullets');
		                if (bulletContainer) {
		                    this._eventHandlers.bulletClick = (e) => {
		                        const target = e.target.closest('.cue-bullet');
		                        if (target) {
		                            const index = parseInt(target.dataset.stepIndex);
		                            if (!isNaN(index) && index !== this.currentStepIndex) {
		                                this.goToStep(index);
		                            }
		                        }
		                    };
		                    bulletContainer.addEventListener('click', this._eventHandlers.bulletClick);
		                }
		            }
		        }

		        _positionElements() {
		            if (!this.elements.highlight || !this.elements.tooltip) return;

		            const currentStep = this.steps[this.currentStepIndex];
		            // Get the element again, in case it changed or was added dynamically
		            const targetElement = typeof currentStep.target === 'string'
		                ? document.querySelector(currentStep.target)
		                : currentStep._targetElement;

		            if (!targetElement) {
		                this.exit(); // This should ideally be caught earlier, but as a fallback
		                return;
		            }

		            const targetRect = targetElement.getBoundingClientRect();
		            const padding = typeof currentStep.padding === 'number' ? currentStep.padding : this.options.padding;
		            const tooltipPosition = currentStep.position || this.options.tooltipPosition;

		            // Position Highlight
		            this.elements.highlight.style.width = `${targetRect.width + 2 * padding}px`;
		            this.elements.highlight.style.height = `${targetRect.height + 2 * padding}px`;
		            this.elements.highlight.style.top = `${targetRect.top + window.scrollY - padding}px`;
		            this.elements.highlight.style.left = `${targetRect.left + window.scrollX - padding}px`;

		            // Position Tooltip
		            // Reset tooltip position styles to get accurate initial size before calculating
		            this.elements.tooltip.style.top = '';
		            this.elements.tooltip.style.left = '';

		            const tooltipRect = this.elements.tooltip.getBoundingClientRect();

		            const viewportWidth = window.innerWidth;
		            const viewportHeight = window.innerHeight;

		            const calculatePosition = (pos) => {
		                let top, left;
		                const gap = 20; // Gap between target and tooltip

		                switch (pos) {
		                    case 'top':
		                        top = targetRect.top - tooltipRect.height - gap;
		                        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
		                        break;
		                    case 'bottom':
		                        top = targetRect.bottom + gap;
		                        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
		                        break;
		                    case 'left':
		                        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
		                        left = targetRect.left - tooltipRect.width - gap;
		                        break;
		                    case 'right':
		                        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
		                        left = targetRect.right + gap;
		                        break;
		                    case 'center': // Center relative to viewport
		                        top = viewportHeight / 2 - tooltipRect.height / 2;
		                        left = viewportWidth / 2 - tooltipRect.width / 2;
		                        break;
		                    case 'auto': // Attempt to find best position
		                    default:
		                        // Try bottom first
		                        top = targetRect.bottom + gap;
		                        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

		                        // If it goes off screen bottom, try top
		                        if (top + tooltipRect.height > viewportHeight && targetRect.top - tooltipRect.height - gap > 0) {
		                            top = targetRect.top - tooltipRect.height - gap;
		                        }

		                        // If horizontally out of bounds, try to center horizontally (viewport-relative)
		                        if (left < 0 || left + tooltipRect.width > viewportWidth) {
		                             left = Math.max(10, (viewportWidth / 2) - (tooltipRect.width / 2)); // 10px margin from edge
		                        }

		                        // If top/bottom still out of bounds, try right
		                        if ((top < 0 || top + tooltipRect.height > viewportHeight) && targetRect.right + gap + tooltipRect.width < viewportWidth) {
		                            top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
		                            left = targetRect.right + gap;
		                        }
		                        // If right out of bounds, try left
		                        else if ((top < 0 || top + tooltipRect.height > viewportHeight) && targetRect.left - tooltipRect.width - gap > 0) {
		                            top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
		                            left = targetRect.left - tooltipRect.width - gap;
		                        }
		                        break;
		                }

		                // Final adjustments to keep tooltip within viewport margins
		                const margin = 10;
		                if (left + tooltipRect.width > viewportWidth - margin) {
		                    left = viewportWidth - tooltipRect.width - margin;
		                }
		                if (left < margin) {
		                    left = margin;
		                }
		                if (top + tooltipRect.height > viewportHeight - margin) {
		                    top = viewportHeight - tooltipRect.height - margin;
		                }
		                if (top < margin) {
		                    top = margin;
		                }

		                return { top, left };
		            };

		            const { top, left } = calculatePosition(tooltipPosition);

		            // Apply calculated position, adding scroll position for absolute placement
		            this.elements.tooltip.style.top = `${top + window.scrollY}px`;
		            this.elements.tooltip.style.left = `${left + window.scrollX}px`;
		        }

		        /**
		         * Removes and cleans up all tour elements from the DOM.
		         * @param {boolean} isStepping - True if cleaning up for a step change (implies re-creation soon), false for full exit.
		         * @param {number} [prevStepIndex] - The index of the step that was just active (used for re-enabling pointer-events).
		         */
		        _cleanupElements(isStepping = false, prevStepIndex = -1) {
		            // Step 1: Remove 'active' class to trigger CSS fade-out transition
		            if (this.elements.overlay) this.elements.overlay.classList.remove('active');
		            if (this.elements.highlight) this.elements.highlight.classList.remove('active');
		            if (this.elements.tooltip) this.elements.tooltip.classList.remove('active');

		            // Step 2: Remove event listeners from elements being removed
		            // This is crucial to prevent memory leaks!
		            if (this.elements.overlay && this._eventHandlers.overlayClick) {
		                this.elements.overlay.removeEventListener('click', this._eventHandlers.overlayClick);
		            }
		            if (this.elements.tooltip) {
		                // Check for each button and bullet container, then remove their specific listeners
		                const skipButton = this.elements.tooltip.querySelector('.cue-skip');
		                if (skipButton && this._eventHandlers.skipClick) skipButton.removeEventListener('click', this._eventHandlers.skipClick);
		                const prevButton = this.elements.tooltip.querySelector('.cue-prev');
		                if (prevButton && this._eventHandlers.prevClick) prevButton.removeEventListener('click', this._eventHandlers.prevClick);
		                const nextButton = this.elements.tooltip.querySelector('.cue-next');
		                if (nextButton && this._eventHandlers.nextClick) nextButton.removeEventListener('click', this._eventHandlers.nextClick);
		                const doneButton = this.elements.tooltip.querySelector('.cue-done');
		                if (doneButton && this._eventHandlers.doneClick) doneButton.removeEventListener('click', this._eventHandlers.doneClick);
		                const bulletContainer = this.elements.tooltip.querySelector('.cue-bullets');
		                if (bulletContainer && this._eventHandlers.bulletClick) bulletContainer.removeEventListener('click', this._eventHandlers.bulletClick);
		            }
		            // Reset these specific event handlers as they are tied to the current tooltip
		            this._eventHandlers.skipClick = null;
		            this._eventHandlers.prevClick = null;
		            this._eventHandlers.nextClick = null;
		            this._eventHandlers.doneClick = null;
		            this._eventHandlers.bulletClick = null;


		            // Step 3: Remove DOM elements after allowing transition to complete
		            // The `removeDelay` ensures elements fade out smoothly before being removed.
		            const removeDelay = isStepping ? this.options.transitionDuration : 0;

		            // Use a shallow copy of elements to remove, as this.elements will be nullified immediately
		            const elementsToReallyRemove = { ...this.elements };

		            setTimeout(() => {
		                Object.values(elementsToReallyRemove).forEach(el => {
		                    if (el && el.parentNode) {
		                        el.parentNode.removeChild(el);
		                    }
		                });
		            }, removeDelay);

		            // Reset elements references immediately so _createElements knows to make new ones
		            this.elements = { overlay: null, highlight: null, tooltip: null };

		            // Step 4: Re-enable pointer events on the target element of the *previous* step,
		            // if it had them disabled.
		            if (prevStepIndex !== -1) { // Only if there was a previous step
		                const lastStepOptions = this._getStepOptions(prevStepIndex);
		                if (lastStepOptions && lastStepOptions.disableInteraction) {
		                    const lastTargetElement = typeof lastStepOptions.target === 'string'
		                        ? document.querySelector(lastStepOptions.target)
		                        : lastStepOptions._targetElement;
		                    if (lastTargetElement) {
		                        lastTargetElement.style.removeProperty('pointer-events');
		                    }
		                }
		            }
		        }

		        _setupEventListeners() {
		            // Global keyboard navigation listener
		            this._eventHandlers.keydown = (e) => this._handleKeydown(e);
		            document.addEventListener('keydown', this._eventHandlers.keydown);

		            // Global window resize listener to refresh element positions
		            this._eventHandlers.resize = () => {
		                this.refresh();
		                this._triggerCallbacks('onResize');
		            };
		            window.addEventListener('resize', this._eventHandlers.resize);
		        }

		        _handleKeydown(e) {
		            if (!this.isTourActive) return;

		            if (this.options.exitOnEsc && e.key === 'Escape') {
		                e.preventDefault(); // Prevent default browser behavior (e.g., closing a dialog)
		                this.exit();
		            } else if (this.options.keyboardNavigation) {
		                if (e.key === 'ArrowRight' || e.key === ' ') { // Spacebar also advances
		                    e.preventDefault();
		                    this.nextStep();
		                } else if (e.key === 'ArrowLeft') {
		                    e.preventDefault();
		                    this.prevStep();
		                }
		            }
		        }

		        /**
		         * Triggers all registered callbacks for a given event type.
		         * @param {string} eventType - The name of the event (e.g., 'onStart', 'onChange').
		         * @param {...any} args - Arguments to pass to the callbacks.
		         */
		        _triggerCallbacks(eventType, ...args) {
		            this.callbacks[eventType].forEach(callback => {
		                try {
		                    callback(...args);
		                } catch (error) {
		                    console.error(`Cue.js: Error in '${eventType}' callback:`, error);
		                }
		            });
		        }
		    }

		    // Expose to global scope for direct inclusion in HTML
		    if (typeof window !== 'undefined') {
		        window.Cue = Cue; // Exposed as window.Cue
		    }

		    // If using modules, you would typically export it like this:
		    // export default Cue;

		})();
		return cue$1;
	}

	var cueExports = requireCue();
	var cue = /*@__PURE__*/getDefaultExportFromCjs(cueExports);

	return cue;

}));
//# sourceMappingURL=cue.umd.js.map

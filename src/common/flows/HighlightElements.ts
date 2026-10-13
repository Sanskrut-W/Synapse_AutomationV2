import type { Locator } from '@playwright/test';

/**
 * Screenshot decoration only — a red border so a reviewer can see what a test acted on.
 *
 * Two deliberate properties, both learned the hard way (confirmed live on ZM, 2026-10-12):
 *
 *  - BOUNDED. `locator.evaluate()` has no timeout of its own, so it inherits the action/test
 *    budget. Pointed at an element that never appears it simply waits, and the test dies with a
 *    bare "Test timeout of 90000ms exceeded" naming locator.evaluate — the real assertion never
 *    runs, so the report says nothing about what was actually wrong. Four ZM tests failed exactly
 *    that way (buildABet T4/T5, header 24, hamburgerMenu 35), each burning the full 90s.
 *
 *  - NON-FATAL. Highlighting is not a test step. If the element is missing, that is for the
 *    following assertion to report, in its own words, with its own locator in the message.
 *    Throwing from here would just replace a good error with a worse one.
 *
 * Net effect: a missing element now costs ~2s and still fails at the real assertion, instead of
 * swallowing the test timeout. Note this also removes an accidental implicit wait — anything that
 * was quietly relying on highlight to stall for a slow element will now need its own explicit wait.
 */
const HIGHLIGHT_TIMEOUT_MS = 2000;

async function decorate(locator: Locator | null, apply: (el: HTMLElement) => void, label: string) {
    if (!locator) {
        console.warn(`[Highlight] ${label}: no locator supplied — skipping.`);
        return;
    }
    try {
        await locator.evaluate(apply, undefined, { timeout: HIGHLIGHT_TIMEOUT_MS });
    } catch {
        // Not found, detached, or the page navigated mid-highlight. Cosmetic — never fail here.
        console.warn(`[Highlight] ${label}: element not available within ${HIGHLIGHT_TIMEOUT_MS}ms — skipping decoration.`);
    }
}

export async function highlightElements(elementSelectors: Locator | null) {
    await decorate(
        elementSelectors,
        (el) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.border = '2px solid red';
            el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        },
        'highlightElements',
    );
}

export async function highlightElementBorder(elementSelectors: Locator | null) {
    await decorate(
        elementSelectors,
        (el) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.border = '2px solid red';
        },
        'highlightElementBorder',
    );
}

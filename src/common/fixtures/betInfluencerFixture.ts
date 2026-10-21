import { test as base } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BetInfluencerPage } from '../pages/BetInfluencerPage';

type BetInfluencerFixtures = {
    safeActions: SafeActions;
    betInfluencerPage: BetInfluencerPage;
};

/**
 * A separate fixture from betwayFixture on purpose.
 *
 * betwayFixture constructs 25 page objects and, for most of them, navigates and dismisses banners
 * during setup. This flow logs in as Account A and then as Account B inside the test itself, so
 * any fixture-level login would be wrong by the second half. Keeping it separate also means the
 * existing smoke suites are untouched by anything added here.
 */
export const test = base.extend<BetInfluencerFixtures>({
    safeActions: async ({ page }, use) => {
        await use(new SafeActions(page));
    },

    betInfluencerPage: async ({ page, safeActions }, use) => {
        await use(new BetInfluencerPage(page, safeActions));
    },
});

export { expect } from '@playwright/test';

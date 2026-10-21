import { test as base, Page } from '@playwright/test';
import path from 'path';
import * as fs from 'fs';
import { activeRegion } from '../config/oddsApiUrl';
import { loadRegionData, bettingUser } from '../config/regionData';
import { SafeActions } from '../actions/SafeActions';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SportsPage } from '../pages/SportsPage';
import { CasinoPage } from '../pages/CasinoPage';
import { VirtualsPage } from '../pages/VirtualsPage';
import { PromotionPage } from '../pages/PromotionPage';
import { BetGamesPage } from '../pages/BetGamesPage';
import { SignUpPage } from '../pages/SignUpPage';
import { SignupUtils } from '../flows/SignupUtils';
import { HeaderPage } from '../pages/HeaderPage';
import { BetslipPage } from '../pages/BetslipPage';
import { BetInfluencerModal } from '../pages/BetInfluencerModal';
import { ContactUsPage } from '../pages/ContactUsPage';
import { HowToPage } from '../pages/HowToPage';
import { MyBetsPage } from '../pages/MyBetsPage';
import { BuildABetPage } from '../pages/BuildABetPage';
import { BookABetPage } from '../pages/BookABetPage';
import { BetSaverPage } from '../pages/BetSaverPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { FeedsPage } from '../pages/FeedsPage';
import { GamingLobbyPage } from '../pages/GamingLobbyPage';

export interface FullTestData {
    basicInfo: {
        mobile: string;
        password: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    mobileValidation: { [key: string]: string };
    passwordValidation: { [key: string]: string };
    nameValidation: { [key: string]: string };
    idValidation: { [key: string]: string };
    codeValidation: { [key: string]: string };
    myBetsCredentials: {
        mobile: string;
        password: string;
    };
    buildABetCredentials: {
        mobile: string;
        password: string;
    };
}

const testDataPath = path.resolve(__dirname, '../../regions', activeRegion(), 'json-data/SignUpData.json');

if (!fs.existsSync(testDataPath)) {
    console.error(`\n[betwayFixture Error]`);
    console.error(`Could not find the JSON data file at the specified path.`);
    console.error(`Path tried: ${testDataPath}`);
    process.exit(1);
}

const allTestData: FullTestData = loadRegionData('json-data/SignUpData.json');

/** DEPRECATED: For backward compatibility */
export const TestDataVariations = allTestData;

type PageFixtures = {
    safeActions: SafeActions;
    homePage: HomePage;
    loginPage: LoginPage;
    sportsPage: SportsPage;
    casinoPage: CasinoPage;
    virtualsPage: VirtualsPage;
    promotionPage: PromotionPage;
    betgamesPage: BetGamesPage;
    betinfluencerModal: BetInfluencerModal;
    contactUs: ContactUsPage;
    howTo: HowToPage;
    myBetsPage: MyBetsPage;
    buildABetPage: BuildABetPage;
    bookABetPage: BookABetPage;
    betSaverPage: BetSaverPage;
    transactionHistoryPage: TransactionHistoryPage;
    headerPage: HeaderPage;
    betslipPage: BetslipPage;
    hamburgerMenuPage: HamburgerMenuPage;
    feedsPage: FeedsPage;
    gamingLobbyPage: GamingLobbyPage;
    // Signup-specific fixtures
    signupPage: SignUpPage;
    signupUtils: SignupUtils;
    screenshotDir: string;
    testData: FullTestData;
};

/**
 * Confirmed live on GH: the cookie-consent "Got it" banner and the promo popup (its own
 * #modal-close-btn) can both be on screen at once, and the promo popup — confirmed recurring, not
 * a one-time thing — can be the one on top, intercepting a bare `.click()` on "Got it" for the
 * entire default 60s actionability timeout with no recovery. Every fixture below used to do that
 * bare click; this dismisses the promo popup first (best-effort) and swallows any remaining
 * failure, since "Got it" not being there at all (already dismissed, or never shown) is a fine
 * outcome too.
 */
async function dismissCookieBanner(page: Page) {
    const gotIt = page.getByText('Got it').first();
    try {
        await gotIt.click({ timeout: 5000 });
        return;
    } catch {
        const closeBtn = page.locator('#modal-close-btn').filter({ visible: true }).first();
        await closeBtn.click({ timeout: 3000 }).catch(() => { });
        await gotIt.click({ timeout: 5000 }).catch(() => { });
    }
}

export const test = base.extend<PageFixtures>({
    safeActions: async ({ page }, use) => {
        await use(new SafeActions(page));
    },

    homePage: async ({ page, safeActions }, use) => {
        const homePage = new HomePage(page, safeActions);
        await homePage.gotoHomePage();
        await dismissCookieBanner(homePage.page);
        await use(homePage);
    },

    loginPage: async ({ page, safeActions }, use) => {
        const loginPage = new LoginPage(page, safeActions);
        await loginPage.goto();
        await dismissCookieBanner(loginPage.page);
        await use(loginPage);
    },

    sportsPage: async ({ page, safeActions }, use) => {
        const sportsPage = new SportsPage(page, safeActions);
        await sportsPage.gotoSportsPage();
        await dismissCookieBanner(sportsPage.page);
        await use(sportsPage);
    },

    casinoPage: async ({ page, safeActions }, use) => {
        const casinoPage = new CasinoPage(page, safeActions);
        await casinoPage.gotoCasino();
        await dismissCookieBanner(casinoPage.page);
        await use(casinoPage);
    },

    virtualsPage: async ({ page, safeActions }, use) => {
        const virtualsPage = new VirtualsPage(page, safeActions);
        await virtualsPage.gotoVirtuals();
        await use(virtualsPage);
    },

    promotionPage: async ({ page, safeActions }, use) => {
        const promotionPage = new PromotionPage(page, safeActions);
        await use(promotionPage);
    },

    contactUs: async ({ page, safeActions }, use) => {
        const contactUsPage = new ContactUsPage(page, safeActions);
        await contactUsPage.gotoContactUs();
        await use(contactUsPage);
    },

    howTo: async ({ page, safeActions }, use) => {
        const howTo = new HowToPage(page, safeActions);
        await howTo.gotoHowTo();
        await use(howTo);
    },

    betgamesPage: async ({ page, safeActions }, use) => {
        const betgamesPage = new BetGamesPage(page, safeActions);
        await betgamesPage.gotoBetgames();
        await use(betgamesPage);
    },

    betinfluencerModal: async ({ page, safeActions }, use) => {
        const betinfluencerModal = new BetInfluencerModal(page, safeActions);
        await betinfluencerModal.goto();
        await dismissCookieBanner(betinfluencerModal.page);
        await use(betinfluencerModal);
    },

    headerPage: async ({ page, safeActions }, use) => {
        const headerPage = new HeaderPage(page, safeActions);
        await headerPage.goto();
        await use(headerPage);
    },

    betslipPage: async ({ page, safeActions }, use) => {
        const betslipPage = new BetslipPage(page, safeActions);
        await betslipPage.goto();
        await use(betslipPage);
    },

    buildABetPage: async ({ page, safeActions }, use) => {
        const buildABetPage = new BuildABetPage(page, safeActions);
        await buildABetPage.goto();
        await use(buildABetPage);
    },

    screenshotDir: async ({}, use) => {
        const projectRoot = path.resolve(__dirname, '../../..');
        const screenshotDir = path.join(projectRoot, 'screenshots/module/sign-up');
        await use(screenshotDir);
    },

    testData: async ({}, use) => {
        await use(allTestData);
    },

    signupPage: async ({ page, safeActions }, use) => {
        const signupPage = new SignUpPage(page, safeActions);
        await use(signupPage);
    },

    signupUtils: async ({ page, signupPage }, use) => {
        const signupUtils = new SignupUtils(page, signupPage);
        await use(signupUtils);
    },

    myBetsPage: async ({ page, safeActions }, use) => {
        const myBetsPage = new MyBetsPage(page, safeActions);
        await myBetsPage.gotoSports();
        await use(myBetsPage);
    },

    bookABetPage: async ({ page, safeActions }, use) => {
        const bookABetPage = new BookABetPage(page, safeActions);
        await bookABetPage.goto();
        await use(bookABetPage);
    },

    betSaverPage: async ({ page, safeActions }, use) => {
        const betSaverPage = new BetSaverPage(page, safeActions);
        await betSaverPage.goto();
        // This module's T6-9 has to place a real 7-leg bet, so it needs an account with money in
        // it — see bettingUser(). Identical to Login() for every region that defines no override.
        await betSaverPage.Login(bettingUser());
        await use(betSaverPage);
    },

    transactionHistoryPage: async ({ page, safeActions }, use) => {
        const transactionHistoryPage = new TransactionHistoryPage(page, safeActions);
        await transactionHistoryPage.goto();
        await transactionHistoryPage.Login();
        await use(transactionHistoryPage);
    },

    hamburgerMenuPage: async ({ page, safeActions }, use) => {
        const hamburgerMenuPage = new HamburgerMenuPage(page, safeActions);
        await hamburgerMenuPage.goto();
        await use(hamburgerMenuPage);
    },

    feedsPage: async ({ page, safeActions }, use) => {
        const feedsPage = new FeedsPage(page, safeActions);
        await feedsPage.goto();
        await feedsPage.Login();
        await use(feedsPage);
    },

    gamingLobbyPage: async ({ page, safeActions }, use) => {
        const gamingLobbyPage = new GamingLobbyPage(page, safeActions);
        await gamingLobbyPage.goto();
        await gamingLobbyPage.Login();
        await use(gamingLobbyPage);
    },
});

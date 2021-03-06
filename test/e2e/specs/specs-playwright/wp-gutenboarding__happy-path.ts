/**
 * @group calypso-release
 */

import { DataHelper, CloseAccountFlow, GutenboardingFlow } from '@automattic/calypso-e2e';
import { Page, Browser } from 'playwright';

declare const browser: Browser;

describe( DataHelper.createSuiteTitle( 'Gutenboarding: Create' ), function () {
	const siteTitle = DataHelper.getBlogName();
	const email = DataHelper.getTestEmailAddress( {
		inboxId: DataHelper.config.get( 'signupInboxId' ),
		prefix: `e2eflowtestinggutenboarding${ DataHelper.getTimestamp() }`,
	} );
	const signupPassword = DataHelper.config.get( 'passwordForNewTestSignUps' ) as string;

	let gutenboardingFlow: GutenboardingFlow;
	let page: Page;

	beforeAll( async () => {
		page = await browser.newPage();
	} );

	describe( 'Signup via /new', function () {
		it( 'Navigate to /new', async function () {
			await page.goto( DataHelper.getCalypsoURL( 'new' ) );
		} );

		it( 'Enter new site name', async function () {
			gutenboardingFlow = new GutenboardingFlow( page );
			await gutenboardingFlow.enterSiteTitle( siteTitle );
			await gutenboardingFlow.clickButton( 'Continue' );
		} );

		it( 'Search for and select a WordPress.com domain name', async function () {
			await gutenboardingFlow.searchDomain( siteTitle );
			await gutenboardingFlow.selectDomain( siteTitle.concat( '.wordpress.com' ) );
			await gutenboardingFlow.clickButton( 'Continue' );
		} );

		it( 'Select Quadrat Black as the site design', async function () {
			await gutenboardingFlow.selectDesign( 'Quadrat Black' );
		} );

		it( 'Select to add the Plugin feature', async function () {
			await gutenboardingFlow.selectFeatures( [ 'Plugins' ] );
			await gutenboardingFlow.clickButton( 'Continue' );
		} );

		it( 'WordPress.com Business plan is recommended', async function () {
			await gutenboardingFlow.validateRecommendedPlan( 'Business' );
		} );

		it( 'Select free plan', async function () {
			await gutenboardingFlow.selectPlan( 'Free' );
		} );

		it( 'Create account', async function () {
			await Promise.all( [
				page.waitForNavigation( { waitUntil: 'networkidle' } ),
				gutenboardingFlow.signup( email, signupPassword ),
			] );
		} );

		it( 'Navigate to Home dashboard', async function () {
			// When you go to the home dashboard, there is a delayed redirect to '**/home/<sitename>'.
			// That delayed redirect can disrupt following actions in a race condition, so we must wait for that redirect to finish!
			await Promise.all( [
				page.waitForNavigation( { url: '**/home/**' } ),
				page.goto( DataHelper.getCalypsoURL( 'home' ) ),
			] );
		} );
	} );

	describe( 'Delete user account', function () {
		it( 'Close account', async function () {
			const closeAccountFlow = new CloseAccountFlow( page );
			await closeAccountFlow.closeAccount();
		} );
	} );
} );

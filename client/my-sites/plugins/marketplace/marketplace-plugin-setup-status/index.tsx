/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { useSelector, useDispatch } from 'react-redux';
import page from 'page';
import { useTranslate } from 'i18n-calypso';
import config from '@automattic/calypso-config';

/**
 * Internal dependencies
 */
import theme from 'calypso/my-sites/plugins/marketplace/theme';
import Masterbar from 'calypso/layout/masterbar/masterbar';
import { getSelectedSiteId, getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import QueryJetpackPlugins from 'calypso/components/data/query-jetpack-plugins';
import {
	getPurchaseFlowState,
	getIsProductSetupComplete,
	getHasProductSetupError,
} from 'calypso/state/plugins/marketplace/selectors';
import SimulatedProgressBar from 'calypso/my-sites/plugins/marketplace/components/simulated-progressbar';
import { getAutomatedTransfer } from 'calypso/state/automated-transfer/selectors';
import { tryProductInstall } from 'calypso/state/plugins/marketplace/actions';
import {
	navigateToInstallationThankYouPage,
	navigateToProductHomePage,
	waitFor,
} from 'calypso/my-sites/plugins/marketplace/util';
import {
	isLoaded,
	isRequestingForSites,
	getStatusForPlugin,
} from 'calypso/state/plugins/installed/selectors';
import {
	isFetching as getIsWporgPluginFetching,
	isFetched as getIsWporgPluginFetched,
	getPlugin as getWporgPlugin,
} from 'calypso/state/plugins/wporg/selectors';
/**
 * Style dependencies
 */
import 'calypso/my-sites/plugins/marketplace/marketplace-plugin-setup-status/style.scss';

/**
 * This page busy waits and/or  installs any plugins required in the marketplace purchase flow.
 */
function WrappedMarketplacePluginSetup(): JSX.Element {
	const translate = useTranslate();
	const dispatch = useDispatch();
	const selectedSiteSlug = useSelector( getSelectedSiteSlug );
	const selectedSiteId = useSelector( getSelectedSiteId );
	const {
		fetchingStatus: automatedTransferFetchingStatus,
		status: automatedTransferStatus,
	} = useSelector( ( state ) => getAutomatedTransfer( state, selectedSiteId ) );

	const { pluginSlugToBeInstalled, siteTransferStatus, pluginInstallationStatus } = useSelector(
		getPurchaseFlowState
	);
	const hasProductSetupError = useSelector( getHasProductSetupError );
	const isProductSetupComplete = useSelector( getIsProductSetupComplete );

	const pluginStatus = useSelector( ( state ) =>
		getStatusForPlugin( state, selectedSiteId, pluginSlugToBeInstalled )
	);
	const isPluginStateLoaded = useSelector( ( state ) => isLoaded( state, [ selectedSiteId ] ) );
	const isPluginStateFetching = useSelector( ( state ) =>
		isRequestingForSites( state, [ selectedSiteId ] )
	);

	// WPorg Plugin Data
	const isWporgPluginFetching = useSelector( ( state ) =>
		getIsWporgPluginFetching( state, pluginSlugToBeInstalled )
	);
	const isWporgPluginFetched = useSelector( ( state ) =>
		getIsWporgPluginFetched( state, pluginSlugToBeInstalled )
	);
	const wporgPlugin = useSelector( ( state ) => getWporgPlugin( state, pluginSlugToBeInstalled ) );
	useEffect( () => {
		if ( ! selectedSiteSlug ) {
			page( '/home' );
		} else if ( ! pluginSlugToBeInstalled ) {
			// A plugin slug should have been provided to reach this page
			if ( config.isEnabled( 'marketplace-test' ) ) {
				// eslint-disable-next-line no-console
				console.error(
					'::MARKETPLACE::ERROR:: There is an error in plugin setup page pluginSlugToBeInstalled is not provided'
				);
			}
			// In case plugin slug is not provided user will be navigated to the home page
			page( `/home/${ selectedSiteSlug }` );
		}
	}, [ dispatch, pluginSlugToBeInstalled, selectedSiteSlug ] );

	useEffect( () => {
		if ( hasProductSetupError ) {
			// TODO: Handle product setup errors, remove console log on production release
			// A plugin slug should have been provided to reach this page
			if ( config.isEnabled( 'marketplace-test' ) ) {
				// eslint-disable-next-line no-console
				console.error( '::MARKETPLACE::ERROR:: There is an error in plugin setup' );
			}
			// In case plugin slug is not provided user will be navigated to the home page
			selectedSiteSlug &&
				pluginSlugToBeInstalled &&
				navigateToProductHomePage( selectedSiteSlug, pluginSlugToBeInstalled );
		} else if ( isProductSetupComplete ) {
			/**
			 * Wait for simulated progressbar to catchup
			 */
			waitFor( 5 ).then(
				() => selectedSiteSlug && navigateToInstallationThankYouPage( selectedSiteSlug )
			);
		} else {
			// For each effect call, try to install the plugin
			dispatch( tryProductInstall() );
		}
	}, [
		dispatch,
		selectedSiteSlug,
		pluginInstallationStatus,
		siteTransferStatus,
		hasProductSetupError,
		isProductSetupComplete,
		pluginSlugToBeInstalled,
		/**
		 * Additional subscribed states to run tryProductInstall
		 */
		pluginStatus,
		automatedTransferFetchingStatus,
		automatedTransferStatus,
		isPluginStateLoaded,
		isPluginStateFetching,
		isWporgPluginFetching,
		isWporgPluginFetched,
		wporgPlugin,
	] );

	const STEP_1 = translate( 'Installing plugin' );
	const STEP_2 = translate( 'Activating plugin' );
	const steps = [ STEP_1, STEP_2 ];
	return (
		<>
			{ selectedSiteId ? <QueryJetpackPlugins siteIds={ [ selectedSiteId ] } /> : '' }
			<Masterbar></Masterbar>
			<div className="marketplace-plugin-setup-status__root">
				<div>
					<SimulatedProgressBar steps={ steps } accelerateCompletion={ isProductSetupComplete } />
				</div>
			</div>
		</>
	);
}

export default function MarketplacePluginSetup(): JSX.Element {
	return (
		<ThemeProvider theme={ theme }>
			<WrappedMarketplacePluginSetup />
		</ThemeProvider>
	);
}

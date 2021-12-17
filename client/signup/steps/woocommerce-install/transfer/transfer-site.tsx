import page from 'page';
import { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInterval } from 'calypso/lib/interval/use-interval';
import { requestAtomicSoftwareStatus } from 'calypso/state/atomic/software/actions';
import { getAtomicSoftwareStatus } from 'calypso/state/atomic/software/selectors';
import {
	initiateAtomicTransfer,
	requestLatestAtomicTransfer,
} from 'calypso/state/atomic/transfers/actions';
import { transferStates } from 'calypso/state/atomic/transfers/constants';
import { getLatestAtomicTransfer } from 'calypso/state/atomic/transfers/selectors';
import { getSiteWooCommerceUrl } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import Error from './error';
import Progress from './progress';

import './style.scss';

export default function TransferSite(): ReactElement | null {
	const dispatch = useDispatch();

	const [ progress, setProgress ] = useState( 0.1 );

	// selectedSiteId is set by the controller whenever site is provided as a query param.
	const siteId = useSelector( getSelectedSiteId ) as number;
	const transfer = useSelector( ( state ) => getLatestAtomicTransfer( state, siteId ) );
	const transferStatus = transfer?.status;
	const transferFailed = !! transfer?.error;
	const software = useSelector( ( state ) =>
		getAtomicSoftwareStatus( state, siteId, 'woo-on-plans' )
	);
	const softwareApplied = software?.applied;
	const wcAdmin = useSelector( ( state ) => getSiteWooCommerceUrl( state, siteId ) ) ?? '/';

	// Initiate Atomic transfer or software install
	useEffect( () => {
		if ( ! siteId ) {
			return;
		}
		dispatch( initiateAtomicTransfer( siteId, { softwareSet: 'woo-on-plans' } ) );
	}, [ dispatch, siteId ] );

	// Poll for transfer status
	useInterval(
		() => {
			dispatch( requestLatestAtomicTransfer( siteId ) );
		},
		transferStatus === transferStates.COMPLETED ? null : 3000
	);

	// Poll for software status
	useInterval(
		() => {
			dispatch( requestAtomicSoftwareStatus( siteId, 'woo-on-plans' ) );
		},
		softwareApplied ? null : 3000
	);

	// Watch transfer status
	useEffect( () => {
		if ( ! siteId ) {
			return;
		}

		switch ( transferStatus ) {
			case transferStates.PENDING:
				setProgress( 0.2 );
				break;
			case transferStates.ACTIVE:
				setProgress( 0.4 );
				break;
			case transferStates.PROVISIONED:
				setProgress( 0.5 );
				break;
			case transferStates.COMPLETED:
				setProgress( 0.7 );
				break;
		}

		if ( transferFailed || transferStatus === transferStates.ERROR ) {
			setProgress( 1 );
		}
	}, [ siteId, transferStatus, transferFailed ] );

	// Redirect to wc-admin once software installation is confirmed.
	useEffect( () => {
		if ( ! siteId ) {
			return;
		}

		if ( softwareApplied ) {
			setProgress( 1 );
			// Allow progress bar to complete
			setTimeout( () => {
				page( wcAdmin );
			}, 500 );
		}
	}, [ siteId, softwareApplied, wcAdmin ] );

	// todo: transferFailed states need testing and if required, pass the message through correctly
	return (
		<>
			{ transferFailed && <Error message={ transferStatus || '' } /> }
			{ ! transferFailed && <Progress progress={ progress } /> }
		</>
	);
}
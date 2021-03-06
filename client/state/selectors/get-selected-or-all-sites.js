import { createSelector } from '@automattic/state-utils';
import getSites from 'calypso/state/selectors/get-sites';
import { getSelectedSite } from 'calypso/state/ui/selectors';

export default createSelector(
	( state ) => {
		const selectedSite = getSelectedSite( state );
		return selectedSite ? [ selectedSite ] : getSites( state );
	},
	[ getSelectedSite, getSites ]
);

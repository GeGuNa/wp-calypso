import { READER_DISMISS_SITE, READER_DISMISS_POST } from 'calypso/state/reader/action-types';
import { combineReducers } from 'calypso/state/utils';

export const items = ( state = {}, action ) => {
	switch ( action.type ) {
		case READER_DISMISS_SITE: {
			return {
				...state,
				[ action.payload.siteId ]: true,
			};
		}
		case READER_DISMISS_POST: {
			return {
				...state,
				[ action.payload.siteId ]: true,
			};
		}
	}

	return state;
};

export default combineReducers( {
	items,
} );

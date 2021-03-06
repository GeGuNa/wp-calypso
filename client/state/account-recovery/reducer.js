import { withStorageKey } from '@automattic/state-utils';
import {
	ACCOUNT_RECOVERY_SETTINGS_FETCH,
	ACCOUNT_RECOVERY_SETTINGS_FETCH_SUCCESS,
	ACCOUNT_RECOVERY_SETTINGS_FETCH_FAILED,
} from 'calypso/state/action-types';
import { combineReducers } from 'calypso/state/utils';
import settings from './settings/reducer';

const isFetchingSettings = ( state = false, action ) => {
	switch ( action.type ) {
		case ACCOUNT_RECOVERY_SETTINGS_FETCH:
			return true;
		case ACCOUNT_RECOVERY_SETTINGS_FETCH_SUCCESS:
			return false;
		case ACCOUNT_RECOVERY_SETTINGS_FETCH_FAILED:
			return false;
	}

	return state;
};

const combinedReducer = combineReducers( {
	settings,
	isFetchingSettings,
} );

export default withStorageKey( 'accountRecovery', combinedReducer );

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPreferences } from 'calypso/state/preferences/actions';
import { isFetchingPreferences } from 'calypso/state/preferences/selectors';

const request = () => ( dispatch, getState ) => {
	if ( ! isFetchingPreferences( getState() ) ) {
		dispatch( fetchPreferences() );
	}
};

export default function QueryPreferences() {
	const dispatch = useDispatch();

	useEffect( () => {
		dispatch( request() );
	}, [ dispatch ] );

	return null;
}

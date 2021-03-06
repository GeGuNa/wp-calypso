import { currentUserHasFlag } from 'calypso/state/current-user/selectors';
import { isSupportSession } from 'calypso/state/support/selectors';

export function isAtomicClearCacheEnabled( state ) {
	return currentUserHasFlag( state, 'calypso_atomic_clear_cache' ) || isSupportSession( state );
}

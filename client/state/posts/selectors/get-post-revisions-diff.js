import { get } from 'lodash';

import 'calypso/state/posts/init';

export function getPostRevisionsDiff( state, siteId, postId, fromRevisionId, toRevisionId ) {
	const key = `${ fromRevisionId || 0 }:${ toRevisionId || 0 }`;
	return get( state.posts.revisions.diffs, [ siteId, postId, key, 'diff' ], {} );
}

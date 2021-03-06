import { POST_TYPES_REQUEST } from 'calypso/state/action-types';
import { registerHandlers } from 'calypso/state/data-layer/handler-registry';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { receivePostTypes } from 'calypso/state/post-types/actions';

const noop = () => {};

const handlePostTypesRequest = dispatchRequest( {
	fetch: ( action ) =>
		http(
			{
				method: 'GET',
				path: `/sites/${ action.siteId }/post-types`,
			},
			action
		),
	onSuccess: ( action, data ) => receivePostTypes( action.siteId, data.post_types ),
	onError: noop,
} );

registerHandlers( 'state/data-layer/wpcom/sites/post-types/index.js', {
	[ POST_TYPES_REQUEST ]: [ handlePostTypesRequest ],
} );

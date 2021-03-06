import { get } from 'lodash';

import 'calypso/state/inline-support-article/init';

/**
 * @param {object} state Global app state
 * @returns {object} ...
 */
export default ( state ) => get( state, 'inlineSupportArticle.isVisible', false );

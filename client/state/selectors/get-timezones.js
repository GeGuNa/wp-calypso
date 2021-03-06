import { get, map } from 'lodash';
import getTimezonesLabel from 'calypso/state/selectors/get-timezones-label';

import 'calypso/state/timezones/init';

/**
 * Return all timezones ordered by arrays with
 * the following shape:
 * [
 *   [ <continent>, [
 *     [ <timezone-value>, <timezone-label> ],
 *   ] ]
 *   ...
 * ]
 *
 * This structure facilitates the creation of a select element.
 *
 * @param  {object} state - Global state tree
 * @returns {Array} Timezones arrays
 */
export default function getTimezones( state ) {
	const continents = get( state, 'timezones.byContinents', null );

	if ( ! continents ) {
		return null;
	}

	return map( Object.entries( continents ), ( zones ) => [
		zones[ 0 ],
		map( zones[ 1 ], ( value ) => [ value, getTimezonesLabel( state, value ) ] ),
	] );
}

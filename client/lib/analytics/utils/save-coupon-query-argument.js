import debug from './debug';
import MARKETING_COUPONS_KEY from './marketing-coupons-key';
import urlParseAmpCompatible from './url-parse-amp-compatible';

/**
 * Remembers `?coupon` query argument via `localStorage`.
 */
export default function saveCouponQueryArgument() {
	// Read coupon query argument, return early if there is none.
	const parsedUrl = urlParseAmpCompatible( window.location.href );
	const couponCode = parsedUrl?.searchParams.get( 'coupon' );
	if ( ! couponCode ) {
		return;
	}

	// Read coupon list from localStorage, create new if it's not there yet, refresh existing.
	let coupons = null;
	try {
		const couponsJson = window.localStorage.getItem( MARKETING_COUPONS_KEY );
		coupons = JSON.parse( couponsJson );
	} catch ( err ) {}
	if ( ! coupons ) {
		coupons = {};
	}

	const THIRTY_DAYS_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
	const now = Date.now();
	debug( 'Found coupons in localStorage: ', coupons );

	coupons[ couponCode ] = now;

	// Delete coupons if they're older than 30 days.
	Object.keys( coupons ).forEach( ( key ) => {
		if ( now > coupons[ key ] + THIRTY_DAYS_MILLISECONDS ) {
			delete coupons[ key ];
		}
	} );

	// Write remembered coupons back to localStorage.
	try {
		debug( 'Storing coupons in localStorage: ', coupons );
		window.localStorage.setItem( MARKETING_COUPONS_KEY, JSON.stringify( coupons ) );
	} catch ( err ) {}
}

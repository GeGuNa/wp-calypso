import { getDistanceBetweenRecs } from 'calypso/reader/stream/utils';
import { getReaderFollows } from 'calypso/state/reader/follows/selectors';
import { shouldRequestRecs } from 'calypso/state/reader/streams/selectors';

jest.mock( 'calypso/reader/stream/utils' );
jest.mock( 'calypso/state/reader/follows/selectors/get-reader-follows' );

describe( 'shouldRequestRecs', () => {
	const generateState = ( { following, recs } ) => ( {
		reader: {
			streams: {
				following: { items: Array( following ).fill( {} ) },
				recs: { items: Array( recs ).fill( {} ) },
			},
		},
	} );

	test( 'should request recs if we have none', () => {
		getReaderFollows.mockReturnValue( { length: 0 } );
		const state = generateState( { following: 0, recs: 0 } );

		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( true );
	} );

	test( 'should request recs if we dont have enough', () => {
		getReaderFollows.mockReturnValue( { length: 0 } );
		getDistanceBetweenRecs.mockReturnValue( 1 );

		let state = generateState( { following: 1, recs: 1 } );
		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( true );

		state = generateState( { following: 2, recs: 3 } );
		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( true );
	} );

	test( 'should not request recs if we have enough', () => {
		getReaderFollows.mockReturnValue( { length: 0 } );
		getDistanceBetweenRecs.mockReturnValue( 1 );

		let state = generateState( { following: 1, recs: 2 } );
		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( false );

		state = generateState( { following: 2, recs: 4 } );
		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( false );

		state = generateState( { following: 2, recs: 100 } );
		expect( shouldRequestRecs( state, 'following', 'recs' ) ).toBe( false );
	} );
} );

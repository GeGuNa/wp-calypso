import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { serialize, deserialize } from 'calypso/state/utils';
import { useSandbox } from 'calypso/test-helpers/use-sinon';
import { timezonesReceive } from '../actions';
import timezonesReducer, { byContinents, labels, rawOffsets } from '../reducer';

describe( 'reducer', () => {
	let sandbox;

	useSandbox( ( newSandbox ) => {
		sandbox = newSandbox;
		sandbox.stub( console, 'warn' );
	} );

	test( 'should export expected reducer keys', () => {
		expect( timezonesReducer( undefined, {} ) ).to.have.keys( [
			'byContinents',
			'labels',
			'rawOffsets',
		] );
	} );

	describe( '#rawOffsets()', () => {
		test( 'should default to an empty action object', () => {
			expect( rawOffsets( undefined, {} ) ).to.eql( {} );
		} );

		test( 'should index `rawOffsets` state', () => {
			const initialState = undefined;

			const action = timezonesReceive( {
				rawOffsets: {
					'UTC+0': 'UTC',
					'UTC-12': 'UTC-12',
					'UTC-11.5': 'UTC-11:30',
				},
			} );

			const expectedState = {
				'UTC+0': 'UTC',
				'UTC-12': 'UTC-12',
				'UTC-11.5': 'UTC-11:30',
			};

			const newState = rawOffsets( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should override `rawOffsets` state', () => {
			const initialState = {
				'UTC+13.75': 'UTC+13:45',
				'UTC+14': 'UTC+14',
			};
			deepFreeze( initialState );

			const action = timezonesReceive( {
				rawOffsets: {
					'UTC+0': 'UTC',
					'UTC-12': 'UTC-12',
					'UTC-11.5': 'UTC-11:30',
				},
			} );

			const expectedState = {
				'UTC+0': 'UTC',
				'UTC-12': 'UTC-12',
				'UTC-11.5': 'UTC-11:30',
			};

			const newState = rawOffsets( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should persist state', () => {
			const initialState = {
				rawOffsets: {
					'UTC+13.75': 'UTC+13:45',
					'UTC+14': 'UTC+14',
				},
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = serialize( rawOffsets, initialState );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should load persisted state', () => {
			const initialState = {
				'UTC+0': 'UTC',
				'UTC+13.75': 'UTC+13:45',
				'UTC+14': 'UTC+14',
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = deserialize( rawOffsets, initialState );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should not load invalid persisted state', () => {
			const initialStateONE = { rawOffsets: { foo: 'bar' } };
			deepFreeze( initialStateONE );
			const newStateONE = deserialize( rawOffsets, initialStateONE );

			// 'UTC' shouldn't be allowed either.
			const initialStateTWO = { rawOffsets: { UTC: 'UTC' } };
			deepFreeze( initialStateTWO );
			const newStateTWO = deserialize( rawOffsets, initialStateTWO );

			expect( newStateONE ).to.eql( {} );
			expect( newStateTWO ).to.eql( {} );
		} );
	} );

	describe( '#labels()', () => {
		test( 'should default to an empty action object', () => {
			expect( rawOffsets( undefined, {} ) ).to.eql( {} );
		} );

		test( 'should index `labels` state', () => {
			const initialState = undefined;

			const action = timezonesReceive( {
				labels: {
					'Asia/Aqtobe': 'Aqtobe',
					'America/Boa_Vista': 'Boa Vista',
					'Indian/Comoro': 'Comoro',
				},
			} );

			const expectedState = {
				'Asia/Aqtobe': 'Aqtobe',
				'America/Boa_Vista': 'Boa Vista',
				'Indian/Comoro': 'Comoro',
			};

			const newState = labels( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should override `labels` state', () => {
			const initialState = {
				'Australia/Currie': 'Currie',
				'Indian/Mauritius': 'Mauritius',
			};
			deepFreeze( initialState );

			const action = timezonesReceive( {
				labels: {
					'Asia/Aqtobe': 'Aqtobe',
					'America/Boa_Vista': 'Boa Vista',
					'Indian/Comoro': 'Comoro',
				},
			} );

			const expectedState = {
				'Asia/Aqtobe': 'Aqtobe',
				'America/Boa_Vista': 'Boa Vista',
				'Indian/Comoro': 'Comoro',
			};

			const newState = labels( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should persist state', () => {
			const initialState = {
				labels: {
					'Asia/Aqtobe': 'Aqtobe',
					'America/Boa_Vista': 'Boa Vista',
					'Indian/Comoro': 'Comoro',
				},
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = serialize( labels, initialState );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should load persisted state', () => {
			const initialState = {
				'Asia/Aqtobe': 'Aqtobe',
				'America/Boa_Vista': 'Boa Vista',
				'Indian/Comoro': 'Comoro',
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = deserialize( labels, initialState );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should not load invalid persisted state', () => {
			const initialStateONE = { labels: { foo: 'bar' } };
			deepFreeze( initialStateONE );
			const newStateONE = deserialize( labels, initialStateONE );
			expect( newStateONE ).to.eql( {} );
		} );
	} );

	describe( '#byContinents()', () => {
		test( 'should default to an empty action object', () => {
			expect( rawOffsets( undefined, {} ) ).to.eql( {} );
		} );

		test( 'should index `rawOffsets` state', () => {
			const initialState = undefined;

			const action = timezonesReceive( {
				byContinents: {
					Asia: [ 'Asia/Aqtobe' ],
					America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
					Indian: [ 'Indian/Comoro' ],
				},
			} );

			const expectedState = {
				Asia: [ 'Asia/Aqtobe' ],
				America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
				Indian: [ 'Indian/Comoro' ],
			};

			const newState = byContinents( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should override timezones.byContinents state', () => {
			const initialState = {
				Pacific: [ 'Pacific/Funafuti' ],
			};
			deepFreeze( initialState );

			const action = timezonesReceive( {
				byContinents: {
					Asia: [ 'Asia/Aqtobe' ],
					America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
					Indian: [ 'Indian/Comoro' ],
				},
			} );

			const expectedState = {
				Asia: [ 'Asia/Aqtobe' ],
				America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
				Indian: [ 'Indian/Comoro' ],
			};

			const newState = byContinents( initialState, action );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should persist state', () => {
			const initialState = {
				byContinents: {
					Asia: [ 'Asia/Aqtobe' ],
					America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
					Indian: [ 'Indian/Comoro' ],
				},
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = serialize( byContinents, initialState );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should load persisted state', () => {
			const initialState = {
				Asia: [ 'Asia/Aqtobe' ],
				America: [ 'America/Blanc-Sablon', 'America/Boa_Vista' ],
				Indian: [ 'Indian/Comoro' ],
			};
			deepFreeze( initialState );

			const expectedState = initialState;
			const newState = deserialize( byContinents, initialState );
			expect( newState ).to.eql( expectedState );
		} );

		test( 'should not load invalid persisted state', () => {
			const initialStateONE = { byContinents: { foo: 'bar' } };
			deepFreeze( initialStateONE );
			const newStateONE = deserialize( byContinents, initialStateONE );
			expect( newStateONE ).to.eql( {} );
		} );
	} );
} );

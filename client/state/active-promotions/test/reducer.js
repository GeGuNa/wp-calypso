import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { serialize, deserialize } from 'calypso/state/utils';
import { useSandbox } from 'calypso/test-helpers/use-sinon';
import {
	activePromotionsReceiveAction,
	activePromotionsRequestSuccessAction,
	activePromotionsRequestFailureAction,
	requestActivePromotions,
} from '../actions';
import activePromotionsReducer, {
	items as itemsReducer,
	requesting as requestReducer,
	error as errorReducer,
} from '../reducer';
import { WPCOM_RESPONSE } from './fixture';

describe( 'reducer', () => {
	let sandbox;

	useSandbox( ( newSandbox ) => {
		sandbox = newSandbox;
		// mute off console warn
		sandbox.stub( console, 'warn' );
	} );

	test( 'should export expected reducer keys', () => {
		expect( activePromotionsReducer( undefined, {} ) ).to.have.keys( [
			'items',
			'requesting',
			'error',
		] );
	} );

	describe( '#items()', () => {
		test( 'should default to an empty Array', () => {
			expect( itemsReducer( undefined, [] ) ).to.eql( [] );
		} );

		test( 'should index items state', () => {
			const initialState = undefined;
			const activePromotions = WPCOM_RESPONSE;
			const action = activePromotionsReceiveAction( activePromotions );
			const expectedState = activePromotions;
			deepFreeze( expectedState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should override activePromotions', () => {
			const activePromotions = WPCOM_RESPONSE;
			const initialState = activePromotions;
			const action = activePromotionsReceiveAction( activePromotions );
			const expectedState = activePromotions;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = itemsReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should persist state', () => {
			const activePromotions = WPCOM_RESPONSE;
			const initialState = activePromotions;
			const expectedState = activePromotions;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = serialize( itemsReducer, initialState );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should load persisted state', () => {
			const activePromotions = WPCOM_RESPONSE;
			const initialState = activePromotions;
			const expectedState = activePromotions;
			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = deserialize( itemsReducer, initialState );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should not load invalid persisted state', () => {
			// each entry should be `string`
			const activePromotions = [ 1234 ];
			const initialState = activePromotions;
			deepFreeze( initialState );
			const expectedState = [];
			deepFreeze( expectedState );

			const newState = deserialize( itemsReducer, initialState );

			expect( newState ).to.eql( expectedState );
		} );
	} );

	describe( '#requesting()', () => {
		test( 'should return FALSE when initial state is undefined and action is unknown', () => {
			expect( requestReducer( undefined, {} ) ).to.eql( false );
		} );

		test( 'should return TRUE when initial state is undefined and action is REQUEST', () => {
			const initialState = undefined;
			const action = requestActivePromotions();
			const expectedState = true;
			deepFreeze( expectedState );

			const newState = requestReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should update `requesting` state on SUCCESS', () => {
			const initialState = true;
			const action = activePromotionsRequestSuccessAction();
			const expectedState = false;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = requestReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should update `requesting` state on FAILURE', () => {
			const initialState = true;
			const action = activePromotionsRequestFailureAction();
			const expectedState = false;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = requestReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );
	} );

	describe( '#errors()', () => {
		test( 'should return FALSE when initial state is undefined and action is unknown', () => {
			expect( errorReducer( undefined, {} ) ).to.eql( false );
		} );

		test( 'should set `error` state to TRUE on FAILURE', () => {
			const initialState = undefined;
			const action = activePromotionsRequestFailureAction();
			const expectedState = true;

			deepFreeze( expectedState );

			const newState = errorReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should set `error` state to FALSE on REQUEST', () => {
			const initialState = true;
			const action = requestActivePromotions();
			const expectedState = false;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = errorReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );

		test( 'should set `error` state to FALSE on SUCCESS', () => {
			const initialState = true;
			const action = activePromotionsRequestSuccessAction();
			const expectedState = false;

			deepFreeze( initialState );
			deepFreeze( expectedState );

			const newState = errorReducer( initialState, action );

			expect( newState ).to.eql( expectedState );
		} );
	} );
} );

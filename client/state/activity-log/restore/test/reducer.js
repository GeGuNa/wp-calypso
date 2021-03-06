import deepFreeze from 'deep-freeze';
import {
	dismissRewindRestoreProgress,
	rewindRequestDismiss,
	rewindRequestRestore,
	rewindRestore,
} from '../../actions';
import { restoreProgress, restoreRequest } from '../reducer';

/**
 * Constants
 */
const ACTIVITY_ID = 'fooBarbAz';
const SITE_ID = 987;
const TIMESTAMP = 1496926224;

describe( 'restoreProgress', () => {
	test( 'should start at 0% queued', () => {
		const state = restoreProgress( undefined, rewindRestore( SITE_ID, TIMESTAMP ) );
		expect( state[ SITE_ID ] ).toEqual( {
			errorCode: '',
			failureReason: '',
			message: '',
			percent: 0,
			status: 'queued',
			timestamp: TIMESTAMP,
			rewindId: '',
		} );
	} );

	test( 'should null on dismissal', () => {
		const prevState = deepFreeze( {
			[ SITE_ID ]: {
				percent: 100,
				status: 'finished',
			},
		} );

		const state = restoreProgress( prevState, dismissRewindRestoreProgress( SITE_ID ) );
		expect( state[ SITE_ID ] ).toBeNull();
	} );

	test( 'should preserve other sites', () => {
		const otherSiteId = 123456;
		const prevState = deepFreeze( {
			[ otherSiteId ]: {
				active: false,
				firstBackupDate: '',
				isPressable: false,
				plan: 'jetpack-free',
			},
		} );

		[
			restoreProgress( prevState, rewindRestore( SITE_ID, TIMESTAMP ) ),
			restoreProgress( prevState, dismissRewindRestoreProgress( SITE_ID ) ),
		].forEach( ( state ) => expect( state[ otherSiteId ] ).toEqual( prevState[ otherSiteId ] ) );
	} );
} );

describe( 'rewindRequestRestore', () => {
	test( 'should set activity ID on request', () => {
		const state = restoreRequest( undefined, rewindRequestRestore( SITE_ID, ACTIVITY_ID ) );
		expect( state[ SITE_ID ] ).toBe( ACTIVITY_ID );
	} );

	test( 'should clear on dismissal', () => {
		const prevState = deepFreeze( {
			[ SITE_ID ]: ACTIVITY_ID,
		} );

		const state = restoreRequest( prevState, rewindRequestDismiss( SITE_ID ) );
		expect( state ).not.toHaveProperty( [ SITE_ID ] );
	} );
} );

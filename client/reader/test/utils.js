/**
 * @jest-environment jsdom
 */

import { expect } from 'chai';
import page from 'page';
import { showSelectedPost } from '../utils';

jest.mock( 'page', () => ( {
	show: require( 'sinon' ).spy(),
} ) );
jest.mock( 'calypso/lib/redux-bridge', () => ( {
	reduxGetState: function () {
		return { reader: { posts: { items: {} } } };
	},
} ) );

describe( 'reader utils', () => {
	beforeEach( () => {
		page.show.resetHistory();
	} );

	describe( '#showSelectedPost', () => {
		test( 'does not do anything if postKey argument is missing', () => {
			showSelectedPost( {} );
			expect( page.show ).to.have.not.been.called;
		} );

		test( 'redirects if passed a post key', () => {
			showSelectedPost( { postKey: { feedId: 1, postId: 5 } } );
			expect( page.show ).to.have.been.calledOnce;
		} );

		test( 'redirects to a #comments URL if we passed comments argument', () => {
			showSelectedPost( { postKey: { feedId: 1, postId: 5 }, comments: true } );
			expect( page.show ).to.have.been.calledWithMatch( '#comments' );
		} );
	} );
} );

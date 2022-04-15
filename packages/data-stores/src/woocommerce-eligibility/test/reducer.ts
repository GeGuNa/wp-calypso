import { PRODUCTS_LIST_RECEIVE } from '../constants';
import { productsList } from '../reducer';
import { ProductsList } from '../types';

describe( 'reducer', () => {
	it( 'returns the correct default state', () => {
		const state = productsList( undefined, { type: 'TEST_ACTION' } );
		expect( state ).toEqual( undefined );
	} );

	it( 'returns the products list', () => {
		const expectedProductsList = {
			test_product: {
				available: true,
				cost: 20,
			},
		} as ProductsList;
		const expectedProductsListType = 'jetpack';

		const state = productsList( undefined, {
			type: PRODUCTS_LIST_RECEIVE,
			productsList: expectedProductsList,
			productsListType: expectedProductsListType,
		} );

		expect( state ).toEqual( expectedProductsList );
	} );
} );

/**
 * @jest-environment jsdom
 */

import { isMobile } from '@automattic/viewport';
import {
	GP_PROJECT,
	GP_BASE_URL,
	GP_PROJECT_TRANSLATION_SET_SLUGS,
} from 'calypso/lib/i18n-utils/constants';
import { getTranslationPermaLink, normalizeDetailsFromTranslationData } from '../utils';

jest.mock( '@automattic/viewport', () => ( {
	isMobile: jest.fn(),
} ) );

// see: `languages` array in config/_shared.json
const languagesMock = [
	{
		langSlug: 'de',
	},
	{
		langSlug: 'de_formal',
		parentLangSlug: 'de',
	},
];

const mockGpApiResponseItem = {
	original_id: '149708',
	original: {
		singular: 'Manage which sites appear in your profile.',
		plural: null,
		context: null,
	},
	original_comment: 'Hi!',
	project: 'test',
	translations: [
		{
			id: '7286107',
			original_id: '149708',
			translation_set_id: '60740',
			translation_0: 'Verwalte, welche Websites in Ihrem Profil angezeigt werden.',
			translation_1: 'Plural!',
			user_id: '1018671',
			status: 'current',
			date_added: '2018-03-21 05:46:44',
			date_modified: '2018-03-21 05:46:44',
			warnings: null,
			user_id_last_modified: '1018671',
		},
	],
};

describe( 'Community Translator', () => {
	afterEach( () => {
		isMobile.mockReset();
	} );

	describe( 'getTranslationPermaLink()', () => {
		test( 'should return null by default', () => {
			expect( getTranslationPermaLink() ).toBe( null );
		} );

		test( 'should return valid url with correct params for root language', () => {
			expect( getTranslationPermaLink( '123', languagesMock[ 0 ] ) ).toBe(
				`${ GP_BASE_URL }/projects/${ GP_PROJECT }/${ languagesMock[ 0 ].langSlug }/default?filters[original_id]=123`
			);
		} );

		test( 'should return valid url with correct params for locale variant', () => {
			expect( getTranslationPermaLink( '321', languagesMock[ 1 ], 'bean' ) ).toBe(
				`${ GP_BASE_URL }/projects/bean/${ languagesMock[ 1 ].parentLangSlug }/` +
					`${
						GP_PROJECT_TRANSLATION_SET_SLUGS[ languagesMock[ 1 ].langSlug ]
					}?filters[original_id]=321`
			);
		} );
	} );

	describe( 'normalizeDetailsFromTranslationData()', () => {
		test( 'should return valid url with correct params for root language', () => {
			expect( normalizeDetailsFromTranslationData( mockGpApiResponseItem ) ).toEqual( {
				originalId: '149708',
				comment: 'Hi!',
				translatedSingular: 'Verwalte, welche Websites in Ihrem Profil angezeigt werden.',
				translatedPlural: 'Plural!',
				lastModified: '2018-03-21 05:46:44',
			} );
		} );
	} );
} );

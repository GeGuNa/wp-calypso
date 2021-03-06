import buildSeoTitle from './build-seo-title';
import getSeoTitleFormats from './get-seo-title-formats';

export default ( state, type, data ) => {
	if ( ! data?.site?.ID ) {
		return '';
	}

	const titleFormats = getSeoTitleFormats( state, data.site.ID );

	return buildSeoTitle( titleFormats, type, data );
};

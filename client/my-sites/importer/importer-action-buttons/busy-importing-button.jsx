import { localize } from 'i18n-calypso';
import ImporterActionButton from './action-button';

export const BusyImportingButton = ( { translate } ) => (
	<ImporterActionButton primary busy disabled>
		{ translate( 'Importingâ€¦' ) }
	</ImporterActionButton>
);

export default localize( BusyImportingButton );

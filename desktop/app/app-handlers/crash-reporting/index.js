const { app, crashReporter } = require( 'electron' );
const Config = require( '../../lib/config' );
const log = require( '../../lib/logger' )( 'desktop:crash-reporting' );

module.exports = function () {
	if ( Config.crash_reporter.electron ) {
		app.on( 'will-finish-launching', function () {
			log.info( 'Crash reporter started' );

			crashReporter.start( {
				globalExtra: {
					_companyName: Config.author,
				},
				productName: Config.description,
				submitURL: Config.crash_reporter.url,
				uploadToServer: true,
			} );
		} );
	}
};

const platform = require( '../../lib/platform' );
const calypsoMenu = require( './calypso-menu' );

module.exports = function ( appWindow ) {
	const menu = calypsoMenu( appWindow ).concat(
		{
			type: 'separator',
		},
		{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize',
		},
		{
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close',
		}
	);

	if ( platform.isOSX() ) {
		menu.push( { type: 'separator' } );
		menu.push( { label: 'Bring All to Front', role: 'front' } );
	}

	return menu;
};

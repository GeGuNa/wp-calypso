const { Menu } = require( 'electron' );
const log = require( '../../lib/logger' )( 'desktop:menu' );
const menuSetter = require( '../../lib/menu-setter' );
const template = require( './main-menu' );

/**
 * Module variables
 */
let appMenu = false;

function AppMenu() {
	this.menu = false;
}

AppMenu.prototype.set = function ( app, appWindow ) {
	this.menu = Menu.buildFromTemplate( template( app, appWindow ) );

	Menu.setApplicationMenu( this.menu );
};

AppMenu.prototype.enableLoggedInItems = function () {
	log.info( 'Enabling logged in menu items' );

	menuSetter.setRequiresUser( this.menu, true );
};

AppMenu.prototype.disableLoggedInItems = function () {
	log.info( 'Disabling logged in menu items' );

	menuSetter.setRequiresUser( this.menu, false );
};

if ( ! appMenu ) {
	appMenu = new AppMenu();
}

module.exports = appMenu;

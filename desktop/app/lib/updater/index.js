const { EventEmitter } = require( 'events' );
const { app, dialog, BrowserWindow } = require( 'electron' );
const config = require( '../../lib/config' );
const log = require( '../../lib/logger' )( 'desktop:updater' );
const platform = require( '../../lib/platform' );

const isMacOSBigSur =
	process.platform === 'darwin' && process.getSystemVersion().startsWith( '11' );

// FIXME: Auto-restart does not work on MacOS Big Sur and requires an upgrade of Electron v11: https://github.com/electron/electron/issues/25626
const defaultConfirmLabel = isMacOSBigSur ? 'Update & Quit' : 'Update & Restart';
const defaultDialogMessage = isMacOSBigSur
	? '{name} {newVersion} is now available — you have {currentVersion}.\n\nUpdate requires manual restart.'
	: '{name} {newVersion} is now available — you have {currentVersion}. Would you like to update now?';

class Updater extends EventEmitter {
	constructor( options ) {
		super();

		this.confirmLabel = options.confirmLabel || defaultConfirmLabel;
		this.dialogTitle = options.dialogTitle || 'A new version of {name} is available!';
		this.dialogMessage = options.dialogMessage || defaultDialogMessage;
		this.beta = options.beta || false;

		this._version = '';
		this._hasPrompted = false;
	}

	ping() {}

	onDownloaded( info ) {
		log.info( 'Update downloaded: ', info );
	}

	onAvailable( info ) {
		log.info( 'Update is available', info );
	}

	onNotAvailable( info ) {
		log.info( 'Update is not available', info );
	}

	onError( event ) {
		log.error( 'Update failed: ', event );
	}

	onConfirm() {}

	onCancel() {}

	async notify() {
		const mainWindow = BrowserWindow.getFocusedWindow();

		const updateDialogOptions = {
			buttons: [ this.sanitizeButtonLabel( this.confirmLabel ), 'Cancel' ],
			title: 'Update Available',
			message: this.expandMacros( this.dialogTitle ),
			detail: this.expandMacros( this.dialogMessage ),
		};

		if ( ! this._hasPrompted ) {
			this._hasPrompted = true;

			const selected = await dialog.showMessageBox( mainWindow, updateDialogOptions );
			const button = selected.response;

			if ( button === 0 ) {
				this.onConfirm();
			} else {
				this.onCancel();
			}

			this._hasPrompted = false;
			this.emit( 'end' );
		}
	}

	notifyNotAvailable() {
		const mainWindow = BrowserWindow.getFocusedWindow();

		const notAvailableDialogOptions = {
			buttons: [ 'OK' ],
			message: 'There are currently no updates available.',
		};

		dialog.showMessageBox( mainWindow, notAvailableDialogOptions );
	}

	setVersion( version ) {
		this._version = version;
	}

	expandMacros( originalText ) {
		const macros = {
			name: config.appName,
			currentVersion: app.getVersion(),
			newVersion: this._version,
		};

		let text = originalText;

		for ( const key in macros ) {
			if ( macros.hasOwnProperty( key ) ) {
				text = text.replace( new RegExp( `{${ key }}`, 'ig' ), macros[ key ] );
			}
		}

		return text;
	}

	sanitizeButtonLabel( value ) {
		if ( platform.isWindows() ) {
			return value.replace( '&', '&&' );
		}

		return value;
	}
}

module.exports = Updater;

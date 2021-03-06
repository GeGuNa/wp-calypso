import config from '@automattic/calypso-config';
import page from 'page';
import { makeLayout, render as clientRender } from 'calypso/controller';
import { sidebar } from 'calypso/me/controller';
import {
	accountRecovery,
	connectedApplications,
	password,
	securityCheckup,
	socialLogin,
	twoStep,
} from './controller';

export default function () {
	const useCheckupMenu = config.isEnabled( 'security/security-checkup' );

	const mainPageFunction = useCheckupMenu ? securityCheckup : password;
	page( '/me/security', sidebar, mainPageFunction, makeLayout, clientRender );

	if ( useCheckupMenu ) {
		page( '/me/security/password', sidebar, password, makeLayout, clientRender );
	}

	page( '/me/security/social-login', sidebar, socialLogin, makeLayout, clientRender );

	page( '/me/security/two-step', sidebar, twoStep, makeLayout, clientRender );

	page(
		'/me/security/connected-applications',
		sidebar,
		connectedApplications,
		makeLayout,
		clientRender
	);

	page( '/me/security/account-recovery', sidebar, accountRecovery, makeLayout, clientRender );
}

/**
 * External dependencies
 */
import { createElement, createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { getTld } from 'calypso/lib/domains';
import { domainAvailability } from 'calypso/lib/domains/constants';
import {
	getMappingFreeText,
	getMappingPriceText,
	getTransferFreeText,
	getTransferPriceText,
	getTransferSalePriceText,
	isFreeTransfer,
	optionInfo,
} from './index';

export function getOptionInfo( {
	availability,
	cart,
	currencyCode,
	domain,
	isSignupStep,
	onConnect,
	onTransfer,
	primaryWithPlansOnly,
	productsList,
	selectedSite,
	siteIsOnPaidPlan,
} ) {
	const mappingFreeText = getMappingFreeText( {
		cart,
		domain,
		primaryWithPlansOnly,
		selectedSite,
	} );

	const mappingPriceText = getMappingPriceText( {
		cart,
		currencyCode,
		domain,
		productsList,
		selectedSite,
	} );

	const transferFreeText = getTransferFreeText( {
		cart,
		domain,
		isSignupStep,
		siteIsOnPaidPlan,
	} );

	const transferSalePriceText = getTransferSalePriceText( {
		cart,
		currencyCode,
		domain,
		productsList,
	} );

	const transferPriceText = getTransferPriceText( {
		cart,
		currencyCode,
		domain,
		productsList,
	} );

	const transferPricing = {
		cost: transferPriceText,
		isFree: isFreeTransfer( { cart, domain } ),
		sale: transferSalePriceText,
		text: transferFreeText,
	};

	const mappingPricing = {
		cost: mappingPriceText,
		text: mappingFreeText,
	};

	let transferContent;
	switch ( availability.status ) {
		case domainAvailability.TRANSFERRABLE:
		case domainAvailability.MAPPED_SAME_SITE_TRANSFERRABLE:
			transferContent = {
				...optionInfo.transferSupported,
				pricing: transferPricing,
				onSelect: onTransfer,
				primary: true,
			};
			break;
		case domainAvailability.TLD_NOT_SUPPORTED:
			transferContent = {
				...optionInfo.transferNotSupported,
				topText: createInterpolateElement(
					sprintf(
						/* translators: %s - the TLD extension of the domain the user wanted to transfer (ex.: com, net, org, etc.) */
						__(
							"We don't support transfers for domains ending with <strong>.%s</strong>, but you can connect it instead."
						),
						getTld( domain )
					),
					{ strong: createElement( 'strong' ) }
				),
			};
			break;
		default:
			transferContent = optionInfo.transferNotSupported;
	}

	let connectContent;
	if ( domainAvailability.MAPPABLE === availability.mappable ) {
		connectContent = {
			...optionInfo.connectSupported,
			onSelect: onConnect,
			pricing: mappingPricing,
		};
	} else {
		switch ( availability.status ) {
			case domainAvailability.MAPPED_SAME_SITE_TRANSFERRABLE:
				connectContent = {
					...optionInfo.connectNotSupported,
					topText: __(
						'This domain is already connected to your site, but you can still transfer it.'
					),
				};
				break;
			default:
				connectContent = optionInfo.connectNotSupported;
		}
	}

	connectContent.primary = ! transferContent?.primary;

	if ( transferContent?.primary ) {
		return [ transferContent, connectContent ];
	}

	return [ { ...connectContent, primary: true }, transferContent ];
}
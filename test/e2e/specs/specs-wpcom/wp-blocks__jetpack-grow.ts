/**
 * @group gutenberg
 */
import {
	BlockFlow,
	BusinessHoursFlow,
	WhatsAppButtonFlow,
	ContactFormFlow,
} from '@automattic/calypso-e2e';
import { createBlockTests } from '../specs-playwright/shared-specs/block-testing';

const blockFlows: BlockFlow[] = [
	new BusinessHoursFlow( { day: 'Sat' } ),
	new WhatsAppButtonFlow( { phoneNumber: 1234567890, buttonText: 'Porpoises swim happily' } ),
	new ContactFormFlow( { nameLabel: 'Angry dolphins flip swiftly' } ),
];

createBlockTests( 'Blocks: Jetpack Grow', blockFlows );

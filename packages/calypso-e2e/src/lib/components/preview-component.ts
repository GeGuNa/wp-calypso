import { Frame, Page } from 'playwright';

const selectors = {
	previewPane: '.web-preview',
	iframe: '.web-preview__frame',

	// Actions on pane
	closeButton: 'button[aria-label="Close preview"]',
	activateButton: 'text=Activate',
};

/**
 * Component representing the site published preview component. This same preview modal is used for themes and editor previewing.
 */
export class PreviewComponent {
	private page: Page;

	/**
	 * Constructs an instance of the component.
	 *
	 * @param {Page} page The underlying page.
	 */
	constructor( page: Page ) {
		this.page = page;
	}

	/**
	 * Waits for the preview pane to be visible.
	 *
	 * @returns {Promise<void>} No return value.
	 */
	async previewReady(): Promise< void > {
		await this.page.waitForSelector( selectors.previewPane );
	}

	/**
	 * Close the preview pane.
	 *
	 * @returns {Promise<void>} No return value.
	 */
	async closePreview(): Promise< void > {
		await this.page.click( selectors.closeButton );
	}

	/**
	 * Validates that the provided text can be found in the preview content. Throws if it isn't.
	 *
	 * @param {string} text Text to search for in preview content
	 */
	async validateTextInPreviewContent( text: string ): Promise< void > {
		const frame = await this.getPreviewFrame();
		await frame.waitForSelector( `text=${ text }` );
	}

	/**
	 * Get the Iframe element handle for the preview content. This frame is the one located within the preview popup.
	 *
	 * @returns {Frame} Handle for the preview content Iframe
	 */
	private async getPreviewFrame(): Promise< Frame > {
		const elementHandle = await this.page.waitForSelector( selectors.iframe );
		return ( await elementHandle.contentFrame() ) as Frame;
	}
}

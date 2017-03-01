<?php

class EmailController {

	protected function wooCommerceIsDownloaded() {
		return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
	}

	function sendEmail($markup) {
		if ($this->wooCommerceIsDownloaded()) {
		    $emails = WC_Emails::instance();
		    return $emails->send('jgabrennan@gmail.com', 'Order', html_entity_decode($markup));
		}
		return 'no...';
	}
}
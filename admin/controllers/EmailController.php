<?php

class EmailController {

	protected function wooCommerceIsDownloaded() {
		return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
	}

	function sendEmail($markup) {
		if ($this->wooCommerceIsDownloaded()) {
		    $emails = WC_Emails::instance();
		    $message = $emails->wrap_message('Order {order_number} details', $markup);
		    return $emails->send('jgabrennan@gmail.com', 'testing john brennan', $message);
		}
		return 'no...';
	}
}
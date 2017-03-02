<?php

class EmailController {

	protected function wooCommerceIsDownloaded() {
		return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
	}

	protected function getEmailSubject($request) {
		return "Payment confirmation of " . $request['ORDERID'] . " for Dundalk Oil.";
	}

	function sendEmail($request) {
		if ($this->wooCommerceIsDownloaded() && $request['RESPONSECODE'] === 'A') {
		    $emails = WC_Emails::instance();
		    return $emails->send(
		    	urldecode($request['EMAIL']),
		    	$this->getEmailSubject($request),
		    	html_entity_decode($request['MARKUP'], ENT_COMPAT, 'UTF-8')
		    );
		}
	}
}
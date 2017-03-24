<?php

class EmailController {

	protected function wooCommerceIsDownloaded() {
		return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
	}

	protected function getEmailSubject($request) {
		return "Payment confirmation of " . $request['ORDERID'] . " for Dundalk Oil.";
	}

	function sendEmail($request) {
		    $mail = wp_mail(
		    	urldecode($request['EMAIL']),
		    	$this->getEmailSubject($request),
		    	html_entity_decode($request['MARKUP']),
		    	array('Content-Type: text/html; charset=UTF-8')
		    );
		    return $mail;
		}
}
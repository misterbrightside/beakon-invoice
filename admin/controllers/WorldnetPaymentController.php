<?php

class WorldnetPaymentController {
	protected function getTerminalId() {
		return esc_attr( get_option('terminalId') );
	}

	protected function getDate() {
		return date('d-m-Y:H:i:s:000');
	}

	protected function getCurrency() {
		return 'EUR';
	}

	protected function getReceiptPageUrl() {
		return get_site_url();
	}

	protected function getRequestUrl($gateway, $testAccount) {
		$url = 'https://';
		if($testAccount) $url .= 'test';
		switch (strtolower($gateway)) {
			case 'cashflows' : $url .= 'cashflows.worldnettps.com'; break;
			case 'payius' : $url .= 'payments.payius.com'; break;
			default :
			case 'worldnet'  : $url .= 'payments.worldnettps.com'; break;
		}
		$url .= '/merchant/paymentpage';
		return $url;
	}

	protected function getSecret() {
		return esc_attr( get_option('worldnetSecret') );
	}

	protected function getValidationUrl() {
		return '';
	}

	protected function getAuthRequestHash( $id, $amount, $date ) {
		return md5(
			$this->getTerminalId() . 
			$id .
			$amount .
			$date .
			$this->getReceiptPageUrl() .
			$this->getValidationUrl() .
			$this->getSecret()
		);
	}

	function processOrderAndGetUrlForPayment( $invoiceId, $amount, $email ) {
		$orderDetails = $this->getParamsForOrder( $invoiceId, $amount, $email );
		return array(
			'url' => $this->getPaymentUrlOfInvoice( $orderDetails ),
			'details' => $orderDetails,
		);
	}

	function isValidPayload($args) {
		return $args['HASH'] === $this->getResponseHash($args);
	}

	function getResponseHash($args) {
		return md5(
			$this->getTerminalId() . 	
			$args['ORDERID'] .
			$args['AMOUNT'] .
			$args['DATETIME'] .
			$args['RESPONSECODE'] .
			$args['RESPONSETEXT'] .
			$this->getSecret()
		);
	}

	protected function getParamsForOrder( $id, $amount, $email ) {
		$date = $this->getDate();
		return array(
			'ORDERID' => $id,
			'DATETIME' => $date,
			'EMAIL' => $email,
			'TERMINALID' => $this->getTerminalId(),
			'CURRENCY' => $this->getCurrency(),
			'RECEIPTPAGEURL' => $this->getReceiptPageUrl(),
			'AMOUNT' => $amount,
			'HASH' => $this->getAuthRequestHash($id, $amount, $date)
		);
	}

	protected function getPaymentUrlOfInvoice( $orderArgs ) {
		$isTest = '1' === esc_attr(get_option( 'isTestEnv' ));
		$requestUrl = $this->getRequestUrl('worldnet', $isTest);
		return array('url' => $requestUrl . '?' . urldecode(http_build_query($orderArgs)));
	}
}
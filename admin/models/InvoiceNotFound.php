<?php 

class InvoiceNotFound {
	static function getNotFoundObject() {
		return array(
			'invoiceId' => null,
			'salesDocument' => json_decode ("{}"),
			'customer' => json_decode ("{}"),
			'invoice' => array(),
			'invoiceStatusId' => null,
			'dateOfAttemptedPayment' => null
		);
	}
}
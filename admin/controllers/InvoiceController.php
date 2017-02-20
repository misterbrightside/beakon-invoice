<?php

class InvoiceController {
	protected $invoiceModel;

	public function __construct( $model ) {
		$this->invoiceModel = $model;
		add_action('rest_api_init', array($this, 'registerRoutes'));
	}

	function registerRoutes() {
		$namespace = 'beakon-invoices/v1';
		register_rest_route($namespace, 'invoice' . '/(?P<invoiceId>[A-Za-z0-9\-]+)',
			array(
				'methods' => 'GET',
				'callback' => array($this, 'getInvoice')
			)
		);
	}

	function getInvoice( $request ) {
		$invoiceId = $request['invoiceId'];
		// $surname = $request['surname'];
		$meta = $this->invoiceModel->getInvoiceMetaById($invoiceId);
		return $meta;
	}
}
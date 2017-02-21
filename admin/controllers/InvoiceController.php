<?php

class InvoiceController {
	protected $invoiceModel;
	protected $NAMESPACE = 'beakon-invoices/v1';

	public function __construct( $model ) {
		$this->invoiceModel = $model;
		add_action('rest_api_init', array($this, 'registerRoutes'));
	}

	function registerRoutes() {
		$this->registerGetInvoiceRoute();
	}

	protected function registerGetInvoiceRoute() {
		register_rest_route($this->NAMESPACE, 'invoice' . '/(?P<invoiceId>[A-Za-z0-9\-]+)',
			array(
				'methods' => 'GET',
				'callback' => array($this, 'getInvoice')
			)
		);
	}

	function getInvoice( $request ) {
		$invoiceId = $request['invoiceId'];
		$invoice = $this->invoiceModel->getInvoiceById($invoiceId);
		return $invoice;
	}
}
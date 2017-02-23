<?php

require_once 'WorldnetPaymentController.php';
require_once __DIR__ . '/../models/InvoiceModel.php';

class InvoiceController {
	protected $invoiceModel;
	protected $NAMESPACE = 'beakon-invoices/v1';
	protected $worldnetController;

	public function __construct() {
		$this->invoiceModel = new InvoiceModel();
		$this->worldnetController = new WorldnetPaymentController();
		add_action('rest_api_init', array($this, 'registerRoutes'));
	}

	function registerRoutes() {
		$this->registerGetInvoiceRoute();
		$this->registerGetWorldnetPaymentUrlRoute();
		$this->registerPutWorldnetPaymentStatus();
	}

	protected function registerGetInvoiceRoute() {
		register_rest_route($this->NAMESPACE, 'invoice' . '/(?P<invoiceId>[A-Za-z0-9\-]+)',
			array(
				'methods' => 'GET',
				'callback' => array($this, 'getInvoice')
			)
		);
	}

	protected function registerGetWorldnetPaymentUrlRoute() {
		register_rest_route($this->NAMESPACE, 'invoice' . '/(?P<invoiceId>[A-Za-z0-9\-]+)' . '/worldnet-payment-url',
			array(
				'methods' => 'GET',
				'callback' => array($this, 'getWorldnetPaymentUrl')
			)
		);		
	}

	protected function registerPutWorldnetPaymentStatus() {
		register_rest_route($this->NAMESPACE, 'invoice' . '/(?P<invoiceId>[A-Za-z0-9\-]+)' . '/payment',
			array(
				'methods' => 'POST',
				'callback' => array($this, 'updatePaymentStatus')
			)
		);			
	}

	function getInvoice( $request ) {
		$invoiceId = $request['invoiceId'];
		$invoice = $this->invoiceModel->getInvoiceById($invoiceId);
		return $invoice;
	}

	function getWorldnetPaymentUrl( $request ) {
		$invoiceId = $request['invoiceId'];
		$amount = $this->invoiceModel->getTotalAmountToPay( $invoiceId );
		$orderAttempt = $this->worldnetController->processOrderAndGetUrlForPayment( $invoiceId, $amount );
		$this->invoiceModel->appendToInvoiceValue($orderAttempt['details'], $invoiceId, 'paymentAttempts');
		return $orderAttempt['url'];
	}

	function updatePaymentStatus( $request ) {
		$result = $this->invoiceModel->addPaymentAttemptResponse( $request );
		return $result;
	} 
}
<?php

require_once 'WorldnetPaymentController.php';
require_once __DIR__ . '/../models/InvoiceModel.php';
require_once __DIR__ . '/../models/InvoiceNotFound.php';
require_once 'EmailController.php';


class InvoiceController {
	protected $invoiceModel;
	protected $NAMESPACE = 'beakon-invoices/v1';
	protected $worldnetController;
	protected $emailController;

	public function __construct() {
		$this->invoiceModel = new InvoiceModel();
		$this->worldnetController = new WorldnetPaymentController();
		$this->emailController = new EmailController();

		add_action( 'init', array($this, 'registerInvoiceType' ));
		add_action('rest_api_init', array($this, 'registerRoutes'));
	}

	function registerInvoiceType() {
		$args = $this->invoiceModel->getArgsForPostType();
		register_post_type( 'invoice', $args );
	}

	function registerRoutes() {
		$this->registerPostAddInvoices();
		$this->registerGetInvoiceRoute();
		$this->registerGetWorldnetPaymentUrlRoute();
		$this->registerPutWorldnetPaymentStatus();
	}

	protected function registerPostAddInvoices() {
		register_rest_route($this->NAMESPACE, 'invoice',
			array(
				'methods' => 'POST',
				'callback' => array($this, 'addInvoices')
			)
		);		
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

	function addInvoices( $request ) {
		$invoices = json_decode($request['invoices'], true);
		$response = array();
		foreach ($invoices as $invoice) {
			$id = $this->invoiceModel->addInvoice( $invoice );
			array_push($response, (array('id' => $id, 'salesInvoice' => $invoice['salesDocument']['number'])));
		}
		return json_encode($response);
	}

	function getInvoice( $request ) {
		$invoiceId = $request['invoiceId'];
		$accountCode = $request['accountCode'];
		if (substr( $invoiceId, 0, 3 ) === "SI-") $invoice = $this->invoiceModel->getInvoiceByID($invoiceId, 'invoiceId');
		else $invoice = $this->invoiceModel->getInvoiceByID($invoiceId, 'workingOrder');
		if ( $invoice !== NULL && $invoice['salesDocument']['customerCode'] === $accountCode) {
			return $invoice;
		} else {
			return InvoiceNotFound::getNotFoundObject();
		}
	}

	function getWorldnetPaymentUrl( $request ) {
		$invoiceId = $request['invoiceId'];
		$email = $request['EMAIL'];
		$amount = $this->invoiceModel->getTotalAmountToPay( $invoiceId );
		$orderAttempt = $this->worldnetController->processOrderAndGetUrlForPayment( $invoiceId, $amount, $email );
		$this->invoiceModel->appendToInvoiceValue($orderAttempt['details'], $invoiceId, 'paymentAttempts');
		return $orderAttempt['url'];
	}

	function updatePaymentStatus( $request ) {
		$result = $this->invoiceModel->addPaymentAttemptResponse( $request );
		return $this->sendPaymentRecieptEmail($request);
	} 

	function sendPaymentRecieptEmail( $request ) {
		return $this->emailController->sendEmail($request);
	} 
}
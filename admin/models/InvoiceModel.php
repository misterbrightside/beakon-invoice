<?php

require_once __DIR__ . '/../utils/unseralize-utils.php';
require_once __DIR__ . '/../controllers/WorldnetPaymentController.php';

class InvoiceModel {
	protected $worldnetPaymentController;

	public function __construct() {
		$this->worldnetPaymentController = new WorldnetPaymentController();
	}

	function getLabelsForPostType() {
		$singular = 'Invoice Record';
		$plural = 'Invoice Records';
		$add_name = 'Upload';
		$add_new_item = $add_name . ' ' . $singular;
		$not_found_in_trash = 'No ' . $plural . ' in Bin';
		
		return array(
			'name' => $plural,
			'singular' => $singular,
			'add_name' => $add_name,
			'add_new_item' => $add_new_item,
			'edit' => 'Edit',
			'edit_item' => 'Edit ' . $singular,
			'new_item' => 'New ' . $singular,
			'view' => 'View ' . $singular,
			'search_term' => 'Search ' . $plural,
			'parent' => 'Parent ' . $singular,
			'not_found' => 'No ' . $plural . ' found',
			'not_found_in_trash' => $not_found_in_trash,
		);
	}


	function getArgsForPostType() {
	$below_posts_position_in_admin_ui = 6;
	return array(
		'labels' => $this->getLabelsForPostType(),
		'public' => true,
		'publicly_queryable' => false,
		'exclude_from_search' => true,
		'show_in_nav_menus' => false,
		'show_in_admin_bar' => false,
		'show_in_menu' => true,
		'menu_position'	=> $below_posts_position_in_admin_ui,
		'can_export' => true,
		'delete_with_user' => false,
		'menu_icon' => 'dashicons-portfolio',
		'hierarchical' => false,
		'has_archive' => true,
		'query_var'	=> false,
		'capability_type' => 'page',
		'rewrite' => array(
			'slug' => 'invoices',
			'pages' => false,
			'feeds' => false,
		),
		'supports' => false,
	);
}

	public function getInvoiceByID( $id, $key ) {
		$seralizedMeta = $this->getMeta( $id, $key );
		if ($seralizedMeta !== NULL) {
			return SeralizeUtils::unserializeArrays($seralizedMeta);
		} else {
			return $seralizedMeta;
		}
	}

	public function addInvoice( $invoice ) {
		$invoiceId = $invoice['saleDoc']['NUMBER'];
		if ($this->getInvoiceByID($invoiceId, 'invoiceId') === NULL) {  
			$postId = wp_insert_post(
				array(
					'post_type' => 'invoice',
					'post_status' => 'publish',
					'post_title' => $this->getInvoiceTitle($invoice)
				)
			);
		} else {
			$postId = $this->getInternalWordPressId($invoiceId);
		}
		add_post_meta($postId, 'invoiceId', $invoice['saleDoc']['NUMBER']);
		add_post_meta($postId, 'workingOrder', $invoice['saleDoc']['REMARKS']);
		add_post_meta($postId, 'customer', $invoice['customer']);
		add_post_meta($postId, 'saleDoc', $invoice['saleDoc']);
		add_post_meta($postId, 'saleDocItems', $invoice['saleDocItems']);
		add_post_meta($postId, 'debtorAlloc', $invoice['debtorAlloc']);
		add_post_meta($postId, 'debtorEntry', $invoice['debtorEntry']);
		add_post_meta($postId, 'total', $invoice['total']);
		add_post_meta($postId, 'paid', $invoice['paid']);
		add_post_meta($postId, 'leftToPay', $invoice['leftToPay']);
		add_post_meta($postId, 'amountFree', $invoice['amountFree']);
		return $postId;
	}

	protected function getInvoiceTitle( $data ) {
		$name = $data['customer']['NAME'];
		$dateOfInvoice = $data['saleDoc']['POSTDATE'];
		$id = $data['saleDoc']['NUMBER'];
		return "$name - $dateOfInvoice - $id";
	}

	public function checkIfInvoiceExists( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id);
		return $this->queryHasAnInvoiceThatExists($query);
	}

	public function getTotalAmountToPay( $id ) {
		$invoiceDoc = $this->getInvoiceByID( $id, 'invoiceId' );
		return $invoiceDoc['leftToPay'];		
	}

	public function appendToInvoiceValue( $orderDetails, $invoiceId, $key ) {
		$internalId = $this->getInternalWordPressId( $invoiceId );
		$paymentAttempts = get_post_meta($internalId, $key, true);
		if (!is_array($paymentAttempts)) {
			$paymentAttempts = array();
		}
    	array_push($paymentAttempts, $orderDetails);
		update_post_meta($internalId, $key, $paymentAttempts);
	}

	public function getMeta( $id, $key = 'invoiceId' ) {
		$query = $this->getInvoiceQueryByInvoiceId($id, $key);
		return $this->getInvoiceMetaFromQuery($query);
	}

	public function addPaymentAttemptResponse( $request ) {
		$paymentAttemptResponse = $this->getWorldnetPayLoad($request);
		$id = $this->getInternalWordPressId($paymentAttemptResponse['ORDERID']);
		if ($this->worldnetPaymentController->isValidPayload($paymentAttemptResponse)) {
			$this->appendToInvoiceValue($paymentAttemptResponse, $paymentAttemptResponse['ORDERID'], 'paymentResponse');
		}
		return $paymentAttemptResponse;
	}

	protected function getWorldnetPayLoad( $request ) {
		return array(
			'RESPONSECODE' => $request['RESPONSECODE'],
			'DATETIME' => $request['DATETIME'],
			'RESPONSETEXT' => $request['RESPONSETEXT'],
			'AMOUNT' => $request['AMOUNT'],
			'APPROVALCODE' => $request['APPROVALCODE'],
			'CVVRESPONSE' => $request['CVVRESPONSE'],
			'EMAIL' => $request['EMAIL'],
			'HASH' => $request['HASH'],
			'ORDERID' => $request['ORDERID'],
			'RESPONSETEXT' => $request['RESPONSETEXT'],
			'UNIQUEREF' => $request['UNIQUEREF']
		);
	}

	protected function getInvoiceQueryByInvoiceId( $id, $key ) {
		$args = array(
			'numberposts'	=> -1,
			'post_type'		=> 'invoice',
			'meta_query' 	=> array(
				array(
					'key' 		=> $key,
					'value' 	=> $id,
					'compare' 	=> '='
				)
			)
		);
		return new WP_Query( $args );
	}

	protected function getInvoiceMetaFromQuery( $query ) {
		if (!$this->queryHasAnInvoiceThatExists($query)) {
			return NULL;
		} else {
			$id = $query->posts[0]->ID;
			return get_post_meta($id);
		}
	}

	protected function getInternalWordPressId( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id, 'invoiceId');
		if (!$this->queryHasAnInvoiceThatExists($query)) return NULL;
		else return $query->posts[0]->ID;
	}

	protected function queryHasAnInvoiceThatExists( $query ) {
		return $query->have_posts();
	}
}
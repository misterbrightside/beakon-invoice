<?php
require_once __DIR__ . '/../worldnet/world-net.php';

add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'add-invoices', array(
    'methods' => 'POST',
    'callback' => 'bijb_bulk_add_invoices',
    ) );
} );

// add_action( 'rest_api_init', function () {
//   register_rest_route( 'beakon-invoices/v1', 'invoices/(?P<id>\d+)', array(
//     'methods' => 'GET',
//     'callback' => 'bijb_get_invoice_with_id',
//     ) );
// } );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'pay-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_get_details_to_pay_invoice',
    ) );
} );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'update-payment-status-of-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_update_invoice',
    ) );
} );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'add-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_add_invoice',
    ) );
} );

function bijb_bulk_add_invoices( $data) {
	$invoices = json_decode($data['invoices'], true);
	$response = array();
	foreach ($invoices as $invoice) {
		if (! bijb_check_if_invoice_exists_bool( $invoice['salesDocument']['number']) && $invoice['customer'] != NULL) {
			$id = bijb_add_invoice( $invoice );
			array_push($response, (array('passed' => true, 'id' => $id, 'salesInvoice' => $invoice['salesDocument']['number'])));
		}
		else {
			array_push($response, (array('passed' => false, 'salesInvoice' => $invoice['salesDocument']['number'])));
		}
	}
	return json_encode($response);
}

function bijb_check_if_invoice_exists_bool( $invoiceId ) {
	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_query' 	=> array(
			array(
				'key' => 'invoiceId',
				'value' => $invoiceId,
				'compare' => '='
			)
		)
   );
	$query = new WP_Query( $args );
	return $query->have_posts();
}

function bijb_add_invoice( $data ) {
	$postId = wp_insert_post(array(
		'post_type' => 'invoice',
		'post_status' => 'publish',
		'post_title' => bijb_get_post_title($data)
	));
	add_post_meta($postId, 'invoiceId', $data['salesDocument']['number']);
	add_post_meta($postId, 'customer', $data['customer']);
	add_post_meta($postId, 'salesDocument', $data['salesDocument']);
	add_post_meta($postId, 'invoice', $data['invoice']);
	add_post_meta($postId, 'invoiceStatusId', 'NOT PAID');
	add_post_meta($postId, 'dateOfAttemptedPayment', 'NEVER');
	return $postId;
}

function bijb_get_post_title($data) {
	$name = $data['customer']['name'];
	$dateOfInvoice = $data['salesDocument']['postDate'];
	$id = $data['salesDocument']['number'];
	return "$name - $dateOfInvoice - $id";
}

function bijb_get_invoice_with_id( $data ) {
	$invoiceData = get_posts( array( 'id' => $data['id'], 'post_type' => 'invoice' ) );
	$invoiceMetaData = get_post_meta($data['id']);
	$data = array( 
		'invoiceData' => $invoiceData[0],
		'items' => bijb_get_from_metadata( $invoiceMetaData, 'invoice' ),
		'customer' => bijb_get_from_metadata( $invoiceMetaData, 'customer' ),
		'salesDocument' => bijb_get_from_metadata( $invoiceMetaData, 'salesDocument' ),
		'invoiceStatusId' => $invoiceMetaData['invoiceStatusId'],
		'dateOfAttemptedPayment' => $meta['dateOfAttemptedPayment'][0]
	);
	return new WP_REST_Response( $data );
}

function bijb_get_from_metadata( $invoiceMetaData, $key ) {
	if ( !isset($invoiceMetaData[$key]) ) {
		return array();
	} else {
		return unserialize($invoiceMetaData[$key][0]);
	}
}

function bijb_get_invoice($query) {
	if (!$query->have_posts()) {
		return NULL;
	} else {
		$id = $query->posts[0]->ID;
		return get_post_meta($id);
	}
}

function bijb_get_details_to_pay_invoice ( $data ) {
  $invoiceId = $data['invoiceId'];
  $amount =  bijb_get_amount_to_pay($invoiceId);
  $date = bijb_request_date_time();
  return json_encode(
    array(
      'ORDERID' => $invoiceId,
      'DATETIME' => $date,
      'requestUrl' => bijb_request_url('worldnet', true),
      'TERMINALID' => bijb_get_terminal_id(),
      'CURRENCY' => bijb_get_currency_code(),
      'RECEIPTPAGEURL' => bijb_get_receipt_page_url(),
      'AMOUNT' => $amount,
      'HASH' => bijb_auth_request_hash($invoiceId, $amount, $date)
    )
  );
}

function bijb_get_amount_to_pay($id) {
	$query = bijb_get_invoice_query($id);
	$meta = bijb_get_invoice($query);
	$items = bijb_get_from_metadata( $meta, 'invoice' );
	$total = 0;
	foreach ($items as $item) {
		$total += $item['costAmount'];
	}
	return $total;
}

function bijb_get_invoice_query($id) {
	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_key'		=> 'invoiceId',
		'meta_value'	=> $id
	);
	$query = new WP_Query( $args );
	return $query;
}

function bijb_update_invoice( $data ) {
	$invoiceIdByOrder = $data['ORDERID'];
	$query = bijb_get_invoice_query($invoiceIdByOrder);
	if ($query->have_posts()) {
		$wpID = $query->posts[0]->ID;
		$responseCode = $data['RESPONSECODE'];
		$dateOfAttemptedPayment = $data['DATETIME'];
		update_post_meta( $wpID, 'invoiceStatusId', sanitize_text_field( $responseCode ) );
		update_post_meta( $wpID, 'dateOfAttemptedPayment', sanitize_text_field( $dateOfAttemptedPayment ) );
		return true;
	}
	// 
	// $dateOfAttemptedPayment = $data['DATETIME'];
	// $hash = $data['HASH'];
	// $responseText = $data['RESPONSETEXT'];
	// $paymentReference = $data['']
	return false;
}

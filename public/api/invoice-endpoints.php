<?php
require_once __DIR__ . '/../worldnet/world-net.php';

add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'invoice-exists', array(
    'methods' => 'POST',
    'callback' => 'bijb_check_if_invoice_exists',
    ) );
} );

add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'invoices/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'bijb_get_invoice_with_id',
    ) );
} );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'pay-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_get_details_to_pay_invoice',
    ) );
} );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'update-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_update_invoice',
    ) );
} );

function bijb_check_if_invoice_exists( $data ) {
	$invoiceId = $data['invoiceId'];
	$surname = $data['surname'];

	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_query' 	=> array(
			'relation' => 'AND',
			array(
				'key' => 'invoice-id',
				'value' => $invoiceId,
				'compare' => '='
			),
			array(
				'key' => 'surname-id',
				'value' => $surname,
				'compare' => '='
			)
		)
   );
	
	$query = new WP_Query( $args );
	$meta = bijb_get_invoice($query);
	return json_encode(
		array(
			'invoiceExists' => $query->have_posts(),
			'invoice' => bijb_get_invoice($query),
			'items' => bijb_get_items_from_metadata($meta),
      )
   );
}

function bijb_get_invoice_with_id( $data ) {
	$invoiceData = get_posts( array( 'id' => $data['id'], 'post_type' => 'invoice' ) );
	$invoiceMetaData = get_post_meta($data['id']);
	$items = bijb_get_items_from_metadata( $invoiceMetaData );
	$data = array( 
		'invoiceData' => $invoiceData[0],
		'metaData' => $invoiceMetaData,
		'items' => $items
	);
	return new WP_REST_Response( $data );
}

function bijb_get_items_from_metadata( $invoiceMetaData ) {
	if ( !isset($invoiceMetaData['item_data']) ) {
		return array();
	} else {
		return unserialize($invoiceMetaData['item_data'][0]);
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
  $date = bijb_request_date_time();
  return json_encode(
    array(
      'ORDERID' => $invoiceId,
      'DATETIME' => $date,
      'requestUrl' => bijb_request_url('worldnet', true),
      'TERMINALID' => bijb_get_terminal_id(),
      'CURRENCY' => bijb_get_currency_code(),
      'RECEIPTPAGEURL' => bijb_get_receipt_page_url(),
      'AMOUNT' => '100.00',
      'HASH' => bijb_auth_request_hash($invoiceId, '100.00', $date)
    )
  );
}

function bijb_get_invoice_query($id) {
	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_key'		=> 'invoice-id',
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
		update_post_meta( $wpID, 'invoice-status-id', sanitize_text_field( $responseCode ) );
		return true;
	}
	// 
	// $dateOfAttemptedPayment = $data['DATETIME'];
	// $hash = $data['HASH'];
	// $responseText = $data['RESPONSETEXT'];
	// $paymentReference = $data['']
	return false;
}

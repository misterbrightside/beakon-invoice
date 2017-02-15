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

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'add-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_add_invoice',
    ) );
} );

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
	return $postId;
}

function bijb_get_post_title($data) {
	$name = $data['customer']['name'];
	$dateOfInvoice = $data['salesDocument']['postDate'];
	return "$name - $dateOfInvoice";
}

function bijb_check_if_invoice_exists( $data ) {
	$invoiceId = $data['invoiceId'];
	$surname = $data['surname'];

	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_query' 	=> array(
			// 'relation' => 'AND',
			array(
				'key' => 'invoiceId',
				'value' => $invoiceId,
				'compare' => '='
			)
			// ),
			// array(
			// 	'key' => 'surname-id',
			// 	'value' => $surname,
			// 	'compare' => '='
			// )
		)
   );
	
	$query = new WP_Query( $args );
	$meta = bijb_get_invoice($query);
	return json_encode(
		array(
			'invoiceExists' => $query->have_posts(),
			'customer' => bijb_get_from_metadata($meta, 'customer'),
			'invoice' => bijb_get_from_metadata($meta, 'salesDocument'),
			'items' => bijb_get_from_metadata($meta, 'invoice'),
			'invoiceStatusId' => $meta['invoiceStatusId'][0]
      )
   );
}

function bijb_get_invoice_with_id( $data ) {
	$invoiceData = get_posts( array( 'id' => $data['id'], 'post_type' => 'invoice' ) );
	$invoiceMetaData = get_post_meta($data['id']);
	$data = array( 
		'invoiceData' => $invoiceData[0],
		'items' => bijb_get_from_metadata( $invoiceMetaData, 'invoice' ),
		'customer' => bijb_get_from_metadata( $invoiceMetaData, 'customer' ),
		'salesDocument' => bijb_get_from_metadata( $invoiceMetaData, 'salesDocument' ),
		'invoiceStatusId' => $invoiceMetaData['invoiceStatusId']
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
		update_post_meta( $wpID, 'invoiceStatusId', sanitize_text_field( $responseCode ) );
		return true;
	}
	// 
	// $dateOfAttemptedPayment = $data['DATETIME'];
	// $hash = $data['HASH'];
	// $responseText = $data['RESPONSETEXT'];
	// $paymentReference = $data['']
	return false;
}

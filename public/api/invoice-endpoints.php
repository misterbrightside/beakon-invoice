<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'add-invoices', array(
    'methods' => 'POST',
    'callback' => 'bijb_bulk_add_invoices',
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

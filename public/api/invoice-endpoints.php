<?php
require_once __DIR__ . '/../worldnet/world-net.php';

add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'invoice-exists', array(
    'methods' => 'POST',
    'callback' => 'bijb_check_if_invoice_exists',
    ) );
} );

add_action( 'rest_api_init', function () { 
  register_rest_route( 'beakon-invoices/v1', 'pay-invoice', array(
    'methods' => 'POST',
    'callback' => 'bijb_get_details_to_pay_invoice',
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
	return json_encode(
		array(
			'invoiceExists' => $query->have_posts(),
			'invoice' => bijb_get_invoice($query)
      )
   );
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


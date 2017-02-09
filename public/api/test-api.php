<?php
add_action( 'rest_api_init', function () {
  register_rest_route( 'beakon-invoices/v1', 'invoice-exists', array(
    'methods' => 'POST',
    'callback' => 'my_awesome_func',
  ) );
} );


function my_awesome_func( $data ) {
	$invoiceId = $data['invoiceId'];
	$surname = $data['surname'];

	// $posts = get_posts(array(
	// 	'numberposts'	=> -1,
	// 	'post_type'		=> 'post',
	// 	'meta_query'	=> array(
	// 		'relation'		=> 'AND',
	// 		array(
	// 			'key'	 	=> 'first-name-id',
	// 			'value'	  	=> 'John'
	// 			'compare' 	=> 'IN',
	// 		),
	// 		array(
	// 			'key'	  	=> 'surname-id',
	// 			'value'	  	=> 'Brennan',
	// 			'compare' 	=> '=',
	// 		),
	// 	),
	// ));

	$args = array(
		'numberposts'	=> -1,
		'post_type'		=> 'invoice',
		'meta_key'		=> 'surname-id',
		'meta_value'	=> $surname
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
		return get_post_custom($id);
	}
}

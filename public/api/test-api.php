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
	$the_query = new WP_Query( $args );

	return $the_query->have_posts();
}

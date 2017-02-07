<?php

function bijb_get_labels_for_invoices() {
	$singular = 'Invoice Record';
	$plural = 'Invoice Records';
	$add_name = 'Upload';
	$add_new_item = $add_name . ' ' . $singular;
	$not_found_in_trash = 'No ' . $plural . ' in Bin';

	return array(
		'name' 								=> $plural,
		'singular' 						=> $singular,
		'add_name' 						=> $add_name,
		'add_new_item'				=> $add_new_item,
		'edit' 								=> 'Edit',
		'edit_item' 					=> 'Edit ' . $singular,
		'new_item'						=> 'New ' . $singular,
		'view' 								=> 'View ' . $singular,
		'search_term' 				=> 'Search ' . $plural,
		'parent' 							=> 'Parent ' . $singular,
		'not_found' 					=> 'No ' . $plural . ' found',
		'not_found_in_trash'	=> $not_found_in_trash,
	);
}

function bijb_get_args_for_invoices() {
	$below_posts_position_in_admin_ui = 6;
	return array(
		'labels' 							=> bijb_get_labels_for_invoices(),
		'public' 							=> true,
		'publicly_queryable' 	=> false,
		'exclude_from_search' => true,
		'show_in_nav_menus' 	=> false,
		'show_in_admin_bar' 	=> false,
		'show_in_menu' 				=> true,
		'menu_position'				=> $below_posts_position_in_admin_ui,
		'can_export' 					=> true,
		'delete_with_user'		=> false,
		'menu_icon' 					=> 'dashicons-portfolio',
		'hierarchical'				=> false,
		'has_archive'					=> true,
		'query_var'						=> false,
		'capability_type'			=> 'page',
		'rewrite' 						=> array(
				'slug'		=> 'invoices',
				'pages'		=> false,
				'feeds' 	=> false,
		),
		'supports'						=> false,
	);
}

function bijb_register_invoices_type() {
	$args = bijb_get_args_for_invoices();
	register_post_type( 'invoice', $args );
}

add_action( 'init', 'bijb_register_invoices_type' );

<?php

/*
	Plugin Name: Beakon Invoices
	Plugin URI: http://beakon.ie/
	Description: Beakon invoices, I will definitely need to add a better description!
	Version: 0.0.1
	Author: John Brennan
	Author URI: http://sentogue.com
	License: GPL2
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-custom-post-type.php';
require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-fields.php';
require_once plugin_dir_path( __FILE__ ) . '/public/add_templates.php';


function bijb_admin_enqueue_scripts() {
	global $pagenow, $typenow;
	if ( ( $pagenow == 'post.php' || $pagenow == 'post-new.php' ) && $typenow == 'invoice' ) {
		wp_enqueue_script( 'bijb_invoices_js', plugins_url('/admin/js/build/bundle.js', __FILE__), array(), '101010', true);
	}
}

add_action( 'admin_enqueue_scripts', 'bijb_admin_enqueue_scripts' );

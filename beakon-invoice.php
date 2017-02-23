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
require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-bulk-import.php';
require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-fields.php';
require_once plugin_dir_path( __FILE__ ) . '/public/add_templates.php';
require_once plugin_dir_path( __FILE__ ) . '/public/api/invoice-endpoints.php';

require_once plugin_dir_path( __FILE__ ) . '/admin/controllers/InvoiceController.php';
require_once plugin_dir_path( __FILE__ ) . '/admin/controllers/WorldnetPaymentController.php';
require_once plugin_dir_path( __FILE__ ) . '/admin/models/InvoiceModel.php';


function bijb_admin_enqueue_scripts() {
	global $pagenow, $typenow;
	if ( ( $pagenow == 'post.php' || $pagenow == 'post-new.php' ) && $typenow == 'invoice' ) {
		wp_enqueue_script( 'bijb_invoices_js', plugins_url('/js/build/adminBundle.js', __FILE__), array('jquery', 'jquery-ui-datepicker'), '', true);
		wp_enqueue_style( 'jquery-style', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css' );
	}
}

$x = new InvoiceController();

add_action( 'admin_enqueue_scripts', 'bijb_admin_enqueue_scripts' );

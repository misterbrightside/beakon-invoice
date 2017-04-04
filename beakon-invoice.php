<?php

/*
	Plugin Name: Beakon Invoices
	Plugin URI: http://beakon.ie/
	Description: Customised solution integrating uploaded invoices with Worldnet payments.
	Version: 0.0.1
	Author: John Brennan
	Author URI: http://sentogue.com
	License: GPL2
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-fields.php';
require_once plugin_dir_path( __FILE__ ) . '/public/add_templates.php';

require_once plugin_dir_path( __FILE__ ) . '/admin/controllers/InvoiceController.php';
require_once plugin_dir_path( __FILE__ ) . '/admin/controllers/UploadController.php';

new InvoiceController();
new UploadController();
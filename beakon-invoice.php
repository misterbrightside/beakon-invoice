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

require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-custom-post-type.php' ;
require_once plugin_dir_path( __FILE__ ) . '/admin/invoice-fields.php' ;

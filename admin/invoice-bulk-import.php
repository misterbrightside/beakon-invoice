<?php 

function register_invoice_bulk_import() {
	add_submenu_page(
		'edit.php?post_type=invoice',
		'Bulk Import Invoices',
		'Bulk Import',
		'manage_options',
		'bulk_import_invoices',
		'bijb_display_bulk_import'
	);
}

function bijb_enqueue_scripts_for_bulk_upload() {
	global $pagenow, $typenow;
	if ( ( $pagenow == 'edit.php' ) && $typenow === 'invoice' ) {
		wp_enqueue_script( 'bijb_invoicez_js', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.3/xlsx.full.min.js', array(), '', true); 
		wp_enqueue_script( 'bijb_invoices_js', plugins_url('/../js/build/bulkImportBundle.js', __FILE__), array(), '', true); 
	}
}

function bijb_display_bulk_import() {
	echo '<div id="bulk-import"></div>';
}

add_action('admin_menu', 'register_invoice_bulk_import');
add_action( 'admin_enqueue_scripts', 'bijb_enqueue_scripts_for_bulk_upload' );
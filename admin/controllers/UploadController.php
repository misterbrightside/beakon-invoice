<?php

class UploadController {
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array($this, 'loadScriptsForAdmin') );
		add_action(	'admin_menu', array($this, 'registerInvoiceBulkImport') );
		add_action( 'admin_enqueue_scripts', array($this, 'enqueueScriptsForBulkUpload') );
	}

	protected function isRelaventInvoicePage() {
		global $pagenow, $typenow;
		return ( $pagenow == 'post.php' || $pagenow == 'post-new.php' ) && $typenow == 'invoice';
	}

	function loadScriptsForAdmin() {
		if ($this->isRelaventInvoicePage()) {
			wp_enqueue_script(
				'bijb_invoices_js', 
				plugins_url('/../../js/build/adminBundle.js', __FILE__),
				array('jquery', 'jquery-ui-datepicker'),
				'',
				true
			);
			wp_enqueue_style(
				'jquery-style',
				'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css'
			);
		}
	}

	function enqueueScriptsForBulkUpload() {
		global $pagenow, $typenow;
		if ( ( $pagenow == 'edit.php' ) && $typenow === 'invoice' ) {
			wp_enqueue_script(
				'bijb_invoicez_js',
				'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.3/xlsx.full.min.js',
				array(),
				'',
				true
			); 
			wp_enqueue_script(
				'bijb_invoices_js',
				plugins_url('/../../js/build/bulkImportBundle.js', __FILE__),
				array(),
				'',
				true
			); 
		}
	}

	function getAdminTemplateForBulkUpload() {
		echo '<div id="bulk-import"></div>';
	}

	function registerInvoiceBulkImport() {
		add_submenu_page(
			'edit.php?post_type=invoice',
			'Bulk Import Invoices',
			'Bulk Import',
			'manage_options',
			'bulk_import_invoices',
			array($this, 'getAdminTemplateForBulkUpload')
		);
	}
}
<?php

require_once __DIR__ . '/../views/SettingsView.php';

class UploadController {

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array($this, 'loadScriptsForAdmin') );
		add_action(	'admin_menu', array($this, 'registerInvoicePages') );
		add_action( 'admin_enqueue_scripts', array($this, 'enqueueScriptsForBulkUpload') );
		add_action( 'admin_init', array($this, 'settingsApiInit' ));
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
		} else if ( get_current_screen()->base === 'invoice_page_settings_page_invoices' ) {
			wp_enqueue_script(
				'bijb_invoices_js', 
				plugins_url('/../../js/build/settingsPageBundle.js', __FILE__),
				array('jquery', 'jquery-ui-datepicker'),
				'',
				true
			);
		}	
	}

	function enqueueScriptsForBulkUpload() {
		if ( get_current_screen()->base === 'invoice_page_bulk_import_invoices' ) {
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


	function settingsApiInit() {
		register_setting( 'beakonInvoiceSettingsGroup', 'terminalId' );
		register_setting( 'beakonInvoiceSettingsGroup', 'worldnetSecret' );
		register_setting( 'beakonInvoiceSettingsGroup', 'isTestEnv' );
		register_setting( 'beakonInvoiceSettingsGroup', 'adminEmailInvoices' );

		add_settings_section( 'beakonInvoiceWorldnetSettings', 'Worldnet Options', array($this, 'getWorldnetOptions'), 'edit.php?post_type=invoice');

		add_settings_field('worldnetTerminalId', 'Worldnet Terminal Id', array($this, 'getWorldnetId'), 'edit.php?post_type=invoice', 'beakonInvoiceWorldnetSettings');
		add_settings_field('worldnetTestEnv', 'Is Test Enviornment?', array($this, 'getTestEnv'), 'edit.php?post_type=invoice', 'beakonInvoiceWorldnetSettings');
		add_settings_field('worldnetSecret', 'Worldnet Secret', array($this, 'getWorldnetSecret'), 'edit.php?post_type=invoice', 'beakonInvoiceWorldnetSettings');
		add_settings_field('adminEmailInvoices', 'Admin Email for orders', array($this, 'getAdminEmail'), 'edit.php?post_type=invoice', 'beakonInvoiceWorldnetSettings');
	}

	function getSettingsTemplate() {
		SettingsView::getTemplate();
	}

	function getPaymentsTemplate() {
		SettingsView::getPaymentsTemplate();
	}

	function getWorldnetOptions() {
		echo SettingsView::getFieldInfo();
	}

	function getWorldnetSecret() {
		$secret = esc_attr( get_option('worldnetSecret') );
		echo "<input type='password' name='worldnetSecret' value='$secret' placeholder='Secret' />";		
	}

	function getAdminEmail() {
		$email = esc_attr( get_option('adminEmailInvoices') );
		echo "<input type='email' name='adminEmailInvoices' value='$email' placeholder='Email' />";
	}

	function getTestEnv() {
		?>
		<input name="isTestEnv" type="checkbox" value="1" <?php checked( '1', get_option( 'isTestEnv' ) ); ?> />
		<?php		
	}

	function getWorldnetId() {
		$id = esc_attr( get_option('terminalId') );
		echo "<input type='text' name='terminalId' value='$id' placeholder='Terminal Id' />";
	}

	function registerInvoicePages() {
		add_submenu_page(
			'edit.php?post_type=invoice',
			'Bulk Import Invoices',
			'Bulk Import',
			'manage_options',
			'bulk_import_invoices',
			array($this, 'getAdminTemplateForBulkUpload')
		);
		add_submenu_page(
			'edit.php?post_type=invoice',
			'Invoice Settings',
			'Settings',
			'manage_options',
			'settings_page_invoices',
			array($this, 'getSettingsTemplate')
		);
		add_submenu_page(
			'edit.php?post_type=invoice',
			'Payment History',
			'Payment History',
			'manage_options',
			'payments_page_invoices',
			array($this, 'getPaymentsTemplate')
		);
	}
}
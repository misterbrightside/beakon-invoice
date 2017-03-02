<?php 

class SettingsView {
	static function getTemplate() {
		?>
			<form method='post' action='options.php'>
			<?php settings_errors() ?>
			<?php settings_fields('beakonInvoiceSettingsGroup') .
				do_settings_sections('edit.php?post_type=invoice') . 
				submit_button() ?>
			</form>
		<?php
	}

	static function getFieldInfo() {
		return "<div>Enter in the information relating to your enviornment of Worldnet Portal.</div>";
	}
}
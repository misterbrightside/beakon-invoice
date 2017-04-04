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

	static function getPaymentsTemplate() {
		$payments = SettingsView::getPayments();
		?>
			<table class="widefat fixed" cellspacing="0">
				<thead>
					<tr>
						<th id="cb" class="manage-column column-cb" scope="col">RESPONSE CODE</th>
						<th id="columnname" class="manage-column column-columnname" scope="col">DATE TIME</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">RESPONSE TEXT</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">AMOUNT €</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">APPROVAL CODE</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">CVV RESPONSE</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">EMAIL</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">HASH</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">ORDERID</th>
						<th id="columnname" class="manage-column column-columnname num" scope="col">UNIQUEREF</th>
					</tr>
				</thead>
				<tbody>
				<?php
					if ($payments->have_posts()) {
						while ($payments->have_posts()) {
							$payments->the_post();
							$id = get_the_ID();
							$res = get_post_meta($id, 'paymentResponse', true);
							if (is_array($res)) {
								foreach ($res as $value) {
									echo '<tr>';
									foreach ($value as $key => $val) {
										echo '<td class="column-columnname">' . urldecode($val) . '</td>';
									}
									echo '</tr>';
								}
							}
						}
					}
				?>
				</tbody>
			</table>
		<?php
	}

	static function getPayments() {
		$args = array(
			'numberposts'	=> -1,
			'posts_per_page' => -1,
			'post_type'		=> 'invoice',
			'meta_query' => array(
				'key' => 'paymentResponse'
			)
		);
		return new WP_Query( $args );
	}

	static function getFieldInfo() {
		return "<div>Enter in the information relating to your enviornment of Worldnet Portal.</div>";
	}
}
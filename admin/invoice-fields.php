<?php

function bijb_add_user_info_metabox() {
	add_meta_box(
		'user-info-fields',
		'User Information',
		'bijb_user_template',
		'invoice',
		'normal',
		'core'
	);

  add_meta_box(
    'invoice-info-fields',
    'Invoice Information',
    'bijb_invoice_template',
    'invoice',
    'normal',
    'core'
  );
}

function bijb_get_input_tag( $id, $title, $input) {
	return "
		<div class='meta-row'>
			<div class='meta-th'>
				<label for='$id' class='bijb-row-title'>$title</label>
			</div>
			<div class='meta-td'>$input</div>
		</div>
	";
}

function bijb_get_text_input( $id, $value, $classes = '') {
	return "<input type='text' name='$id' id='$id' value='$value' class='$classes' />";
}

function bijb_get_value( $meta, $id ) {
	if ( ! empty( $meta[ $id ] ) ) {
		return esc_attr( $meta[ $id ][0] );
	} else {
		return '';
	}
}

function bijb_get_first_name( $meta ) {
	return bijb_get_input_tag(
		'first-name-id',
		'First Name',
		bijb_get_text_input(
			'first-name-id',
			bijb_get_value( $meta, 'first-name-id' )
		)
	);
}

function bijb_get_invoice_id( $meta ) {
  return bijb_get_input_tag(
    'invoice-id',
    'Invoice Reference',
    bijb_get_text_input(
      'invoice-id',
      bijb_get_value( $meta, 'invoice-id' )
    )
  );
}

function bijb_get_invoice_status ( $meta ) {
  return bijb_get_input_tag(
    'invoice-status-id',
    'Invoice Status',
    bijb_get_text_input(
      'invoice-status-id',
      bijb_get_value( $meta, 'invoice-status-id' )
    )
  );
}

function bijb_get_invoice_date_issue( $meta ) {
  return bijb_get_input_tag(
    'invoice-date-issued-id',
    'Invoice Issue Date',
    bijb_get_text_input(
      'invoice-date-issued-id',
      bijb_get_value( $meta, 'invoice-date-issued-id' ),
      'datepicker'
    )
  );
}

function bijb_get_surname( $meta ) {
	return bijb_get_input_tag(
		'surname-id',
		'Surname',
		bijb_get_text_input(
			'surname-id',
			bijb_get_value( $meta, 'surname-id' )
		)
	);
}

function bijb_get_address_line( $meta, $number ) {
	return bijb_get_input_tag(
		"address-line-$number-id",
		"Address Line $number",
		bijb_get_text_input(
			"address-line-$number-id",
			bijb_get_value( $meta, "address-line-$number-id" )
		)
	);
}

function bijb_get_county( $meta ) {
	return bijb_get_input_tag(
		'county-id',
		'County',
		bijb_get_text_input(
			'county-id',
			bijb_get_value( $meta, 'county-id' )
		)
	);
}

function bijb_user_template( $invoice ) {
	wp_nonce_field( basename( __FILE__ ), 'dijb_invoices_nonce' );
	$bijb_stored_meta = get_post_meta( $invoice -> ID );
	echo '<div>'
		. bijb_get_first_name( $bijb_stored_meta )
		. bijb_get_surname( $bijb_stored_meta )
		. bijb_get_address_line( $bijb_stored_meta, '1' )
		. bijb_get_address_line( $bijb_stored_meta, '2' )
		. bijb_get_address_line( $bijb_stored_meta, '3' )
		. bijb_get_county( $bijb_stored_meta )
		. '</div>';
}

function bijb_invoice_template( $invoice ) {
  wp_nonce_field( basename( __FILE__ ), 'dijb_invoices_nonce' );
  $bijb_stored_meta = get_post_meta( $invoice -> ID );
  echo '<div>'
    . bijb_get_invoice_id( $bijb_stored_meta )
    . bijb_get_invoice_status( $bijb_stored_meta )
    . bijb_get_invoice_date_issue( $bijb_stored_meta )
    . '</div>';
}

function bijb_is_valid_nonce() {
	return ( isset( $_POST['dijb_invoices_nonce'] ) && wp_verify_nonce( $_POST['dijb_invoices_nonce'], basename( __FILE__ ) ) ) ? 'true' : 'false';
}

function bijb_save_field( $invoice_id, $id ) {
	if ( isset( $_POST[ $id ] ) ) {
		update_post_meta( $invoice_id, $id, sanitize_text_field( $_POST[ $id ] ) );
	}
}

function bijb_save_user_metadata( $invoice_id ) {
	$is_autosave = wp_is_post_autosave( $invoice_id );
	$is_revision = wp_is_post_revision( $invoice_id );
	if ( $is_autosave || $is_revision || ! bijb_is_valid_nonce() ) {
		return;
	}

	bijb_save_field( $invoice_id, 'first-name-id' );
	bijb_save_field( $invoice_id, 'surname-id' );
	bijb_save_field( $invoice_id, 'address-line-1-id' );
	bijb_save_field( $invoice_id, 'address-line-2-id' );
	bijb_save_field( $invoice_id, 'address-line-3-id' );
	bijb_save_field( $invoice_id, 'county-id' );
}

function bijb_save_invoice_data( $invoice_id ) {
  $is_autosave = wp_is_post_autosave( $invoice_id );
  $is_revision = wp_is_post_revision( $invoice_id );
  if ( $is_autosave || $is_revision || ! bijb_is_valid_nonce() ) {
    return;
  }

  bijb_save_field( $invoice_id, 'invoice-id' );
  bijb_save_field( $invoice_id, 'invoice-status-id' );
}

function bijb_save_metadata( $invoice_id ) {
  bijb_save_user_metadata( $invoice_id );
  bijb_save_invoice_data( $invoice_id );
}

add_action( 'save_post', 'bijb_save_metadata' );
add_action( 'add_meta_boxes', 'bijb_add_user_info_metabox' );

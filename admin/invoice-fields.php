<?php

function bijb_add_invoice_metaboxes() {
  add_meta_box(
    'invoice-info-fields',
    'Invoice Information',
    'bijb_invoice_template',
    'invoice',
    'normal',
    'core'
  );

   add_meta_box(
    'user-details-fields',
    'Real User Information',
    'bijb_user_info_template',
    'invoice',
    'normal',
    'core'
  );


   add_meta_box(
    'items-details-fields',
    'Real User Information',
    'bijb_items_info_template',
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

function fromCamelCase($camelCaseString) {
        $re = '/(?<=[a-z])(?=[A-Z])/x';
        $a = preg_split($re, $camelCaseString);
        return join($a, " " );
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

function bijb_user_info_template( $invoice ) {
	wp_nonce_field( basename( __FILE__ ), 'dijb_invoices_nonce' );
	$bijb_stored_meta = get_post_meta( $invoice -> ID );
	$userInfo = x($bijb_stored_meta, 'customer');
	foreach ($userInfo as $key => $value) {
		echo bijb_get_input_tag($key, fromCamelCase($key), bijb_get_text_input($key, $value));
	}
}

function bijb_items_info_template( $invoice ) {
	wp_nonce_field( basename( __FILE__ ), 'dijb_invoices_nonce' );
	$bijb_stored_meta = get_post_meta( $invoice -> ID );
	$items = x($bijb_stored_meta, 'invoice');
	foreach ($items as $item) {
		foreach ($item as $key => $value) {
			echo bijb_get_input_tag($key, fromCamelCase($key), bijb_get_text_input($key, $value));
		}
    echo '<div><hr /></div>';
	}
}

function x( $invoiceMetaData, $key ) {
	if ( !isset($invoiceMetaData[$key]) ) {
		return array();
	} else {
		return unserialize($invoiceMetaData[$key][0]);
	}
}

function bijb_invoice_template( $invoice ) {
  wp_nonce_field( basename( __FILE__ ), 'dijb_invoices_nonce' );
  $bijb_stored_meta = get_post_meta( $invoice -> ID );
  $salesDocument = x($bijb_stored_meta, 'salesDocument');
  foreach ($salesDocument as $key => $value) {
  	echo bijb_get_input_tag($key, fromCamelCase($key), bijb_get_text_input($key, $value));
  }
}

function bijb_is_valid_nonce() {
	return ( isset( $_POST['dijb_invoices_nonce'] ) && wp_verify_nonce( $_POST['dijb_invoices_nonce'], basename( __FILE__ ) ) ) ? 'true' : 'false';
}

function bijb_save_field( $invoice_id, $id ) {
	if ( isset( $_POST[ $id ] ) ) {
		update_post_meta( $invoice_id, $id, sanitize_text_field( $_POST[ $id ] ) );
	}
}

function save_array_values_to_meta( $invoice_id, $arrayKey, $values ) {
  if ($values != NULL) {
  	foreach ($values as $key => $value) {
  		if ( isset( $_POST[ $key ] ) ) {
  			$values[$key] = sanitize_text_field( $_POST[ $key ] );
  		}
  		update_post_meta( $invoice_id, $arrayKey, $values );
  	}
  }
}

function bijb_save_all_metadata( $invoice_id, $key ) {
	$is_autosave = wp_is_post_autosave( $invoice_id );
	$is_revision = wp_is_post_revision( $invoice_id );
	if ( $is_autosave || $is_revision || ! bijb_is_valid_nonce() ) {
		return;
	}
	$bijb_stored_meta = get_post_meta( $invoice_id );
	$userInfo = x($bijb_stored_meta, $key);
	save_array_values_to_meta($invoice_id, $key, $userInfo);
}

function bijb_save_invoice_data( $invoice_id ) {
  $is_autosave = wp_is_post_autosave( $invoice_id );
  $is_revision = wp_is_post_revision( $invoice_id );
  if ( $is_autosave || $is_revision || ! bijb_is_valid_nonce() ) {
    return;
  }

}

function bijb_save_items_data( $invoice_id ) {
  $is_autosave = wp_is_post_autosave( $invoice_id );
  $is_revision = wp_is_post_revision( $invoice_id );
  if ( $is_autosave || $is_revision || ! bijb_is_valid_nonce() ) {
    return;
  }
  if (isset($_POST['item_data'])){
        $data = $_POST['item_data'];
        update_post_meta($invoice_id, 'item_data', $data);
    } else {
        delete_post_meta($invoice_id, 'item_data');
    }
}

function bijb_save_metadata( $invoice_id ) {
  bijb_save_all_metadata( $invoice_id, 'customer' );
  bijb_save_all_metadata( $invoice_id, 'salesDocument' );
  if (isset($_POST['number'])){
    $data = $_POST['number'];
    update_post_meta($invoice_id, 'invoiceId', $data);
  }
  // bijb_save_all_metadata( $invoice_id, 'customer' );
}

add_action( 'save_post', 'bijb_save_metadata' );
add_action( 'add_meta_boxes', 'bijb_add_invoice_metaboxes' );

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
}

function bijb_get_input_tag($id, $title, $input) {
	return "
		<div class='meta-row'>
			<div class='meta-th'>
				<label for='$id' class='bijb-row-title'>$title</label>
			</div>
			<div class='meta-td'>$input</div>
		</div>
	";
}

function bijb_get_text_input($id) {
	return "<input type='text' name='$id' id='$id' value='' />";
}

function bijb_user_template() {
	echo '<div>'
		. bijb_get_input_tag('first-name-id', 'First Name', bijb_get_text_input( 'first-name-id' ))
		. bijb_get_input_tag('surname-id', 'Surname', bijb_get_text_input( 'surname-id' ))
		. bijb_get_input_tag('address-line-1-id', 'Address Line 1', bijb_get_text_input( 'address-line-1-id' ))
		. bijb_get_input_tag('address-line-2-id', 'Address Line 2', bijb_get_text_input( 'address-line-2-id' ))
		. bijb_get_input_tag('address-line-3-id', 'Address Line 3', bijb_get_text_input( 'address-line-3-id' ))
		. '</div>';
}

add_action( 'add_meta_boxes', 'bijb_add_user_info_metabox' );

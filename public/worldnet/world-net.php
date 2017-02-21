<?php
function bijb_request_date_time() {
  return date('d-m-Y:H:i:s:000');
}

function bijb_generate_unique_order_id() {
  $seconds = date('H')*3600+date('i')*60+date('s');
  return date('zy') . $seconds;
}

function bijb_request_url($gateway, $testAccount) {
  $url = 'https://';
  if($testAccount) $url .= 'test';
  switch (strtolower($gateway)) {
    case 'cashflows' : $url .= 'cashflows.worldnettps.com'; break;
    case 'payius' : $url .= 'payments.payius.com'; break;
    default :
    case 'worldnet'  : $url .= 'payments.worldnettps.com'; break;
  }
  $url .= '/merchant/paymentpage';
  return $url;
}

function bijb_get_terminal_id() {
  return '3125001';
}

function bijb_get_currency_code() {
  return 'EUR';
}

function bijb_get_receipt_page_url() {
  return get_site_url();
}

function bijb_get_secret_for_payment() {
  return 'hellohello';
}

function bijb_get_validation_url() {
  return '';
}

function bijb_auth_request_hash($orderId, $amount, $date) {
  $terminalId = bijb_get_terminal_id();
  $secret = bijb_get_secret_for_payment();
  $receiptPageURL = bijb_get_receipt_page_url();
  $validationURL = bijb_get_validation_url();
  return md5($terminalId . $orderId . $amount . $date . $receiptPageURL . $validationURL . $secret);
}
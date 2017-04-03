<?php

class EmailController {

	protected function maybeDiv($prop) {
		if ($prop !== 'undefined') {
			return '<div>'. $prop .'</div>';
		} else {
			return '';
		}
	}

	protected function getAdminEmailTemplate(
		$orderId, $date, $quant, $budget, $fname,
		$company, $phone, $add1, $add2, $town,
		$county, $eircode
	) {
		return '
		<tbody>
			<tr class="m_1957739370323737485top gmail_msg">
				<td colspan="2" style="padding:5px;vertical-align:top" class="gmail_msg">
					<table style="width:100%;line-height:inherit;text-align:center" class="gmail_msg">
						<tbody>
							<tr class="gmail_msg">
								<td class="m_1957739370323737485title gmail_msg">
									<img src="https://ci3.googleusercontent.com/proxy/X2BNGAK_GWwbodG5aJJY4TUn6THAdqhIsKNBpVm1iBVshF-Vi26WG7xIeX9zdq-P7PMFNgZj2BoMdfusHkLeXMD2-3TEf9JKcx8TG-Y-K-HztlmavA=s0-d-e1-ft#http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png" style="width:100%;max-width:500px;border:none;display:inline;font-size:14px;font-weight:bold;height:auto;line-height:100%;outline:none;text-decoration:none;text-transform:capitalize" class="gmail_msg">
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<div style="width:70%;margin:auto;background:#f1f1f2;padding:25px;text-align:center;margin-top:1em;margin-bottom:5em;">
				<div style="color:#e52025;font-size:3.6rem;font-weight:bolder;margin-top:1em;margin-bottom:.5em;">
					A paid order has been recieved
				</div>
				<div style="font-size:1.5em;">Order No: <span style="font-weight:900;">#' . $orderId . '</span></div>
				<div style="text-align:center;font-size:1.5em;">
					<p>The online order was received on <span style="font-weight:900;">' . $date . '</span></p>
					<p>A member of staff will need to confirm the order, and arrange delivery.</p>
				</div>
				<div style="text-align:center;font-size:1.5em;margin:10px 0;">
					<div style="font-weight:900;font-size:1.2em;margin:15px 0;">Customer Order Details:</div>
					<div style="margin:15px 0;">'. $ftype .' x ' . $quant . 'L</div><div style="margin:15px 0;">€' . $budget . ' (inc. VAT)</div>
					<div style="margin:15px 0;"><span style="color:#e41f24;font-weight:900;">
						<span>Payment to be arranged</span></span>
					</div>
				</div>
				<div style="text-align:center;font-size:1.5em;margin:10px 0;">
					<div style="font-weight:900;font-size:1.2em;margin:15px 0;">Delivery Details:</div>
					'. 	$this->maybeDiv($fname) .
						$this->maybeDiv($company) .
						$this->maybeDiv($add1) .
						$this->maybeDiv($add2) .
						$this->maybeDiv($town) .
						$this->maybeDiv($county) .
						$this->maybeDiv($eircode) .
						$this->maybeDiv($phone) . '
				</div>
				<div style="margin-top:40px;width:50%;margin:auto;text-align:center;color:#808080;">
					<img style="width:50%;margin:10px 0;" src="http://dundalkoil.beakon.ie/wp-content/uploads/2017/02/texaco-logo-1.png">
					<address style="margin:10px 0;font-style:normal;">
						Dundalk Oil Products, Brewery Business Park, Ardee Rd, Co. Louth, A91 ABCD.
					</address>
					<div>Tel: 042 933 4081 Web: dundalkoil.ie</div>
					<div>Email: info@dundalkoil.ie</div>
				</div>
			</div>
		</tbody>
		';
	}

	protected function wooCommerceIsDownloaded() {
		return in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) );
	}

	protected function getEmailSubject($request) {
		return "Payment confirmation of " . $request['ORDERID'] . " for Dundalk Oil.";
	}

	function sendEmail($request) {
	    $userMail = wp_mail(
	    	urldecode($request['EMAIL']),
	    	$this->getEmailSubject($request),
	    	html_entity_decode($request['MARKUP']),
	    	array('Content-Type: text/html; charset=UTF-8')
	    );
	    $adminEmailTemplate = $this->getAdminEmailTemplate(
	    	$request['ORDERID'], $request['date'], $request['quant'], $request['budget'], $request['fname'],
	    	$request['company'], $request['phone'], $request['add1'], $request['add2'], $request['town'],
	    	$request['county'], $request['eircode']
	    );
	    $adminMail = wp_mail(
	    	urldecode(get_option('adminEmailInvoices')),
	    	"Dundalk Oil 'Pay NOW' Quote Recieved",
	    	$adminEmailTemplate,
	    	array('Content-Type: text/html; charset=UTF-8')
	    );
	    return $adminMail && $userMail;
	}
}
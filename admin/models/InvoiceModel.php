<?php

require_once __DIR__ . '/../utils/unseralize-utils.php';
require_once 'InvoiceNotFound.php';


class InvoiceModel {

	public function getInvoiceById( $id ) {
		$seralizedMeta = $this->getMeta( $id );
		if ($seralizedMeta !== NULL) {
			return SeralizeUtils::unserializeArrays($seralizedMeta);
		} else {
			return InvoiceNotFound::getNotFoundObject();
		}
	}

	public function checkIfInvoiceExists( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id);
		return $this->queryHasAnInvoiceThatExists($query);
	}

	public function getItemsOfInvoice( $id ) {
		$invoiceDoc = $this->getInvoiceById( $id );
		return $invoiceDoc['invoice'];
	}

	public function getTotalAmountToPay( $id ) {
		$items = $this->getItemsOfInvoice($id);
		$total = 0;
		foreach ($items as $item) {
			$total += $item['costAmount'];
		}
		return $total;
	}

	public function appendToInvoiceValue( $orderDetails, $invoiceId, $key ) {
		$internalId = $this->getInternalWordPressId( $invoiceId );
		$paymentAttempts = get_post_meta($internalId, $key, true);
		if (!is_array($paymentAttempts)) {
			$paymentAttempts = array();
		}
    	array_push($paymentAttempts, $orderDetails);
		update_post_meta($internalId, $key, $paymentAttempts);
	}

	public function getMeta( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id);
		return $this->getInvoiceMetaFromQuery($query);
	}

	protected function getInvoiceQueryByInvoiceId( $id ) {
		$args = array(
			'numberposts'	=> -1,
			'post_type'		=> 'invoice',
			'meta_query' 	=> array(
				array(
					'key' 		=> 'invoiceId',
					'value' 	=> $id,
					'compare' 	=> '='
				)
			)
		);
		return new WP_Query( $args );
	}

	protected function getInvoiceMetaFromQuery( $query ) {
		if (!$this->queryHasAnInvoiceThatExists($query)) {
			return NULL;
		} else {
			$id = $query->posts[0]->ID;
			return get_post_meta($id);
		}
	}

	protected function getInternalWordPressId( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id);
		if (!$this->queryHasAnInvoiceThatExists($query)) return NULL;
		else return $query->posts[0]->ID;
	}

	protected function queryHasAnInvoiceThatExists( $query ) {
		return $query->have_posts();
	}
}
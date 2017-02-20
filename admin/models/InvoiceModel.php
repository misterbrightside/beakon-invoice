<?php

require_once __DIR__ . '/../utils/unseralize-utils.php';


class InvoiceModel {

	public function getInvoiceMetaById( $id ) {
		$query = $this->getInvoiceQueryByInvoiceId($id);
		$seralizedMeta = $this->getInvoiceMetaFromQuery($query);
		return SeralizeUtils::unserializeArrays($seralizedMeta);
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

	protected function queryHasAnInvoiceThatExists( $query ) {
		return $query->have_posts();
	}
}
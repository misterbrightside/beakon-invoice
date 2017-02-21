<?php

class SeralizeUtils {
	protected static function isSerialized($str) {
    	return ($str == serialize(false) || @unserialize($str) !== false);
	}

	// Input => array of arrays with mixed seralized and single values.
	public static function unserializeArrays( $arrayObject ) {
		$unserializedObject = array();
		foreach ($arrayObject as $key => $value) {
			if (SeralizeUtils::isSerialized($value[0])) {
				$unserializedObject[$key] = unserialize($value[0]);
			} else {
				$unserializedObject[$key] = $value[0];
			}
		}
		return $unserializedObject;
	}
}
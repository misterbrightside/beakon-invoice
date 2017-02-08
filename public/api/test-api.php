<?php
//
// echo json_encode(array('value' => 42));
//
// <?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];

//file_get_contents('php://input'))
echo json_encode($_POST);

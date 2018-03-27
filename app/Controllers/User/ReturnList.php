<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Issue.php';

use App\Models\Issue;

if (isset($_SESSION['user'])) {
	$returnIssues = new Issue();
	echo json_encode($returnIssues->getToReturnList($_SESSION['user']['id']));
}
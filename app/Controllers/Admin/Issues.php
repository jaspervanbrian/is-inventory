<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Issue.php';

use App\Models\Issue;

$issues = new Issue();

if (isset($_POST['page'])) {
	echo json_encode($issues->getIssues((int)$_POST['page']));
}

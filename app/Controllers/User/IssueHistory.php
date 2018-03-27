<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Issue.php';

use App\Models\Issue;

$issues = new Issue();

if (isset($_SESSION['user']) && isset($_POST['page'])) {
	echo json_encode($issues->getIssueHistory($_SESSION['user']['id'], (int)$_POST['page']));
}

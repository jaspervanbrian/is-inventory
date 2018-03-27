<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Issue.php';

use App\Models\Issue;

$stocks = new Issue();

if (isset($_SESSION['user'])) {
	echo $stocks->getIssueHistoryPages($_SESSION['user']['id']);
}

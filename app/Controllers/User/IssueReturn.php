<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Stock.php';
require_once '../../Models/Issue.php';

use App\Models\Stock;
use App\Models\Issue;

$stock = new Stock();

if (isset($_POST['issue_id']) && isset($_POST['stock_id']) && isset($_SESSION['user'])) {
	$issue = new Issue();
	$is_returned = $issue->issueReturn($_POST['issue_id'], $_POST['stock_id'], $_SESSION['user']['id'], $_POST['additional_info']);
	if ($is_returned) {
		$_SESSION['return'] = "err";
	} else {
		$stock->returnItem($_POST['stock_id']);
		$_SESSION['return'] = "ok";
	}
	header('Location: ../../../Views/user/home.php');
}
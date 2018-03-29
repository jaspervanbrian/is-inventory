<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Stock.php';
require_once '../../Models/Issue.php';

use App\Models\Stock;
use App\Models\Issue;

$stock = new Stock();

if (isset($_POST['stock_id']) && isset($_SESSION['user'])) {
	$is_borrowed = $stock->borrow($_POST['stock_id']);
	if ($is_borrowed){
		$_SESSION['borrow'] = "err";
	} else {
		$issue = new Issue();
		$issue->issueBorrow($_POST['stock_id'], $_SESSION['user']['id'], $_POST['additional_info']);
		$_SESSION['borrow'] = "ok";
	}
	header('Location: ../../../Views/user/home.php');
}
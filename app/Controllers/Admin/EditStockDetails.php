<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Stock.php';

use App\Models\Stock;

$stock = new Stock();

if (isset($_POST['id']) &&
	isset($_POST['sticker_number']) &&
	isset($_POST['name']) &&
	isset($_POST['category']) &&
	isset($_POST['status']) &&
	isset($_POST['owner']) &&
	isset($_POST['supplier']) &&
	isset($_POST['acquisition_date']) &&
	isset($_POST['description']) &&
	isset($_POST['depreciation_info'])
) {
	$is_updated = $stock->update($_POST['id'], $_POST['sticker_number'], $_POST['name'], $_POST['category'], $_POST['status'], $_POST['owner'], $_POST['supplier'], $_POST['acquisition_date'], $_POST['description'], $_POST['depreciation_info']);
	if ($is_updated) {
		$_SESSION['update'] = "ok";
	} else {
		$_SESSION['update'] = "err";
	}
	header('Location: ../../../Views/admin/dashboard.php');
}
<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Stock.php';

use App\Models\Stock;

$stocks = new Stock();
if (isset($_POST['page'])) {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], $_POST['step']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], $_POST['orderby'], "ASC"));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", $_POST['step']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], (int)$_POST['page'], "name", "ASC"));
		}
	}
} else {
	if (isset($_POST['orderby'])) {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], $_POST['step']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, $_POST['orderby'], "ASC"));
		}
	} else {
		if (isset($_POST['step'])) {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, "name", $_POST['step']));
		} else {
			echo json_encode($stocks->getInventory($_POST['type'], $_POST['keyword'], 1, "name", "ASC"));
		}
	}
}

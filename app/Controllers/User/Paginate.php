<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Stock.php';

use App\Models\Stock;

$stocks = new Stock();

echo $stocks->getInventoryPages($_POST['type'], $_POST['keyword']);

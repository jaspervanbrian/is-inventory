<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/User.php';

use App\Models\User;

$users = new User();

if (isset($_SESSION['user']) && isset($_POST['page'])) {
	echo json_encode($users->adminList($_SESSION['user']['id'], (int)$_POST['page']));
}

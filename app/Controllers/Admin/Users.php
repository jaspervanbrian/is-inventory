<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/User.php';

use App\Models\User;

$users = new User();

if (isset($_POST['page'])) {
	echo json_encode($users->userList((int)$_POST['page']));
}

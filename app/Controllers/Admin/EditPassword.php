<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/User.php';

use App\Models\User;

$user = new User();

if (isset($_POST['id']) && isset($_POST['password'])) {
	$is_updated = $user->updatePassword($_POST['id'], $_POST['password']);
	if ($is_updated === true) {
		echo "ok";
	}
}
<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/User.php';

use App\Models\User;

$user = new User();

if (isset($_POST['id']) &&
	isset($_POST['name']) &&
	isset($_POST['username']) &&
	isset($_POST['email_address']) &&
	isset($_POST['role'])
) {
	$is_updated = $user->updateCredentials($_POST['id'], $_POST['name'], $_POST['username'], $_POST['email_address'], $_POST['role']);
	if ($is_updated === true) {
		echo "ok";
	} else {
		if ($is_updated === "usernameTaken") {
			echo "usernameTaken";
		} else if ($is_updated === "emailTaken") {
			echo "emailTaken";
		} else {
			echo "err";
		}
	}
}
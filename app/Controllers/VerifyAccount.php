<?php

require '../Database/Connection.php';

use App\Database\Connection;

session_start();

try {
	$connection = new Connection();
	$connection->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	if (isset($_POST['username']) && isset($_POST['password'])) {
		$stmt = $connection->connection->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
		$stmt->bindParam(':username', $username);
		$username = $_POST['username'];
		$stmt->execute();
		if ($stmt->rowCount() <= 0) {
			echo "Invalid";
		} else {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if ($user['password'] === $_POST['password']) {
				$_SESSION['user'] = [
					'name' => $user['name'],
					'username' => $user['username'],
					'email_address' => $user['email_address'],
					'role' => $user['role'],
				];
				echo "Success";
			} else {
				echo "Invalid";
			}
		}
	} else {
		echo "Invalid";
	}
} catch (PDOException $e) {
	echo "DBError";
}
<?php

namespace App\Database;

class Connection
{
	public $db_connection;
	public function __construct()
	{
		$server = "localhost";
		$db = "is_inventory";
		$username = "root";
		$password = "";

		$this->db_connection = new \PDO("mysql:host={$server};dbname={$db}", $username, $password);
	}
}

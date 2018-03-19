<?php

namespace App\Database;

class Connection
{
	public $connection;
	public function __construct()
	{
		$server = "localhost";
		$db = "is_inventory";
		$username = "root";
		$password = "weedonthecouch1234";

		$this->connection = new \PDO("mysql:host={$server};dbname={$db}", $username, $password);
	}
}

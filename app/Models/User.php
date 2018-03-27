<?php

namespace App\Models;

/**
 * summary
 */
class User
{
    /**
     * summary
     */
    public $username;
    public $name;
	public $email_address;
	public $role;
	public $password;

    public function __construct($username, $name, $email_address, $role, $password)
    {
        $this->username = $username;
        $this->name = $name;
        $this->email_address = $email_address;
        $this->role = $role;
        $this->password = $password;
    }
}
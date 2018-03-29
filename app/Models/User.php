<?php

namespace App\Models;

use App\Database\Connection;
/**
 * summary
 */
class User
{
    /**
     * summary
     */
    private $connection;

    public function __construct()
    {
        $this->connection = new Connection();
    }
    public function create($name, $username, $email_address, $role, $password)
    {
        $name = trim($name);
        $username = trim($username);
        $email_address = trim($email_address);

        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        if ($stmt->rowCount() <= 0) {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE email_address = :email_address");
            $stmt->bindParam(":email_address", $email_address);
            $stmt->execute();
            if ($stmt->rowCount() <= 0) {
                $stmt = $this->connection->db_connection->prepare("INSERT INTO users (name, username, email_address, role, password) VALUES (:name, :username, :email_address, :role, :password)");
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":username", $username);
                $stmt->bindParam(":email_address", $email_address);
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":password", $password);
                $stmt->execute();
                return true;
            } else {
                return "emailTaken";
            }
        } else {
            return "usernameTaken";
        }
    }
    public function updatePassword($id, $password)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE users SET password = :password WHERE id = :id");
        $stmt->bindParam(":password", $password);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return true;
    }
    public function updateCredentials($id, $name, $username, $email_address, $role)
    {
        $name = trim($name);
        $username = trim($username);
        $email_address = trim($email_address);

        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(":id", $id);

        $stmt->execute();
        $user = $stmt->fetch();
        if ($user['name'] === $name &&
            $user['username'] === $username &&
            $user['email_address'] === $email_address &&
            $user['role'] === $role
        ) {
            return false;
        } else {
            if ($user['name'] !== $name) {
                $stmt = $this->connection->db_connection->prepare("UPDATE users SET name = :name WHERE id = :id");
                $stmt->bindParam(":name", $name);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            }
            if ($user['username'] !== $username) {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE username = :username");
                $stmt->bindParam(":username", $username);
                $stmt->execute();
                if ($stmt->rowCount() <= 0) {
                    $stmt = $this->connection->db_connection->prepare("UPDATE users SET username = :username WHERE id = :id");
                    $stmt->bindParam(":username", $username);
                    $stmt->bindParam(":id", $id);
                    $stmt->execute();
                } else {
                    return "usernameTaken";
                }
            }
            if ($user['email_address'] !== $email_address) {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE email_address = :email_address");
                $stmt->bindParam(":email_address", $email_address);
                $stmt->execute();
                if ($stmt->rowCount() <= 0) {
                    $stmt = $this->connection->db_connection->prepare("UPDATE users SET email_address = :email_address WHERE id = :id");
                    $stmt->bindParam(":email_address", $email_address);
                    $stmt->bindParam(":id", $id);
                    $stmt->execute();
                } else {
                    return "emailTaken";
                }
            }
            if ($user['role'] !== $role) {
                $stmt = $this->connection->db_connection->prepare("UPDATE users SET role = :role WHERE id = :id");
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            }
            return true;
        }
    }
    public function adminListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "admin";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function adminList($current_admin_id, $page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "admin";
        $index = ($page - 1) * 8;
        $upTo = 8;
        $stmt->execute();
        $admins = $stmt->fetchAll();
        foreach ($admins as &$admin) {
            if ($current_admin_id === $admin['id']) {
                $admin['role'] = "me";
            }
        }
        return $admins;
    }
    public function userListPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role");
        $stmt->bindParam(":role", $role);

        $role = "user";
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function userList($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM users WHERE role = :role ORDER BY id ASC LIMIT :index, :upTo");
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $role = "user";
        $index = ($page - 1) * 8;
        $upTo = 8;
        $stmt->execute();
        $users = $stmt->fetchAll();
        return $users;
    }
}
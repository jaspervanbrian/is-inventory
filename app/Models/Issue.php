<?php

namespace App\Models;

use App\Database\Connection;

class Issue
{
	private $connection;

    public function __construct()
    {
    	$this->connection = new Connection();    
    }
    public function getIssueHistoryPages($user_id)
    {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE user_id = :user_id");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function getIssueHistory($user_id, $page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        $stmt = $this->connection->db_connection->prepare("SELECT name FROM users WHERE id = :user_id");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        $user = $stmt->fetch();

        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE user_id = :user_id ORDER BY issue_date_time DESC LIMIT :index , :upTo");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $index = ($page - 1) * 8;
        $upTo = 8;
        $stmt->execute();

        $issues = $stmt->fetchAll();
        $history = [];
        foreach($issues as $issue) {
            $stmt = $this->connection->db_connection->prepare("SELECT sticker_number, name, category FROM stocks WHERE id = :stock_id");
            $stmt->bindParam(":stock_id", $issue['stock_id']);
            $stmt->execute();
            $stock = $stmt->fetch();

            $issue_date = date_create($issue['issue_date_time']);
            $history[] = [
                'id' => $issue['id'],
                'user_name' => $user['name'],
                'stock_sticker_number' => $stock['sticker_number'],
                'stock_name' => $stock['name'],
                'stock_category' => $stock['category'],
                'issue_type' => $issue['issue_type'],
                'issue_date' => date_format($issue_date, 'F d, Y'),
                'issue_time' => date_format($issue_date, 'g:i A'),
                'is_returned' => $issue['is_returned'],
                'additional_info' => $issue['additional_info'],
            ];
        }
        return $history;
    }
    public function getToReturnList($user_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT name FROM users WHERE id = :user_id");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        $user = $stmt->fetch();

        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE user_id = :user_id AND issue_type = :issue_type AND is_returned = :is_returned ORDER BY issue_date_time ASC");

        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":issue_type", $issue_type);
        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);

        $issue_type = "Borrow";
        $is_returned = false;
        $stmt->execute();

        $issues = $stmt->fetchAll();
        $toReturnList = [];
        foreach ($issues as $issue) {
            $stmt = $this->connection->db_connection->prepare("SELECT id, sticker_number, name, category FROM stocks WHERE id = :stock_id AND status = :status");
            $stmt->bindParam(":stock_id", $stock_id);
            $stmt->bindParam(":status", $status);

            $stock_id = $issue['stock_id'];
            $status = "Borrowed";
            $stmt->execute();

            $stock = $stmt->fetch();
            $issue_date = date_create($issue['issue_date_time']);
            $toReturnList[] = [
                'id' => $issue['id'],
                'user_name' => $user['name'],
                'stock_id' => $stock['id'], // or $stock_id
                'stock_sticker_number' => $stock['sticker_number'],
                'stock_name' => $stock['name'],
                'stock_category' => $stock['category'],
                'issue_date' => date_format($issue_date, 'F d, Y'),
                'issue_time' => date_format($issue_date, 'g:i A'),
                'additional_info' => $issue['additional_info'],
            ];
        }
        return $toReturnList;
    }
    public function issueBorrow($stock_id, $user_id, $additional_info)
    {
        $additional_info = trim($$additional_info);
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("INSERT INTO issues (stock_id, user_id, issue_type, issue_date_time, is_returned, additional_info) VALUES (:stock_id, :user_id, :issue_type, NOW(), :is_returned, :additional_info)");
        $stmt->bindParam(":stock_id", $stock_id);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":issue_type", $issue_type);
        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
        $stmt->bindParam(":additional_info", $additional_info);

        $issue_type = "Borrow";
        $is_returned = false;
        $additional_info = trim($additional_info);

        $stmt->execute();
            
    }
    public function issueReturn($issue_id, $stock_id, $user_id, $additional_info)
    {
        $additional_info = trim($$additional_info);
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE id = :issue_id");
        $stmt->bindParam(":issue_id", $issue_id);

        $stmt->execute();
        $issue = $stmt->fetch();
        if ($issue['is_returned'] == 0) {
            $stmt = $this->connection->db_connection->prepare("UPDATE issues SET is_returned = :is_returned WHERE id = :issue_id");
            $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
            $stmt->bindParam(":issue_id", $issue_id);

            $is_returned = true;
            $stmt->execute();

            $stmt = $this->connection->db_connection->prepare("INSERT INTO issues (stock_id, user_id, issue_type, issue_date_time, is_returned, additional_info) VALUES (:stock_id, :user_id, :issue_type, NOW(), :is_returned, :additional_info)");
            $stmt->bindParam(":stock_id", $stock_id);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":issue_type", $issue_type);
            $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
            $stmt->bindParam(":additional_info", $additional_info);

            $issue_type = "Return";
            $is_returned = true;
            $additional_info = trim($additional_info);

            $stmt->execute();
            return false;
        } else {
            return true;
        }
    }
    public function borrowedItemsPaginate()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE issue_type = :issue_type AND is_returned = :is_returned ORDER BY issue_date_time ASC");

        $stmt->bindParam(":issue_type", $issue_type);
        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);

        $issue_type = "Borrow";
        $is_returned = false;
        $stmt->execute();

        return $stmt->rowCount();
    }
    public function getBorrowedItems($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE issue_type = :issue_type AND is_returned = :is_returned ORDER BY issue_date_time ASC LIMIT :index, :upTo");

        $stmt->bindParam(":issue_type", $issue_type);
        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $issue_type = "Borrow";
        $is_returned = false;
        $index = ($page - 1) * 8;
        $upTo = 8;
        $stmt->execute();

        $issues = $stmt->fetchAll();
        $toReturnList = [];
        foreach ($issues as $issue) {
            $stmt = $this->connection->db_connection->prepare("SELECT name FROM users WHERE id = :user_id");
            $stmt->bindParam(":user_id", $issue['user_id']);
            $stmt->execute();
            $user = $stmt->fetch();

            $stmt = $this->connection->db_connection->prepare("SELECT id, sticker_number, name, category FROM stocks WHERE id = :stock_id AND status = :status");
            $stmt->bindParam(":stock_id", $issue['stock_id']);
            $stmt->bindParam(":status", $status);

            $status = "Borrowed";
            $stmt->execute();

            $stock = $stmt->fetch();
            $issue_date = date_create($issue['issue_date_time']);
            $toReturnList[] = [
                'id' => $issue['id'],
                'user_name' => $user['name'],
                'stock_id' => $stock['id'],
                'stock_sticker_number' => $stock['sticker_number'],
                'stock_name' => $stock['name'],
                'stock_category' => $stock['category'],
                'issue_date' => date_format($issue_date, 'F d, Y'),
                'issue_time' => date_format($issue_date, 'g:i A'),
                'additional_info' => $issue['additional_info'],
            ];
        }
        return $toReturnList;
    }
    public function getIssuesPages()
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues ORDER BY issue_date_time DESC");
        $stmt->execute();
        return $stmt->rowCount();
    }
    public function getIssues($page)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues ORDER BY issue_date_time DESC LIMIT :index , :upTo");
        $stmt->bindParam(":index", $index, \PDO::PARAM_INT);
        $stmt->bindParam(":upTo", $upTo, \PDO::PARAM_INT);

        $index = ($page - 1) * 8;
        $upTo = 8;
        $stmt->execute();

        $issues = $stmt->fetchAll();
        $issuesList = [];
        foreach($issues as $issue) {
            $stmt = $this->connection->db_connection->prepare("SELECT name FROM users WHERE id = :user_id");
            $stmt->bindParam(":user_id", $issue['user_id']);
            $stmt->execute();
            $user = $stmt->fetch();

            $stmt = $this->connection->db_connection->prepare("SELECT sticker_number, name, category FROM stocks WHERE id = :stock_id");
            $stmt->bindParam(":stock_id", $issue['stock_id']);
            $stmt->execute();
            $stock = $stmt->fetch();

            $issue_date = date_create($issue['issue_date_time']);
            $issuesList[] = [
                'id' => $issue['id'],
                'user_name' => $user['name'],
                'stock_sticker_number' => $stock['sticker_number'],
                'stock_name' => $stock['name'],
                'stock_category' => $stock['category'],
                'issue_type' => $issue['issue_type'],
                'issue_date' => date_format($issue_date, 'F d, Y'),
                'issue_time' => date_format($issue_date, 'g:i A'),
                'is_returned' => $issue['is_returned'],
                'additional_info' => $issue['additional_info'],
            ];
        }
        return $issuesList;
    }
}

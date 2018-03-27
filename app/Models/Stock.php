<?php

namespace App\Models;

use App\Database\Connection;

/**
 * summary
 */
class Stock
{
	private $connection;

    public function __construct()
    {
    	$this->connection = new Connection();    
    }
    public function getInventory($type, $keyword='', $page)
    {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	if (trim($keyword) !== '') {
			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");
    		if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "sticker_number") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE sticker_number = :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");
    		} else if ($type === "category") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "status") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		}

            $index = ($page - 1)*7;
            $upTo = 7;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);
			$stmt->bindParam(':keyword', $keyword);
			$stmt->execute();

			if ($stmt->rowCount() <= 0) {
				$stockList = [];
				return $stockList;
			} else {
				$stockList = $stmt->fetchAll();
				return $stockList;
			}
    	} else {
    		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC LIMIT :index , :upTo");

            $index = ($page - 1)*7;
            $upTo = 7;
            $stmt->bindParam(':index', $index, \PDO::PARAM_INT);
            $stmt->bindParam(':upTo', $upTo, \PDO::PARAM_INT);

			$stmt->execute();
			if ($stmt->rowCount() <= 0) {
				$stockList = [];
				return $stockList;
			} else {
				$stockList = $stmt->fetchAll();
				return $stockList;
			}
    	}
    }
    public function getInventoryPages($type, $keyword='')
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        if (trim($keyword) !== '') {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
            if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "sticker_number") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE sticker_number = :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
            } else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
                $keyword =  "%".$keyword ."%";
            }

            $stmt->bindParam(':keyword', $keyword);
            $stmt->execute();
            return $stmt->rowCount();
        } else {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks ORDER BY status ASC, category ASC, name ASC, acquisition_date DESC");
            $stmt->execute();
            return $stmt->rowCount();
        }
    }
    public function borrow($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET status = :status WHERE id = :id");
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $stock_id);

        $status = "Borrowed";
        $stmt->execute();
    }
    public function return($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET status = :status WHERE id = :id");
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $stock_id);

        $status = "Available";
        $stmt->execute();
    }
}
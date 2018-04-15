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
    public function getInventory($type, $keyword='', $page, $orderby, $step)
    {
    	$this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    	if (trim($keyword) !== '') {
			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    		if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "sticker_number") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE sticker_number = :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    		} else if ($type === "category") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
    			$keyword =  "%".$keyword ."%";
    		} else if ($type === "status") {
    			$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword ORDER BY {$orderby} {$step} LIMIT :index , :upTo");
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
    		$stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks ORDER BY {$orderby} {$step} LIMIT :index , :upTo");

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
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword");
            if ($type === "name") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE name LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "sticker_number") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE sticker_number = :keyword");
            } else if ($type === "category") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE category LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            } else if ($type === "status") {
                $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE status LIKE :keyword");
                $keyword =  "%".$keyword ."%";
            }

            $stmt->bindParam(':keyword', $keyword);
            $stmt->execute();
            return $stmt->rowCount();
        } else {
            $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks");
            $stmt->execute();
            return $stmt->rowCount();
        }
    }
    public function borrow($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :id");
        $stmt->bindParam(":id", $stock_id);
        $stmt->execute();
        $stock = $stmt->fetch();
        if ($stock['status'] === "Available") {
            $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET status = :status WHERE id = :id");
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":id", $stock_id);

            $status = "Borrowed";
            $stmt->execute();
            return false;
        } else {
            return true;
        }
    }
    public function returnItem($stock_id)
    {
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET status = :status WHERE id = :id");
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $stock_id);

        $status = "Available";
        $stmt->execute();
    }
    public function create($sticker_number, $name, $category, $status, $owner, $supplier, $acquisition_date, $description, $depreciation_info)
    {
        $sticker_number = trim($sticker_number);
        $name = trim($name);
        $category = trim($category);
        $status = trim($status);
        $owner = trim($owner);
        $supplier = trim($supplier);
        $acquisition_date = trim($acquisition_date);
        $description = trim($description);
        $depreciation_info = trim($depreciation_info);

        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("INSERT INTO stocks (sticker_number, name, category, status, owner, supplier, acquisition_date, description, depreciation_info) VALUES (:sticker_number, :name, :category, :status, :owner, :supplier, :acquisition_date, :description, :depreciation_info)");
        $stmt->bindParam(":sticker_number", $sticker_number);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":owner", $owner);
        $stmt->bindParam(":supplier", $supplier);
        $stmt->bindParam(":acquisition_date", $acquisition_date);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":depreciation_info", $depreciation_info);
        $stmt->execute();
        return true;
    }
    public function update($id, $sticker_number, $name, $category, $status, $owner, $supplier, $acquisition_date, $description, $depreciation_info)
    {
        $sticker_number = trim($sticker_number);
        $name = trim($name);
        $category = trim($category);
        $status = trim($status);
        $owner = trim($owner);
        $supplier = trim($supplier);
        $acquisition_date = trim($acquisition_date);
        $description = trim($description);
        $depreciation_info = trim($depreciation_info);
        
        $this->connection->db_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $stmt = $this->connection->db_connection->prepare("SELECT * FROM stocks WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $stock = $stmt->fetch();
        if ($stock['sticker_number'] === $sticker_number &&
            $stock['name'] === $name &&
            $stock['category'] === $category &&
            $stock['status'] === $status &&
            $stock['owner'] === $owner &&
            $stock['supplier'] === $supplier &&
            $stock['acquisition_date'] === $acquisition_date &&
            $stock['description'] === $description &&
            $stock['depreciation_info'] === $depreciation_info
        ) {
            return false;
        } else {
            if ($stock['sticker_number'] !== $sticker_number) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET sticker_number = :sticker_number WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":sticker_number", $sticker_number);
                $stmt->execute();
            }
            if ($stock['name'] !== $name) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET name = :name WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":name", $name);
                $stmt->execute();
            }
            if ($stock['category'] !== $category) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET category = :category WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":category", $category);
                $stmt->execute();
            }
            if ($stock['status'] !== $status) {
                if ($stock['status'] === "Borrowed") {
                    $stmt = $this->connection->db_connection->prepare("SELECT * FROM issues WHERE stock_id = :id  AND issue_type = :issue_type AND is_returned = :is_returned ORDER BY issue_date_time DESC");
                    $stmt->bindParam(":id", $id);
                    $stmt->bindParam(":issue_type", $issue_type);
                    $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);

                    $issue_type = "Borrow";
                    $is_returned = false;
                    $stmt->execute();

                    if (!($stmt->rowCount() <= 0)) {
                        $issue = $stmt->fetch();
                        $stmt = $this->connection->db_connection->prepare("UPDATE issues SET is_returned = :is_returned WHERE id = :issue_id");
                        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
                        $stmt->bindParam(":issue_id", $issue['id']);

                        $is_returned = true;
                        $stmt->execute();

                        $stmt = $this->connection->db_connection->prepare("INSERT INTO issues (stock_id, user_id, issue_type, issue_date_time, is_returned, additional_info) VALUES (:stock_id, :user_id, :issue_type, NOW(), :is_returned, :additional_info)");
                        $stmt->bindParam(":stock_id", $issue['stock_id']);
                        $stmt->bindParam(":user_id", $issue['user_id']);
                        $stmt->bindParam(":issue_type", $issue_type);
                        $stmt->bindParam(":is_returned", $is_returned, \PDO::PARAM_BOOL);
                        $stmt->bindParam(":additional_info", $additional_info);

                        $issue_type = "Return";
                        $is_returned = true;
                        $additional_info = "";
                        $stmt->execute();
                    }
                }
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET status = :status WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":status", $status);
                $stmt->execute();
            }
            if ($stock['owner'] !== $owner) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET owner = :owner WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":owner", $owner);
                $stmt->execute();
            }
            if ($stock['supplier'] !== $supplier) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET supplier = :supplier WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":supplier", $supplier);
                $stmt->execute();
            }
            if ($stock['acquisition_date'] !== $acquisition_date) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET acquisition_date = :acquisition_date WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":acquisition_date", $acquisition_date);
                $stmt->execute();
            }
            if ($stock['description'] !== $description) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET description = :description WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":description", $description);
                $stmt->execute();
            }
            if ($stock['depreciation_info'] !== $depreciation_info) {
                $stmt = $this->connection->db_connection->prepare("UPDATE stocks SET depreciation_info = :depreciation_info WHERE id = :id");
                $stmt->bindParam(":id", $id);
                $stmt->bindParam(":depreciation_info", $depreciation_info);
                $stmt->execute();
            }
            return true;
        }
    }
}
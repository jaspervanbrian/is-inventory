<?php

session_start();
if (isset($_SESSION['user'])) {
	if ($_SESSION['user']['role'] === "admin") {
		header('Location: ../admin/dashboard.php');
	}
} else {
	header('Location: ../../index.php');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>IICS - IS Inventory</title>
	<link rel="stylesheet" href="../../assets/bootstrap4/css/bootstrap.min.css">
	<script src="../../assets/js/jquery-3.3.1.min.js"></script>
	<script src="../../assets/bootstrap4/js/bootstrap.js"></script>
	<link rel="stylesheet" href="../../assets/css/user.css">
	<script src="../../assets/js/user/maininventory.js"></script>
	<script src="../../assets/js/user/myissues.js"></script>
</head>
<body>
	<?php
		include '../navbar.php';
	?>
	<ul class="nav nav-tabs">
		<li class="nav-item">
			<a class="nav-link active" id="maininventory-tab" data-toggle="tab" href="#maininventory">Main Inventory</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="issues-tab" data-toggle="tab" href="#issues">My Issues</a>
		</li>
	</ul>

	<div class="tab-content">
		<div class="tab-pane fade show active container" id="maininventory">
			<form action="../../app/Controllers/User/MainInventory.php" method="post" id="searchForm">
				<div class="form-group row">
					<label for="searchBy" class="d-flex align-items-center">Search By:</label>
					<div class="col-3">
						<select name="type" id="type" class="form-control">
							<option value="name">Product name/brand</option>
							<option value="sticker_number">Sticker number</option>
							<option value="category">Category</option>
							<option value="status">Status</option>
						</select>
					</div>
					<div class="col-6">
						<input type="text" class="form-control" name="searchKeyword" id="searchKeyword" placeholder="Enter keyword here...">
					</div>
				</div>
			</form>
			<div class="row">
				<div class="col-12" id="stockList">
					
				</div>
			</div>
			<div class="row">
				<div class="col-12 d-flex justify-content-center" id="pagination">
					
				</div>
			</div>
		</div>
		<div class="tab-pane fade container-fluid" id="issues">
			<div class="row top-margin">
				<div class="col-2">
					<ul class="nav nav-pills flex-column">
						<li class="nav-item">
							<a class="nav-link active" data-toggle="tab" href="#toReturn">Items to return</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" data-toggle="tab" href="#history">Issue History</a>
						</li>
					</ul>
				</div>
				<div class="col-10">
					<div class="tab-content">
						<div class="tab-pane fade show active" id="toReturn">
							<div class="row">
								<div class="col-12" id="toReturnList">
									
								</div>
							</div>
						</div>
						<div class="tab-pane fade" id="history">
							<div class="row">
								<div class="col-12" id="historyList">
									
								</div>
							</div>
							<div class="row">
								<div class="col-12" id="historyListPagination">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  	<div id="flash-message" class="" role="alert"></div>
  	<div id="stockModals"></div>
	<div id="returnModals"></div>
	<div id="issueModals"></div>
  	<?php
  		if (isset($_SESSION['borrow'])) {
  			if ($_SESSION['borrow'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Borrow successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  				unset($_SESSION['borrow']);
  			}
  		}
  		if (isset($_SESSION['return'])) {
  			if ($_SESSION['return'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#issues-tab").tab('show');
					$("#flash-message").empty().addClass("alert alert-success").show().append("Return successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  				unset($_SESSION['return']);
  			}
  		}
  	?>
</body>
</html>
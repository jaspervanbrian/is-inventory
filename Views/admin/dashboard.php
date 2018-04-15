<?php

session_start();
if (isset($_SESSION['user'])) {
	if ($_SESSION['user']['role'] === "user") {
		header('Location: ../user/home.php');
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
	<link rel="stylesheet" href="../../assets/fonts/fontawesome-free-5.0.10/web-fonts-with-css/css/fontawesome-all.css">
	<link rel="stylesheet" href="../../assets/css/admin.css">
	<script src="../../assets/js/admin/admin.js"></script>
	<script src="../../assets/js/admin/inventory.js"></script>
	<script src="../../assets/js/admin/issues.js"></script>
	<script src="../../assets/js/admin/users.js"></script>
</head>
<body>
	<?php
		include '../navbar.php';
	?>
	<ul class="nav nav-tabs">
		<li class="nav-item">
			<a class="nav-link active" id="inventory-tab" data-toggle="tab" href="#inventory">Inventory</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="issues-tab" data-toggle="tab" href="#issues">Issues</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="users-tab" data-toggle="tab" href="#users">Users</a>
		</li>
	</ul>

	<div class="tab-content">
		<div class="tab-pane fade show active container" id="inventory">
			<form action="../../app/Controllers/Admin/Inventory.php" method="post" id="searchForm">
				<div class="form-group row">
					<label for="searchBy" class="d-flex align-items-center">Search By:</label>
					<div class="col-3">
						<select name="type" id="type" class="form-control">
							<option value="name">Stock name/brand</option>
							<option value="sticker_number">Sticker number</option>
							<option value="category">Category</option>
							<option value="status">Status</option>
						</select>
					</div>
					<div class="col-6">
						<input type="text" class="form-control" name="searchKeyword" id="searchKeyword" placeholder="Enter keyword here...">
					</div>
					<div class="col-2">
						<button type="button" data-toggle="modal" data-target="#add-item" class="btn btn-primary btn-block">Add Item</button>
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
							<a class="nav-link active" data-toggle="tab" href="#borrowedItems">Borrowed items</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" data-toggle="tab" href="#allIssues">All transactions</a>
						</li>
					</ul>
				</div>
				<div class="col-10">
					<div class="tab-content">
						<div class="tab-pane fade show active" id="borrowedItems">
							<div class="row">
								<div class="col-12" id="borrowedItemsList">
									
								</div>
							</div>
							<div class="row">
								<div class="col-12" id="borrowedItemsPagination">
									
								</div>
							</div>
						</div>
						<div class="tab-pane fade" id="allIssues">
							<div class="row">
								<div class="col-12" id="allIssuesList">
									
								</div>
							</div>
							<div class="row">
								<div class="col-12" id="allIssuesPagination">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tab-pane fade container-fluid" id="users">
			<div class="row top-margin">
				<div class="col-2">
					<ul class="nav nav-pills flex-column">
						<li class="nav-item">
							<a class="nav-link active" data-toggle="tab" href="#adminrole">Admins</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" data-toggle="tab" href="#userrole">Users</a>
						</li>
					</ul>
					<button class="btn btn-outline-dark btn-block top-margin" data-toggle="modal" data-target="#addUser">Add User</button>
				</div>
				<div class="col-10">
					<div class="tab-content">
						<div class="tab-pane fade show active" id="adminrole">
							<div class="row">
								<div class="col-12" id="adminList">
									
								</div>
							</div>
							<div class="row">
								<div class="col-12" id="adminListPagination">
									
								</div>
							</div>
						</div>
						<div class="tab-pane fade" id="userrole">
							<div class="row">
								<div class="col-12" id="userList">
									
								</div>
							</div>
							<div class="row">
								<div class="col-12" id="userListPagination">
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  	<div id="flash-message" class="" role="alert" style="z-index: 9999999;"></div>
  	<div id="stockModals"></div>
	<div id="borrowModals"></div>
	<div id="issueModals"></div>
	<div id="adminModals"></div>
	<div id="userModals"></div>
	<div>
		<div class="modal fade" id="myCredentials" tabindex="-1" role="dialog" aria-labelledby="myCredentialsModal" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="myCredentialsModal">Edit your credentials</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> 
					</div>
					<div class="modal-body">
						<!-- Nav tabs -->
						<ul class="nav nav-tabs">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="tab" href="#myDetails">Details</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#myPassword">Change Password</a>
							</li>
						</ul>

						<!-- Tab panes -->
						<div class="tab-content">
							<div class="tab-pane active container" id="myDetails">
								<form action="../../app/Controllers/Admin/EditUser.php" method="post" id="myDetailsForm">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row">
										<div class="col-12">
											<h3>User Details</h3>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-6"> 
											<small>Name: </small> 
											<input type="text" name="name" value="<?= $_SESSION['user']['name'] ?>" class="form-control" required> 
										</div>
										<div class="col-6"> 
											<small>Username: </small> 
											<input type="text" name="username" value="<?= $_SESSION['user']['username'] ?>" class="form-control" required> 
										</div>
									</div>
									<div class="row top-margin">
										<div class="col-6"> 
											<small>Email Address: </small> 
											<input type="email" name="email_address" value="<?= $_SESSION['user']['email_address'] ?>" class="form-control" required> 
										</div>
										<div class="col-6"> 
											<small>Role: </small> 
											<select name="role" class="form-control" required disabled> 
												<option value="admin">Admin</option>
											</select> 
										</div>
									</div>
									<div class="row top-margin">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div>
									</div>
								</form>
							</div>
							<div class="tab-pane container" id="myPassword">
								<form action="../../app/Controllers/Admin/EditPassword.php" id="myPasswordForm" method="post">
									<input type="hidden" name="id" value="<?= $_SESSION['user']['id'] ?>"> 
									<div class="row">
										<div class="col-12">
											<h3>Change Password</h3>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-6 offset-3">
											<small>New Password <span class="text-danger">*</span></small>
											<input type="password" name="password" class="form-control">
										</div>
									</div>
									<div class="row top-margin">
										<div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save</button> </div>
									</div>
								</form>
							</div>
						</div>

					</div>
					<div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div class="modal fade" id="add-item" tabindex="-1" role="dialog" aria-labelledby="add-itemModal" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="add-itemModal">Add item</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form action="../../app/Controllers/Admin/AddStock.php" method="POST">
							<div class="row">
								<div class="col-12">
									<h3>Stock Details</h3>
								</div>
							</div>
							<hr>
							<div class="row top-margin">
								<div class="col-5"> 
									<small>Sticker number: <span class="text-danger">*</span></small> 
									<input type="text" name="sticker_number" id="sticker_number" class="form-control" required> 
								</div>
								<div class="col-7"> 
									<small>Stock name/brand: <span class="text-danger">*</span></small> 
									<input type="text" name="name" id="name" class="form-control" required> 
								</div>
							</div>
							<div class="row top-margin">
								<div class="col-5"> 
									<small>Category: <span class="text-danger">*</span></small> 
									<input type="text" name="category" id="category" class="form-control" required> 
								</div>
								<div class="col-7"> 
									<small>Status: <span class="text-danger">*</span></small> 
									<select name="status" id="status" class="form-control" required> 
										<option value="Available">Available</option> 
										<option value="Borrowed">Borrowed</option> 
										<option value="Maintenance/Repair">Maintenance/Repair</option> 
										<option value="Removed/Deprecated">Removed/Deprecated</option> 
									</select> 
								</div>
							</div>
							<hr>
							<div class="row top-margin">
								<div class="col-4"> 
									<small>Owner: <span class="text-danger">*</span></small> 
									<input type="text" name="owner" id="owner" class="form-control" required> </div>
								<div class="col-4"> 
									<small>Supplier: <span class="text-danger">*</span></small> 
									<input type="text" name="supplier" id="supplier" class="form-control" required> 
								</div>
								<div class="col-4"> 
									<small>Acquisition Date: <span class="text-danger">*</span></small> 
									<input type="date" name="acquisition_date" id="acquisition_date" class="form-control" required> 
								</div>
							</div>
							<hr>
							<div class="row">
								<div class="col-12"> 
									<small>Description:</small> 
								</div>
							</div>
							<div class="row">
								<div class="col-12"> 
									<textarea class="form-control" name="description" id="description" cols="30" rows="10"></textarea> 
								</div>
							</div>
							<hr>
							<div class="row">
								<div class="col-12"> 
									<small>Depreciation info:</small> 
								</div>
							</div>
							<div class="row">
								<div class="col-12"> 
									<textarea class="form-control" name="depreciation_info" id="depreciation_info" cols="30" rows="10"></textarea> 
								</div>
							</div>
							<div class="row top-margin">
								<div class="col-12 d-flex justify-content-center"> 
									<button type="submit" class="btn btn-primary">Add Item</button>
								 </div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div class="modal fade" id="addUser" tabindex="-1" role="dialog" aria-labelledby="addUserModal" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="addUserModal">Add User</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> 
					</div>
					<div class="modal-body">
						<form action="../../app/Controllers/Admin/AddUser.php" id="addUserForm" method="post">
							<div class="row">
								<div class="col-12">
									<h3>User Details</h3>
								</div>
							</div>
							<hr>
							<div class="row">
								<div class="col-6"> 
									<small>Name: <span class="text-danger">*</span></small> 
									<input type="text" name="name" class="form-control" required> 
								</div>
								<div class="col-6"> 
									<small>Username: <span class="text-danger">*</span></small> 
									<input type="text" name="username" class="form-control" required> 
								</div>
							</div>
							<div class="row top-margin">
								<div class="col-6"> 
									<small>Email Address: <span class="text-danger">*</span></small> 
									<input type="email" name="email_address" class="form-control" required> 
								</div>
								<div class="col-6"> 
									<small>Role: <span class="text-danger">*</span></small> 
									<select name="role" class="form-control" required> 
										<option value="admin">Admin</option> 
										<option value="user">User</option> 
									</select> 
								</div>
							</div>
							<div class="row top-margin">
								<div class="col-6">
									<small>Password <span class="text-danger">*</span></small>
									<input type="password" name="password" id="" class="form-control">
								</div>
							</div>
							<div class="row top-margin">
								<div class="col-12 d-flex justify-content-center"> 
									<button type="submit" class="btn btn-primary">Add user</button> 
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer"> 
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> 
					</div>
				</div>
			</div>
		</div>
	</div>
  	<?php
  		if (isset($_SESSION['update'])) {
  			if ($_SESSION['update'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Update item successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['update'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-info").show().append("No changes for item.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['update']);
  		}
  		if (isset($_SESSION['add'])) {
  			if ($_SESSION['add'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Add item successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['add'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("Error adding desired item.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['add']);
  		}
  		if (isset($_SESSION['addUser'])) {
  			if ($_SESSION['addUser'] === "ok") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-success").show().append("Add user successful!").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['addUser'] === "username") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}  else if ($_SESSION['addUser'] === "email") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			} else if ($_SESSION['addUser'] === "err") {
  	?>
			<script>
				$(document).ready(function() {
					$("#flash-message").empty().addClass("alert alert-danger").show().append("Error adding user.").delay( 5000 ).slideUp(300);	
				});
			</script>
  	<?php
  			}
			unset($_SESSION['addUser']);
  		}
  	?>
</body>
</html>
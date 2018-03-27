<?php
	session_start();
	if (isset($_SESSION['user'])) {
		if ($_SESSION['user']['role'] === "admin") {
			header('Location: Views/admin/dashboard.php');
		} else if ($_SESSION['user']['role'] === "user") {
			header('Location: Views/user/home.php');
		}
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>IICS - IS Inventory</title>
	<link rel="stylesheet" href="assets/bootstrap4/css/bootstrap.min.css">
	<script src="assets/js/jquery-3.3.1.min.js"></script>
	<script src="assets/bootstrap4/js/bootstrap.js"></script>
	<link rel="stylesheet" href="assets/css/login.css">
	<script src="assets/js/login.js"></script>
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-6 offset-3 login">
				<div class="card">
					<img class="card-img-top align-self-center" src="assets/images/iicslogo.jpeg" style="width: 150px;" alt="Card image cap">	
					<div class="card-body">
						<h3 class="d-flex justify-content-center">IICS - Information Systems Inventory</h3>
						<form action="app/Controllers/VerifyAccount.php" method="POST" id="login-form" role="form">
							<hr class="colorgraph">
							<h5 class="d-flex justify-content-center">Please Sign In</h5>
							<div class="form-group">
								<input type="text" name="username" id="username" class="form-control input-lg" placeholder="Username" required>
							</div>
							<div class="form-group">
								<input type="password" name="password" id="password" class="form-control input-lg" placeholder="Password" required>
							</div>
							<hr class="colorgraph">
							<div class="row">
								<div class="col-6 offset-3">
									<button type="button" name="login" id="login" class="btn btn-lg btn-success btn-block" value="Sign In">Sign In</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
  	<div id="flash-message" class="" role="alert"></div>
</body>
</html>
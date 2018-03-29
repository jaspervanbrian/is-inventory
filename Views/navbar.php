<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
	<a class="navbar-brand" href="#">IICS - IS Inventory</a>
	<ul class="navbar-nav ml-auto">
		<li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
				<?php echo htmlspecialchars($_SESSION['user']['username']) ?>
			</a>
			<div class="dropdown-menu dropdown-menu-right">
				<button type="button" data-toggle="modal" data-target="#myCredentials" class="dropdown-item btn btn-primary">View my profile</button>
				<form action="../../app/Controllers/LogoutController.php" method="post">
					<button type="submit" class="dropdown-item btn btn-primary">Logout</button>
				</form>
			</div>
		</li>
	</ul>
</nav>
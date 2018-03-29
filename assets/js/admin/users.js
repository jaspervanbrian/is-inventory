$(document).ready(function() {
	var requestAdmin;
	var requestAdminPages;
	var adminListPage = 1;
	var adminListTotalPages;

	var requestUser;
	var requestUserPages;
	var userListPage = 1;
	var userListTotalPages;

	var adminData = {
		page: adminListPage,
	};
	var userData = {
		page: userListPage,
	};

	var request;

	getAdminPages();
	getAdmin(adminData);
	getUserPages();
	getUser(userData);
	
	$("#adminListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (adminListPage === adminListTotalPages) {
                    $("#adminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage -= 1;
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (adminListPage === 1) {
                    $("#adminListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage += 1;
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === adminListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#adminListPagination").find(':contains(' + adminListPage + ')').removeClass('active');
                adminListPage = parseInt($(this).text());
                $("#adminListPagination").find(':contains(' + adminListPage + ')').addClass('active');
                adminData = {
                	page: adminListPage,
                };
                getAdmin(adminData);
                if (adminListPage === 1) {
                    $("#adminListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#adminListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (adminListPage === adminListTotalPages) {
                    $("#adminListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#adminListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#userListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (userListPage === userListTotalPages) {
                    $("#userListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#userListPagination").find(':contains(' + userListPage + ')').removeClass('active');
                userListPage -= 1;
                $("#userListPagination").find(':contains(' + userListPage + ')').addClass('active');
                userData = {
                    page: userListPage,
                };
                getUser(userData);
                if (userListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (userListPage === 1) {
                    $("#userListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#userListPagination").find(':contains(' + userListPage + ')').removeClass('active');
                userListPage += 1;
                $("#userListPagination").find(':contains(' + userListPage + ')').addClass('active');
                userData = {
                    page: userListPage,
                };
                getUser(userData);
                if (userListPage === userListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#userListPagination").find(':contains(' + userListPage + ')').removeClass('active');
                userListPage = parseInt($(this).text());
                $("#userListPagination").find(':contains(' + userListPage + ')').addClass('active');
                userData = {
                    page: userListPage,
                };
                getUser(userData);
                if (userListPage === 1) {
                    $("#userListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#userListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (userListPage === userListTotalPages) {
                    $("#userListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#userListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });
    $("#addUserForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                name: $form.find("input[name='name']").val(),
                username: $form.find("input[name='username']").val(),
                email_address: $form.find("input[name='email_address']").val(),
                role: $form.find("select[name='role']").val(),
                password: $form.find("input[name='password']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().addClass("alert alert-success").show().append("Add user successful!").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
                getAdminPages();
                getAdmin(adminData);
                getUserPages();
                getUser(userData);
            } else if (response === "usernameTaken") {
                $("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);    
            } else if (response === "emailTaken") {
                $("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);   
            } else if (response === "err") {
                $("#flash-message").empty().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });
    $("#myDetailsForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                name: $form.find("input[name='name']").val(),
                username: $form.find("input[name='username']").val(),
                email_address: $form.find("input[name='email_address']").val(),
                role: $form.find("select[name='role']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
                getAdminPages();
                getAdmin(adminData);
                getUserPages();
                getUser(userData);
            } else if (response === "usernameTaken") {
                $("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);    
            } else if (response === "emailTaken") {
                $("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);   
            } else if (response === "err") {
                $("#flash-message").empty().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });

    $("#myPasswordForm").on('submit', function(e) {
        e.preventDefault();
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $modal = $(this).closest('.modal');
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: {
                id: $form.find("input[name='id']").val(),
                password: $form.find("input[name='password']").val(),
            },
        });
        request.done(function(response, textStatus, jqXHR) {
            if (response === "ok") {
                $("#flash-message").empty().addClass("alert alert-success").show().append("Update user password successful!").delay( 5000 ).slideUp(300);
                $form.find("input[name='password']").val("");
                $modal.modal('toggle');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').css('padding-right',0);
                getAdminPages();
                getAdmin(adminData);
                getUserPages();
                getUser(userData);
            }
        });
        request.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    });

	function getAdminPages() {
		if (requestAdminPages) {
			requestAdminPages.abort();
		}
		requestAdminPages = $.ajax({
			url: '../../app/Controllers/Admin/PaginateAdminList.php',
			type: 'POST',
		});
		requestAdminPages.done(function(response, textStatus, jqXHR) {
			if (parseInt(response) > 8) {
                $("#adminListPagination").empty().append('<ul class="pagination"></ul>');
                var $adminListPagination = $("#adminListPagination").find('.pagination');
                $adminListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                adminListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= adminListTotalPages; i++) {
                    if (i === 1) {
                        $adminListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $adminListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $adminListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#adminListPagination").empty();
            }
        })
        requestAdminPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}
	function getAdmin(adminData) {
		if (requestAdmin) {
			requestAdmin.abort();
		}
		requestAdmin = $.ajax({
			url: '../../app/Controllers/Admin/Admins.php',
			type: 'POST',
            data: adminData,
		});
		requestAdmin.done(function(response, textStatus, jqXHR) {
			var adminList = JSON.parse(response);
			if (adminList.length === 0) {
				$("#adminList").empty().append('<div class="alert alert-info">There are no admins yet.</div>');
				$("#adminModals").empty();
			} else {
				$("#adminModals").empty();
				$("#adminList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
				$adminListBody = $("#adminList").find('tbody');
				$.each(adminList, function(i, admin) {
					$adminListBody.append('<tr data-toggle="modal" data-target="#admin' + admin.id + '"><td>' + admin.name + '</td><td>' + admin.username + '</td><td>' + admin.email_address + '</td></tr>');
					$("#adminModals").append('<div class="modal fade" id="admin' + admin.id + '" tabindex="-1" role="dialog" aria-labelledby="adminModal' + admin.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="adminModal' + admin.id + '">Edit Admin</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#adminDetail' + admin.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#adminPassword' + admin.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="adminDetail' + admin.id + '"> <form action="../../app/Controllers/Admin/EditUser.php" method="post" class="editAdmin"> <input type="hidden" name="id" value="' + admin.id + '"> <div class="row"> <div class="col-12"> <h3>User Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + admin.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + admin.username + '" class="form-control" required> </div></div><div class="row top-margin"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + admin.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (admin.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (admin.role==="admin" ? "selected" : "") + '>Admin</option> <option value="user" ' + (admin.role==="user" ? "selected" : "") + '>User</option> </select> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="adminPassword' + admin.id + '"> <form action="../../app/Controllers/Admin/EditPassword.php" class="editAdminPassword" method="post"><input type="hidden" name="id" value="' + admin.id + '"> <div class="row"> <div class="col-12"> <h3>Change Password</h3> </div></div><hr> <div class="row"> <div class="col-6 offset-3"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control"> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
				});
				$(".editAdmin").on('submit', function(e) {
					e.preventDefault();
					if (request) {
						request.abort();
					}
					var $form = $(this);
					var $modal = $(this).closest('.modal');
					request = $.ajax({
						url: $form.attr("action"),
						type: 'POST',
						data: {
							id: $form.find("input[name='id']").val(),
							name: $form.find("input[name='name']").val(),
							username: $form.find("input[name='username']").val(),
							email_address: $form.find("input[name='email_address']").val(),
							role: $form.find("select[name='role']").val(),
						},
					});
					request.done(function(response, textStatus, jqXHR) {
						if (response === "ok") {
							$("#flash-message").empty().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
							getAdmin(adminData);
						} else if (response === "usernameTaken") {
							$("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "emailTaken") {
							$("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "err") {
							$("#flash-message").empty().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
						}
					});
					request.fail(function(jqXHR, textStatus, errorThrown) {
						$("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
					});
				});
                $(".editAdminPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            password: $form.find("input[name='password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().addClass("alert alert-success").show().append("Update user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getAdmin(adminData);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
			}
		});
		requestAdmin.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
		});
	}
	function getUserPages() 
	{
        if(requestUserPages){
            requestUserPages.abort();
        }
        requestUserPages = $.ajax({
            url: '../../app/Controllers/Admin/PaginateUserList.php',
            type: 'POST',
        });
        requestUserPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#userListPagination").empty().append('<ul class="pagination"></ul>');
                var $userListPagination = $("#userListPagination").find('.pagination');
                $userListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                userListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= userListTotalPages; i++) {
                    if (i === 1) {
                        $userListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $userListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $userListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#userListPagination").empty();
            }
        })
        requestUserPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
	function getUser(userData) 
	{
		if(requestUser){
            requestUser.abort();
        }
        requestUser = $.ajax({
        	url: '../../app/Controllers/Admin/Users.php',
        	type: 'POST',
        	data: userData,
        });
        requestUser.done(function(response, textStatus, jqXHR) {
        	var userList = JSON.parse(response);
			if (userList.length === 0) {
				$("#userList").empty().append('<div class="alert alert-info">There are no users yet.</div>');
				$("#userModals").empty();
			} else {
				$("#userModals").empty();
				$("#userList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name</th><th>Username</th><th>Email address</th></tr></thead><tbody></tbody></table>');
				$userListBody = $("#userList").find('tbody');
				$.each(userList, function(i, user) {
					$userListBody.append('<tr data-toggle="modal" data-target="#user' + user.id + '"><td>' + user.name + '</td><td>' + user.username + '</td><td>' + user.email_address + '</td></tr>');
					$("#userModals").append('<div class="modal fade" id="user' + user.id + '" tabindex="-1" role="dialog" aria-labelledby="userModal' + user.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="userModal' + user.id + '">Edit User</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#userDetail' + user.id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#userPassword' + user.id + '">Change Password</a> </li></ul> <div class="tab-content"> <div class="tab-pane active container" id="userDetail' + user.id + '"> <form action="../../app/Controllers/Admin/EditUser.php" method="post" class="editUser"> <input type="hidden" name="id" value="' + user.id + '"> <div class="row"> <div class="col-12"> <h3>User Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Name: </small> <input type="text" name="name" value="' + user.name + '" class="form-control" required> </div><div class="col-6"> <small>Username: </small> <input type="text" name="username" value="' + user.username + '" class="form-control" required> </div></div><div class="row top-margin"> <div class="col-6"> <small>Email Address: </small> <input type="email" name="email_address" value="' + user.email_address + '" class="form-control" required> </div><div class="col-6"> <small>Role: </small> <select name="role" class="form-control" required ' + (user.role==="me" ? "disabled" : "") + '> <option value="admin" ' + (user.role==="admin" ? "selected" : "") + '>Admin</option> <option value="user" ' + (user.role==="user" ? "selected" : "") + '>User</option> </select> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> </div><div class="tab-pane container" id="userPassword' + user.id + '"> <form action="../../app/Controllers/Admin/EditPassword.php" class="editUserPassword" method="post"><input type="hidden" name="id" value="' + user.id + '"> <div class="row"> <div class="col-12"> <h3>Change Password</h3> </div></div><hr> <div class="row"> <div class="col-6 offset-3"> <small>New Password <span class="text-danger">*</span></small> <input type="password" name="password" class="form-control"> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save</button> </div></div></form> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
				});
				$(".editUser").on('submit', function(e) {
					e.preventDefault();
					if (request) {
						request.abort();
					}
					var $form = $(this);
					var $modal = $(this).closest('.modal');
					request = $.ajax({
						url: $form.attr("action"),
						type: 'POST',
						data: {
							id: $form.find("input[name='id']").val(),
							name: $form.find("input[name='name']").val(),
							username: $form.find("input[name='username']").val(),
							email_address: $form.find("input[name='email_address']").val(),
							role: $form.find("select[name='role']").val(),
						},
					});
					request.done(function(response, textStatus, jqXHR) {
						if (response === "ok") {
							$("#flash-message").empty().addClass("alert alert-success").show().append("Update user successful!").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
							getUser(userData);
						} else if (response === "usernameTaken") {
							$("#flash-message").empty().addClass("alert alert-warning").show().append("Username already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "emailTaken") {
							$("#flash-message").empty().addClass("alert alert-warning").show().append("Email address already taken.").delay( 5000 ).slideUp(300);	
						} else if (response === "err") {
							$("#flash-message").empty().addClass("alert alert-info").show().append("No changes for the user.").delay( 5000 ).slideUp(300);
							$modal.modal('toggle');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
							$('body').css('padding-right',0);
						}
					});
					request.fail(function(jqXHR, textStatus, errorThrown) {
						$("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
					});
				});
                $(".editUserPassword").on('submit', function(e) {
                    e.preventDefault();
                    if (request) {
                        request.abort();
                    }
                    var $form = $(this);
                    var $modal = $(this).closest('.modal');
                    request = $.ajax({
                        url: $form.attr("action"),
                        type: 'POST',
                        data: {
                            id: $form.find("input[name='id']").val(),
                            password: $form.find("input[name='password']").val(),
                        },
                    });
                    request.done(function(response, textStatus, jqXHR) {
                        if (response === "ok") {
                            $("#flash-message").empty().addClass("alert alert-success").show().append("Update user password successful!").delay( 5000 ).slideUp(300);
                            $form.find("input[name='password']").val("");
                            $modal.modal('toggle');
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $('body').css('padding-right',0);
                            getUser(userData);
                        }
                    });
                    request.fail(function(jqXHR, textStatus, errorThrown) {
                        $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
                    });
                });
			}
        });
        requestUser.fail(function(jqXHR, textStatus, errorThrown) {
        	$("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}
});
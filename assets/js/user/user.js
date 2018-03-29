$(document).ready(function() {
    var request;
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
});
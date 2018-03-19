$(document).ready(function() {
    var request;
    $("#login").on('click', function(e){
        e.preventDefault();
        if(request){
            request.abort();
        }
        var $form = $("#login-form");
        var $inputs = $form.find("input, select, button, textarea");
        var data = {
            username: $("#username").val(),
            password: $("#password").val(),
            login: $("#login").val(),
        };
        $inputs.prop("disabled", true);
        request = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: data,
        });
        request.done(function (response, textStatus, jqXHR){
            if (response==="Success") {
                $inputs.prop("disabled", false);
                $form.attr("action", "app/Controllers/LoginSuccessController.php");
                $form.submit();
            } else if (response==="Invalid") {
                $("#flash-message").empty().addClass("alert alert-danger").show().append("Wrong username or password.").fadeOut(5000);
            } else if (response==="DBError") {
                $("#flash-message").empty().addClass("alert alert-danger").show().append("Database connection error.").fadeOut(5000);
            }
        });
        request.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().show().append(errorThrown).fadeOut(5000);
        });
        request.always(function () {
            $inputs.prop("disabled", false);
        });
    });
});
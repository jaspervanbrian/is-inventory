$(document).ready(function() {
    var requestStockList;
	var requestPages;
    var currentPage;
    var totalPages;

    var sortBy = "name";
    var step = "ASC";

    var data = {
        type: $("#type").val(),
        keyword: $("#searchKeyword").val(),
    };
    getInventoryPages(data);
    getMainInventory(data);
    currentPage = 1;


    $("#searchKeyword").on('keyup', function(e){
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
        };
        getInventoryPages(data);
        getMainInventory(data);
        currentPage = 1;
    });

    $("#type").on('change', function(e){
        data = {
            type: $("#type").val(),
            keyword: $("#searchKeyword").val(),
        };
        getInventoryPages(data);
        getMainInventory(data);
        currentPage = 1;
    });

    $("#pagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (currentPage === totalPages) {
                    $("#pagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                currentPage -= 1;
                $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                data = {
                    type: $("#type").val(),
                    keyword: $("#searchKeyword").val(),
                    page: currentPage,
                    orderby: sortBy,
                    step: step,
                };
                getMainInventory(data);
                if (currentPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (currentPage === 1) {
                    $("#pagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                currentPage += 1;
                $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                data = {
                    type: $("#type").val(),
                    keyword: $("#searchKeyword").val(),
                    page: currentPage,
                    orderby: sortBy,
                    step: step,
                };
                getMainInventory(data);
                if (currentPage === totalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#pagination").find(':contains(' + currentPage + ')').removeClass('active');
                currentPage = parseInt($(this).text());
                $("#pagination").find(':contains(' + currentPage + ')').addClass('active');
                data = {
                    type: $("#type").val(),
                    keyword: $("#searchKeyword").val(),
                    page: currentPage,
                    orderby: sortBy,
                    step: step,
                };
                getMainInventory(data);
                if (currentPage === 1) {
                    $("#pagination").find(':contains("Previous")').addClass('disabled');
                    $("#pagination").find(':contains("Next")').removeClass('disabled');
                }
                if (currentPage === totalPages) {
                    $("#pagination").find(':contains("Previous")').removeClass('disabled');
                    $("#pagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    function getInventoryPages(data) {
        if(requestPages){
            requestPages.abort();
        }
        requestPages = $.ajax({
            url: '../../app/Controllers/Admin/PaginateInventory.php',
            type: 'POST',
            data: data,
        });
        requestPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 7) {
                $("#pagination").empty().append('<ul class="pagination"></ul>');
                var $pagination = $("#pagination").find('.pagination');
                $pagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                totalPages = Math.ceil((parseInt(response)/7));
                for (var i = 1; i <= totalPages; i++) {
                    if (i === 1) {
                        $pagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $pagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $pagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#pagination").empty();
            }
        })
        requestPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }

    function getMainInventory(data) 
    {
        if(requestStockList){
            requestStockList.abort();
        }
        var $form = $("#searchForm");
        requestStockList = $.ajax({
            url: $form.attr("action"),
            type: 'POST',
            data: data,
        });
        requestStockList.done(function (response, textStatus, jqXHR){
            var stocks = JSON.parse(response);
            if (stocks.length === 0) {
            	$("#stockList").empty().append('<div class="alert alert-danger">No results found.</div>');
                $("#stockModals").empty();
            } else {
                $("#stockModals").empty();
            	$("#stockList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th class="sortBy ' + (sortBy === "sticker_number" ? "sorted" : "") + '">Sticker number ' + (sortBy === "sticker_number" && step === "ASC" ? "<span class=\"fas fa-caret-down\"></span>" : (sortBy === "sticker_number" && step === "DESC" ? ("<span class=\"fas fa-caret-up\"></span>") : "")) + '</th><th class="sortBy ' + (sortBy === "name" ? "sorted" : "") + '">Name/Brand ' + (sortBy === "name" && step === "ASC" ? "<span class=\"fas fa-caret-down\"></span>" : (sortBy === "name" && step === "DESC" ? ("<span class=\"fas fa-caret-up\"></span>") : "")) + '</th><th class="sortBy ' + (sortBy === "category" ? "sorted" : "") + '">Category ' + (sortBy === "category" && step === "ASC" ? "<span class=\"fas fa-caret-down\"></span>" : (sortBy === "category" && step === "DESC" ? ("<span class=\"fas fa-caret-up\"></span>") : "")) + '</th><th class="sortBy ' + (sortBy === "status" ? "sorted" : "") + '">Status ' + (sortBy === "status" && step === "ASC" ? "<span class=\"fas fa-caret-down\"></span>" : (sortBy === "status" && step === "DESC" ? ("<span class=\"fas fa-caret-up\"></span>") : "")) + '</th></tr></thead><tbody></tbody></table>');
                $(".sortBy").on('click', function() {
                    var text = $.trim($(this).text());
                    var sorted = $.trim($("#stockList").find(".sorted").text());
                    
                    if (text === "Sticker number") {
                        sortBy = "sticker_number";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Name/Brand") {
                        sortBy = "name";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Category") {
                        sortBy = "category";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    } else if (text === "Status") {
                        sortBy = "status";
                        if (text === sorted) {
                            if (step === "ASC") {
                                step = "DESC";
                            } else if (step === "DESC") {
                                step = "ASC";
                            }
                        } else {
                            step = "ASC";
                        }
                        data = {
                            type: $("#type").val(),
                            keyword: $("#searchKeyword").val(),
                            page: currentPage,
                            orderby: sortBy,
                            step: step,
                        };
                        getMainInventory(data);
                    }
                });
            	$stockRows = $("#stockList").find('tbody');
            	$.each(stocks, function(i, stock) {
                    if (stock.status === "Available") {
                        $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.sticker_number + '</td><td>' + stock.name + '</td><td>' + stock.category + '</td><td class="text-success">' + stock.status + '</td></tr>');
                        $("#stockModals").append('<div class="modal fade" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">' + stock.name + ' # ' + stock.sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <form action="../../app/Controllers/Admin/EditStockDetails.php" method="POST"> <input type="hidden" name="id" value="' + stock.id + '"> <div class="row"> <div class="col-12"> <h3>Stock Details</h3> </div></div><hr> <div class="row top-margin"> <div class="col-5"> <small>Sticker number:</small> <input type="text" name="sticker_number" class="form-control" value="' + stock.sticker_number + '" required> </div><div class="col-7"> <small>Stock name/brand:</small> <input type="text" name="name" class="form-control" value="' + stock.name + '" required> </div></div><div class="row top-margin"> <div class="col-5"> <small>Category:</small> <input type="text" name="category" class="form-control" value="' + stock.category + '" required> </div><div class="col-7"> <small>Status:</small> <select name="status" class="form-control" required> <option value="Available" ' + (stock.status==="Available" ? "selected" : "") + '>Available</option> <option value="Borrowed" ' + (stock.status==="Borrowed" ? "selected" : "") + '>Borrowed</option> <option value="Maintenance/Repair" ' + (stock.status==="Maintenance/Repair" ? "selected" : "") + '>Maintenance/Repair</option> <option value="Removed/Deprecated" ' + (stock.status==="Removed/Deprecated" ? "selected" : "") + '>Removed/Deprecated</option> </select> </div></div><hr> <div class="row top-margin"> <div class="col-4"> <small>Owner:</small> <input type="text" name="owner" class="form-control" value="' + stock.owner + '" required> </div><div class="col-4"> <small>Supplier:</small> <input type="text" name="supplier" class="form-control" value="' + stock.supplier + '" required> </div><div class="col-4"> <small>Acquisition Date:</small> <input type="date" name="acquisition_date" class="form-control" value="' + stock.acquisition_date + '" required> </div></div><hr> <div class="row"> <div class="col-12"> <small>Description:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="description" cols="30" rows="10">' + stock.description + '</textarea> </div></div><hr> <div class="row"> <div class="col-12"> <small>Depreciation info:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="depreciation_info" cols="30" rows="10">' + stock.depreciation_info + '</textarea> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
                    } else if (stock.status === "Borrowed") {
                        $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.sticker_number + '</td><td>' + stock.name + '</td><td>' + stock.category + '</td><td class="text-warning">' + stock.status + '</td></tr>');
                        $("#stockModals").append('<div class="modal fade" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">' + stock.name + ' # ' + stock.sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <form action="../../app/Controllers/Admin/EditStockDetails.php" method="POST"> <input type="hidden" name="id" value="' + stock.id + '"> <div class="row"> <div class="col-12"> <h3>Stock Details</h3> </div></div><hr> <div class="row top-margin"> <div class="col-5"> <small>Sticker number:</small> <input type="text" name="sticker_number" class="form-control" value="' + stock.sticker_number + '" required> </div><div class="col-7"> <small>Stock name/brand:</small> <input type="text" name="name" class="form-control" value="' + stock.name + '" required> </div></div><div class="row top-margin"> <div class="col-5"> <small>Category:</small> <input type="text" name="category" class="form-control" value="' + stock.category + '" required> </div><div class="col-7"> <small>Status:</small> <select name="status" class="form-control" required> <option value="Available" ' + (stock.status==="Available" ? "selected" : "") + '>Available</option> <option value="Borrowed" ' + (stock.status==="Borrowed" ? "selected" : "") + '>Borrowed</option> <option value="Maintenance/Repair" ' + (stock.status==="Maintenance/Repair" ? "selected" : "") + '>Maintenance/Repair</option> <option value="Removed/Deprecated" ' + (stock.status==="Removed/Deprecated" ? "selected" : "") + '>Removed/Deprecated</option> </select> </div></div><hr> <div class="row top-margin"> <div class="col-4"> <small>Owner:</small> <input type="text" name="owner" class="form-control" value="' + stock.owner + '" required> </div><div class="col-4"> <small>Supplier:</small> <input type="text" name="supplier" class="form-control" value="' + stock.supplier + '" required> </div><div class="col-4"> <small>Acquisition Date:</small> <input type="date" name="acquisition_date" class="form-control" value="' + stock.acquisition_date + '" required> </div></div><hr> <div class="row"> <div class="col-12"> <small>Description:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="description" cols="30" rows="10">' + stock.description + '</textarea> </div></div><hr> <div class="row"> <div class="col-12"> <small>Depreciation info:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="depreciation_info" cols="30" rows="10">' + stock.depreciation_info + '</textarea> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
                    } else if (stock.status === "Maintenance/Repair") {
                        $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.sticker_number + '</td><td>' + stock.name + '</td><td>' + stock.category + '</td><td class="text-primary">' + stock.status + '</td></tr>');
                        $("#stockModals").append('<div class="modal fade" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">' + stock.name + ' # ' + stock.sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <form action="../../app/Controllers/Admin/EditStockDetails.php" method="POST"> <input type="hidden" name="id" value="' + stock.id + '"> <div class="row"> <div class="col-12"> <h3>Stock Details</h3> </div></div><hr> <div class="row top-margin"> <div class="col-5"> <small>Sticker number:</small> <input type="text" name="sticker_number" class="form-control" value="' + stock.sticker_number + '" required> </div><div class="col-7"> <small>Stock name/brand:</small> <input type="text" name="name" class="form-control" value="' + stock.name + '" required> </div></div><div class="row top-margin"> <div class="col-5"> <small>Category:</small> <input type="text" name="category" class="form-control" value="' + stock.category + '" required> </div><div class="col-7"> <small>Status:</small> <select name="status" class="form-control" required> <option value="Available" ' + (stock.status==="Available" ? "selected" : "") + '>Available</option> <option value="Borrowed" ' + (stock.status==="Borrowed" ? "selected" : "") + '>Borrowed</option> <option value="Maintenance/Repair" ' + (stock.status==="Maintenance/Repair" ? "selected" : "") + '>Maintenance/Repair</option> <option value="Removed/Deprecated" ' + (stock.status==="Removed/Deprecated" ? "selected" : "") + '>Removed/Deprecated</option> </select> </div></div><hr> <div class="row top-margin"> <div class="col-4"> <small>Owner:</small> <input type="text" name="owner" class="form-control" value="' + stock.owner + '" required> </div><div class="col-4"> <small>Supplier:</small> <input type="text" name="supplier" class="form-control" value="' + stock.supplier + '" required> </div><div class="col-4"> <small>Acquisition Date:</small> <input type="date" name="acquisition_date" class="form-control" value="' + stock.acquisition_date + '" required> </div></div><hr> <div class="row"> <div class="col-12"> <small>Description:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="description" cols="30" rows="10">' + stock.description + '</textarea> </div></div><hr> <div class="row"> <div class="col-12"> <small>Depreciation info:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="depreciation_info" cols="30" rows="10">' + stock.depreciation_info + '</textarea> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
                    } else if (stock.status === "Removed/Deprecated") {
                        $stockRows.append('<tr data-toggle="modal" data-target="#stock' + stock.id + '"><td>' + stock.sticker_number + '</td><td>' + stock.name + '</td><td>' + stock.category + '</td><td class="text-danger">' + stock.status + '</td></tr>');
                        $("#stockModals").append('<div class="modal fade" id="stock' + stock.id + '" tabindex="-1" role="dialog" aria-labelledby="stockModal' + stock.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="stockModal' + stock.id + '">' + stock.name + ' # ' + stock.sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <form action="../../app/Controllers/Admin/EditStockDetails.php" method="POST"> <input type="hidden" name="id" value="' + stock.id + '"> <div class="row"> <div class="col-12"> <h3>Stock Details</h3> </div></div><hr> <div class="row top-margin"> <div class="col-5"> <small>Sticker number:</small> <input type="text" name="sticker_number" class="form-control" value="' + stock.sticker_number + '" required> </div><div class="col-7"> <small>Stock name/brand:</small> <input type="text" name="name" class="form-control" value="' + stock.name + '" required> </div></div><div class="row top-margin"> <div class="col-5"> <small>Category:</small> <input type="text" name="category" class="form-control" value="' + stock.category + '" required> </div><div class="col-7"> <small>Status:</small> <select name="status" class="form-control" required> <option value="Available" ' + (stock.status==="Available" ? "selected" : "") + '>Available</option> <option value="Borrowed" ' + (stock.status==="Borrowed" ? "selected" : "") + '>Borrowed</option> <option value="Maintenance/Repair" ' + (stock.status==="Maintenance/Repair" ? "selected" : "") + '>Maintenance/Repair</option> <option value="Removed/Deprecated" ' + (stock.status==="Removed/Deprecated" ? "selected" : "") + '>Removed/Deprecated</option> </select> </div></div><hr> <div class="row top-margin"> <div class="col-4"> <small>Owner:</small> <input type="text" name="owner" class="form-control" value="' + stock.owner + '" required> </div><div class="col-4"> <small>Supplier:</small> <input type="text" name="supplier" class="form-control" value="' + stock.supplier + '" required> </div><div class="col-4"> <small>Acquisition Date:</small> <input type="date" name="acquisition_date" class="form-control" value="' + stock.acquisition_date + '" required> </div></div><hr> <div class="row"> <div class="col-12"> <small>Description:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="description" cols="30" rows="10">' + stock.description + '</textarea> </div></div><hr> <div class="row"> <div class="col-12"> <small>Depreciation info:</small> </div></div><div class="row"> <div class="col-12"> <textarea class="form-control" name="depreciation_info" cols="30" rows="10">' + stock.depreciation_info + '</textarea> </div></div><div class="row top-margin"> <div class="col-12 d-flex justify-content-center"> <button type="submit" class="btn btn-primary">Save changes</button> </div></div></form> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
                    }
            		
            	});
            }
        });
        requestStockList.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
});
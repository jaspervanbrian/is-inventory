$(document).ready(function() {
	var requestToReturn;
	var requestHistoryPages;
	var requestHistory;
	var historyListPage = 1;
	var historyListTotalPages;
	var data = {
		page: historyListPage,
	};

	getToReturnList();
	getHistoryPages();
	getIssueHistory(data);

	$("#historyListPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (historyListPage === historyListTotalPages) {
                    $("#historyListPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#historyListPagination").find(':contains(' + historyListPage + ')').removeClass('active');
                historyListPage -= 1;
                $("#historyListPagination").find(':contains(' + historyListPage + ')').addClass('active');
                data = {
                    page: historyListPage,
                };
                getIssueHistory(data);
                if (historyListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (historyListPage === 1) {
                    $("#historyListPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#historyListPagination").find(':contains(' + historyListPage + ')').removeClass('active');
                historyListPage += 1;
                $("#historyListPagination").find(':contains(' + historyListPage + ')').addClass('active');
                data = {
                    page: historyListPage,
                };
                getIssueHistory(data);
                if (historyListPage === historyListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#historyListPagination").find(':contains(' + historyListPage + ')').removeClass('active');
                historyListPage = parseInt($(this).text());
                $("#historyListPagination").find(':contains(' + historyListPage + ')').addClass('active');
                data = {
                    page: historyListPage,
                };
                getIssueHistory(data);
                if (historyListPage === 1) {
                    $("#historyListPagination").find(':contains("Previous")').addClass('disabled');
                    $("#historyListPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (historyListPage === historyListTotalPages) {
                    $("#historyListPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#historyListPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

	function getToReturnList() 
	{
		if (requestToReturn) {
			requestToReturn.abort();
		}
		requestToReturn = $.ajax({
			url: '../../app/Controllers/User/ReturnList.php',
			type: 'GET',
		});
		requestToReturn.done(function(response, textStatus, jqXHR) {
			var returnList = JSON.parse(response);
			if (returnList.length === 0) {
				$("#toReturnList").empty().append('<div class="alert alert-info">You have no borrowed items.</div>');
				$("#returnModals").empty();
			} else {
				$("#returnModals").empty();
				$("#toReturnList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Sticker #</th><th>Name/Brand</th><th>Category</th><th>Borrowed by</th><th>Date</th><th>Time Borrowed</th></tr></thead><tbody></tbody></table>');
				$returnListBody = $("#toReturnList").find('tbody');
				$.each(returnList, function(i, issue) {
					$returnListBody.append('<tr data-toggle="modal" data-target="#return' + issue.stock_id + '"><td>' + issue.stock_sticker_number + '</td><td>' + issue.stock_name + '</td><td>' + issue.stock_category + '</td><td>' + issue.user_name + '</td><td>' + issue.issue_date + '</td><td>' + issue.issue_time + '</td></tr>');
					$("#returnModals").append('<div class="modal fade" id="return' + issue.stock_id + '" tabindex="-1" role="dialog" aria-labelledby="returnModal' + issue.stock_id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="returnModal' + issue.stock_id + '">' + issue.stock_name + ' # ' + issue.stock_sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <ul class="nav nav-tabs"> <li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#returnDetails' + issue.stock_id + '">Details</a> </li><li class="nav-item"> <a class="nav-link" data-toggle="tab" href="#returnMenu' + issue.stock_id + '">Return</a> </li></ul> <div class="tab-content"> <div class="tab-pane fade show active container" id="returnDetails' + issue.stock_id + '"> <div class="row"> <div class="col-12"> <h3>Borrow Transaction Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Sticker number:</small> <h5>' + issue.stock_sticker_number + '</h5> </div><div class="col-6"> <small>Stock name/brand:</small> <h5>' + issue.stock_name + '</h5> </div></div><div class="row top-margin"> <div class="col-6"> <small>Category:</small> <h5>' + issue.stock_category + '</h5> </div><div class="col-6"> <small>Borrowed by:</small> <h5>' + issue.user_name + '</h5> </div></div><hr> <div class="row"> <div class="col-6"> <small>Date borrowed:</small> <h5>' + issue.issue_date + '</h5> </div><div class="col-6"> <small>Time borrowed:</small> <h5>' + issue.issue_time + '</h5> </div></div><hr> <div class="row"> <div class="col-12"> <small>Additional info:</small> <p>' + issue.additional_info + '</p></div></div></div><div class="tab-pane fade container" id="returnMenu' + issue.stock_id + '"> <div class="row"> <div class="col-12"> <h3>Issue return</h3> </div></div><hr> <div class="row"> <div class="col-12"> <form action="../../app/Controllers/User/IssueReturn.php" method="POST"> <input type="hidden" name="issue_id" value="' + issue.id + '"> <input type="hidden" name="stock_id" value="' + issue.stock_id + '"> <div class="form-group"> <h5>Additional info:</h5> <textarea name="additional_info" cols="30" rows="10" class="form-control"></textarea> </div><div class="form-group d-flex justify-content-center top-margin"> <button type="submit" class="btn btn-success">Return Item</button> </div></form> </div></div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
				});
			}
		});
		requestToReturn.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
		});
	}
	function getHistoryPages() 
	{
        if(requestHistoryPages){
            requestHistoryPages.abort();
        }
        requestHistoryPages = $.ajax({
            url: '../../app/Controllers/User/HistoryPaginate.php',
            type: 'POST',
        });
        requestHistoryPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#historyListPagination").empty().append('<ul class="pagination"></ul>');
                var $historyListPagination = $("#historyListPagination").find('.pagination');
                $historyListPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                historyListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= historyListTotalPages; i++) {
                    if (i === 1) {
                        $historyListPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $historyListPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $historyListPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#historyListPagination").empty();
            }
        })
        requestHistoryPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
	function getIssueHistory(data) 
	{
		if(requestHistory){
            requestHistory.abort();
        }
        requestHistory = $.ajax({
        	url: '../../app/Controllers/User/IssueHistory.php',
        	type: 'POST',
        	data: data,
        });
        requestHistory.done(function(response, textStatus, jqXHR) {
        	var historyList = JSON.parse(response);
			if (historyList.length === 0) {
				$("#historyList").empty().append('<div class="alert alert-info">You have no borrowed items.</div>');
				$("#issueModals").empty();
			} else {
				$("#issueModals").empty();
				$("#historyList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name/Brand</th><th>Category</th><th>Issue type</th><th>Issued by</th><th>Date</th><th>Time Issued</th></tr></thead><tbody></tbody></table>');
				$historyListBody = $("#historyList").find('tbody');
				$.each(historyList, function(i, issue) {
					$historyListBody.append('<tr data-toggle="modal" data-target="#history' + issue.id + '"><td>' + issue.stock_name + ' # ' + issue.stock_sticker_number + '</td><td>' + issue.stock_category + '</td><td class="text-' + (issue.issue_type === "Return" ? "success" : "warning") + '">' + issue.issue_type + '</td><td>' + issue.user_name + '</td><td>' + issue.issue_date + '</td><td>' + issue.issue_time + '</td></tr>');
					$("#issueModals").append('<div class="modal fade" id="history' + issue.id + '" tabindex="-1" role="dialog" aria-labelledby="historyModal' + issue.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="historyModal' + issue.id + '">' + issue.stock_name + ' # ' + issue.stock_sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <div class="row"> <div class="col-12"> <h3>Transaction Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Sticker number:</small> <h5>' + issue.stock_sticker_number + '</h5> </div><div class="col-6"> <small>Stock name/brand:</small> <h5>' + issue.stock_name + '</h5> </div></div><div class="row top-margin"> <div class="col-12"> <small>Category:</small> <h5>' + issue.stock_category + '</h5> </div></div><hr> <div class="row"> <div class="col-6"> <small>Issued by:</small> <h5>' + issue.user_name + '</h5> </div><div class="col-6"> <small>Issue type:</small> <h5 class="text-' + (issue.issue_type === "Return" ? "success" : "warning") + '">' + issue.issue_type + '</h5> </div></div><div class="row top-margin"> <div class="col-6"> <small>Date issued:</small> <h5>' + issue.issue_date + '</h5> </div><div class="col-6"> <small>Time issued:</small> <h5>' + issue.issue_time + '</h5> </div></div><hr> <div class="row"> <div class="col-12"> <small>Additional info:</small> <p>' + issue.additional_info + '</p></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
				});
			}
        });
        requestHistory.fail(function(jqXHR, textStatus, errorThrown) {
        	$("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}
});
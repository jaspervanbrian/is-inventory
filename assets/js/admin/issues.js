$(document).ready(function() {
	var requestBorrowedPages;
    var requestBorrowed;
    var borrowListPage = 1;
    var borrowListTotalPages;
    
    var requestIssuesPages;
    var requestIssues;
	var issueListPage = 1;
	var issueListTotalPages;

	var borrowData = {
		page: borrowListPage,
	};
    var issueData = {
        page: issueListPage,
    };

    getBorrowPages();
    getBorrowedItems(borrowData);
	getIssuePages();
	getIssues(issueData);

	$("#borrowedItemsPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (borrowListPage === borrowListTotalPages) {
                    $("#borrowedItemsPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').removeClass('active');
                borrowListPage -= 1;
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').addClass('active');
                borrowData = {
                    page: borrowListPage,
                };
                getBorrowedItems(borrowData);
                if (borrowListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (borrowListPage === 1) {
                    $("#borrowedItemsPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').removeClass('active');
                borrowListPage += 1;
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').addClass('active');
                borrowData = {
                    page: borrowListPage,
                };
                getBorrowedItems(borrowData);
                if (borrowListPage === borrowListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').removeClass('active');
                borrowListPage = parseInt($(this).text());
                $("#borrowedItemsPagination").find(':contains(' + borrowListPage + ')').addClass('active');
                borrowData = {
                    page: borrowListPage,
                };
                getBorrowedItems(borrowData);
                if (borrowListPage === 1) {
                    $("#borrowedItemsPagination").find(':contains("Previous")').addClass('disabled');
                    $("#borrowedItemsPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (borrowListPage === borrowListTotalPages) {
                    $("#borrowedItemsPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#borrowedItemsPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });

    $("#allIssuesPagination").on('click', '.page-item', function() {
        if (!($(this).hasClass("disabled")))
        {
            if ($.trim($(this).text()) === "Previous") {
                if (issueListPage === issueListTotalPages) {
                    $("#allIssuesPagination").find(':contains("Next")').removeClass('disabled');
                }
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').removeClass('active');
                issueListPage -= 1;
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').addClass('active');
                issueData = {
                    page: issueListPage,
                };
                getIssues(issueData);
                if (issueListPage === 1) {
                    $(this).addClass('disabled');
                }
            } else if ($.trim($(this).text()) === "Next") {
                if (issueListPage === 1) {
                    $("#allIssuesPagination").find(':contains("Previous")').removeClass('disabled');
                }
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').removeClass('active');
                issueListPage += 1;
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').addClass('active');
                issueData = {
                    page: issueListPage,
                };
                getIssues(issueData);
                if (issueListPage === issueListTotalPages) {
                    $(this).addClass('disabled');
                }
            } else {
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').removeClass('active');
                issueListPage = parseInt($(this).text());
                $("#allIssuesPagination").find(':contains(' + issueListPage + ')').addClass('active');
                issueData = {
                    page: issueListPage,
                };
                getIssues(issueData);
                if (issueListPage === 1) {
                    $("#allIssuesPagination").find(':contains("Previous")').addClass('disabled');
                    $("#allIssuesPagination").find(':contains("Next")').removeClass('disabled');
                }
                if (issueListPage === issueListTotalPages) {
                    $("#allIssuesPagination").find(':contains("Previous")').removeClass('disabled');
                    $("#allIssuesPagination").find(':contains("Next")').addClass('disabled');
                }
            }
        }
    });
    function getBorrowPages() 
    {
        if(requestBorrowedPages){
            requestBorrowedPages.abort();
        }
        requestBorrowedPages = $.ajax({
            url: '../../app/Controllers/Admin/BorrowedItemsPaginate.php',
            type: 'POST',
        });
        requestBorrowedPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#borrowedItemsPagination").empty().append('<ul class="pagination"></ul>');
                var $borrowedItemsPagination = $("#borrowedItemsPagination").find('.pagination');
                $borrowedItemsPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                borrowListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= borrowListTotalPages; i++) {
                    if (i === 1) {
                        $borrowedItemsPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $borrowedItemsPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $borrowedItemsPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#borrowedItemsPagination").empty();
            }
        })
        requestBorrowedPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
	function getBorrowedItems(borrowData) 
	{
		if (requestBorrowed) {
			requestBorrowed.abort();
		}
		requestBorrowed = $.ajax({
			url: '../../app/Controllers/Admin/BorrowedItems.php',
			type: 'POST',
            data: borrowData,
		});
		requestBorrowed.done(function(response, textStatus, jqXHR) {
			var borrowedList = JSON.parse(response);
			if (borrowedList.length === 0) {
				$("#borrowedItemsList").empty().append('<div class="alert alert-info">There are currently no borrowed items.</div>');
				$("#borrowModals").empty();
			} else {
				$("#borrowModals").empty();
				$("#borrowedItemsList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Sticker #</th><th>Name/Brand</th><th>Category</th><th>Borrowed by</th><th>Date</th><th>Time Borrowed</th></tr></thead><tbody></tbody></table>');
				$borrowedListBody = $("#borrowedItemsList").find('tbody');
				$.each(borrowedList, function(i, borrow) {
					$borrowedListBody.append('<tr data-toggle="modal" data-target="#borrow' + borrow.stock_id + '"><td>' + borrow.stock_sticker_number + '</td><td>' + borrow.stock_name + '</td><td>' + borrow.stock_category + '</td><td>' + borrow.user_name + '</td><td>' + borrow.issue_date + '</td><td>' + borrow.issue_time + '</td></tr>');
					$("#borrowModals").append('<div class="modal fade" id="borrow' + borrow.stock_id + '" tabindex="-1" role="dialog" aria-labelledby="borrowModal' + borrow.stock_id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="borrowModal' + borrow.stock_id + '">' + borrow.stock_name + ' # ' + borrow.stock_sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div><div class="modal-body"> <div class="row"> <div class="col-12"> <h3>Borrow Transaction Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Sticker number:</small> <h5>' + borrow.stock_sticker_number + '</h5> </div><div class="col-6"> <small>Stock name/brand:</small> <h5>' + borrow.stock_name + '</h5> </div></div><div class="row top-margin"> <div class="col-6"> <small>Category:</small> <h5>' + borrow.stock_category + '</h5> </div><div class="col-6"> <small>Borrowed by:</small> <h5>' + borrow.user_name + '</h5> </div></div><hr> <div class="row"> <div class="col-6"> <small>Date borrowed:</small> <h5>' + borrow.issue_date + '</h5> </div><div class="col-6"> <small>Time borrowed:</small> <h5>' + borrow.issue_time + '</h5> </div></div><hr> <div class="row"> <div class="col-12"> <small>Additional info:</small> <p>' + borrow.additional_info + '</p></div></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div>');
				});
			}
		});
		requestBorrowed.fail(function(jqXHR, textStatus, errorThrown) {
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
		});
	}
	function getIssuePages() 
	{
        if(requestIssuesPages){
            requestIssuesPages.abort();
        }
        requestIssuesPages = $.ajax({
            url: '../../app/Controllers/Admin/IssuePaginate.php',
            type: 'POST',
        });
        requestIssuesPages.done(function(response, textStatus, jqXHR) {
            if (parseInt(response) > 8) {
                $("#allIssuesPagination").empty().append('<ul class="pagination"></ul>');
                var $allIssuesPagination = $("#allIssuesPagination").find('.pagination');
                $allIssuesPagination.append('<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>');
                issueListTotalPages = Math.ceil((parseInt(response)/8));
                for (var i = 1; i <= issueListTotalPages; i++) {
                    if (i === 1) {
                        $allIssuesPagination.append('<li class="page-item active"><a class="page-link" href="#">' + i + '</a></li>');
                    } else {
                        $allIssuesPagination.append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
                    }
                }
                $allIssuesPagination.append('<li class="page-item"><a class="page-link" href="#">Next</a></li>');
            } else {
                $("#allIssuesPagination").empty();
            }
        })
        requestIssuesPages.fail(function (jqXHR, textStatus, errorThrown){
            $("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
    }
	function getIssues(issueData) 
	{
		if(requestIssues){
            requestIssues.abort();
        }
        requestIssues = $.ajax({
        	url: '../../app/Controllers/Admin/Issues.php',
        	type: 'POST',
        	data: issueData,
        });
        requestIssues.done(function(response, textStatus, jqXHR) {
        	var allIssuesList = JSON.parse(response);
			if (allIssuesList.length === 0) {
				$("#allIssuesList").empty().append('<div class="alert alert-info">There are no transactions yet.</div>');
				$("#issueModals").empty();
			} else {
				$("#issueModals").empty();
				$("#allIssuesList").empty().append('<table class="table table-hover"><thead class="thead-dark"><tr><th>Name/Brand</th><th>Category</th><th>Issue type</th><th>Issued by</th><th>Date</th><th>Time Issued</th></tr></thead><tbody></tbody></table>');
				$allIssuesListBody = $("#allIssuesList").find('tbody');
				$.each(allIssuesList, function(i, issue) {
					$allIssuesListBody.append('<tr data-toggle="modal" data-target="#history' + issue.id + '"><td>' + issue.stock_name + ' # ' + issue.stock_sticker_number + '</td><td>' + issue.stock_category + '</td><td class="text-' + (issue.issue_type === "Return" ? "success" : "warning") + '">' + issue.issue_type + '</td><td>' + issue.user_name + '</td><td>' + issue.issue_date + '</td><td>' + issue.issue_time + '</td></tr>');
					$("#issueModals").append('<div class="modal fade" id="history' + issue.id + '" tabindex="-1" role="dialog" aria-labelledby="historyModal' + issue.id + '" aria-hidden="true"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="historyModal' + issue.id + '">' + issue.stock_name + ' # ' + issue.stock_sticker_number + '</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> </div><div class="modal-body"> <div class="row"> <div class="col-12"> <h3>Transaction Details</h3> </div></div><hr> <div class="row"> <div class="col-6"> <small>Sticker number:</small> <h5>' + issue.stock_sticker_number + '</h5> </div><div class="col-6"> <small>Stock name/brand:</small> <h5>' + issue.stock_name + '</h5> </div></div><div class="row top-margin"> <div class="col-12"> <small>Category:</small> <h5>' + issue.stock_category + '</h5> </div></div><hr> <div class="row"> <div class="col-6"> <small>Issued by:</small> <h5>' + issue.user_name + '</h5> </div><div class="col-6"> <small>Issue type:</small> <h5 class="text-' + (issue.issue_type==="Return" ? "success" : "warning") + '">' + issue.issue_type + '</h5> </div></div><div class="row top-margin"> <div class="col-6"> <small>Date issued:</small> <h5>' + issue.issue_date + '</h5> </div><div class="col-6"> <small>Time issued:</small> <h5>' + issue.issue_time + '</h5> </div></div><div class="row top-margin"> <div class="col-6"> <small>This item was returned?:</small> <h5 class="text-' + ((issue.is_returned=="0") ? "danger" : "success") + '">' + ((issue.is_returned=="0") ? "Not Yet" : "Yes") + '</h5> </div></div><hr> <div class="row"> <div class="col-12"> <small>Additional info:</small> <p>' + issue.additional_info + '</p></div></div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div></div></div></div></div>');
				});
			}
        });
        requestIssues.fail(function(jqXHR, textStatus, errorThrown) {
        	$("#flash-message").empty().addClass("alert alert-danger").show().append(errorThrown).delay( 5000 ).slideUp(300);
        });
	}
});
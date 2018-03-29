$(document).ready(function() {
	$("input").on('keydown', function(e) {
		if($.trim($(this).val()) === "") {
			if(e.which === 32) {
				return false;
			}
		}
	});
});
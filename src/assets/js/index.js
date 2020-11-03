$(document).on('click', '', function(e) {
	if(!$('[data-toggle="tooltip"]').length) {
		setTimeout(() => {
			$('[data-toggle="tooltip"]').tooltip()
		}, 2000);
	}
})
$(function () {
	setTimeout(() => {
		$('[data-toggle="tooltip"]').tooltip()
	}, 2000)
	$(document).on('click','[data-toggle="collapse"]', function(e) {
		let target = $(e.target).data('target');
		$(target).hasClass('show') ? $(target).collapse('hide') : null
	});
	$(document).on('focusin', function(e) {
		if ($(e.target).closest(".mce-window").length) {
			e.stopImmediatePropagation();
		}
	});
})
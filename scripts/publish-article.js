jQuery(function($) {
	/**********************************************************************************************/
	/**********************************     PUBLISH  ARTICLE     **********************************/
	/**********************************************************************************************/
	$("body").on("click", ".page-grid .grid-block__btns .grid-block__publish", function(e) {
		e.preventDefault();
		
		var $btn = $(this);
		var action = $btn.data("href");
		
		var data = new FormData();
		data.append( 'post_id', $btn.data("id") );
		if ( $btn.closest(".grid-block").hasClass("grid-post") )
			data.append( 'type', 'post' );
		else if ( $btn.closest(".grid-block").hasClass("grid-conf") )
			data.append( 'type', 'conf' );
		
		$.ajax({
			method: 'POST',
			url: action,
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					$("body").addClass("popup-on");
					if ( $btn.closest(".grid-block").hasClass("grid-post") )
						$("#add-post-pending").addClass("show");
					else if ( $btn.closest(".grid-block").hasClass("grid-conf") )
						$("#add-conf-pending").addClass("show");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
			}
		});
	});
});
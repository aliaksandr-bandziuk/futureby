jQuery(function($) {
	/**********************************************************************************************/
	/**********************************        CONF  INFO        **********************************/
	/**********************************************************************************************/
	$(".page-conf-info__showmore").click(function() {
		var type = $(".page-conf-info__nav .tabs__item.active").data("id");
		$(".speaker-item.hide."+ type).removeClass("hide");
		$(".page-conf-info__showmore").addClass("hide");
	});
	
	
	/**********************************************************************************************/
	/**********************************************************************************************/
	$(".page-conf-info .tabs__item").click(function(e) {
		e.preventDefault();
		var $tabs = $(this).closest(".tabs");
		if ( !$(this).hasClass("active") ) {
			$tabs.find(".active").removeClass("active");
			$(this).addClass("active");
			
			$(".speaker-item").addClass("hide");
			$(".speaker-item."+ $(this).data("id")).each(function( index ) {
				if ( index < 3 ) $(this).removeClass("hide");
			});
			
			$(".page-conf-info__showmore").removeClass("hide");
			if ( $(".speaker-item."+ $(this).data("id")).length <= 3 )
				$(".page-conf-info__showmore").addClass("hide");
		}
	});
	
	
	/**********************************************************************************************/
	/**********************************************************************************************/
	$(".page-conf-info .speaker-item__btns .btn").click(function() {
		var $btn = $(this);
		if ( !$btn.hasClass("on") ) {
			$btn.addClass("disabled");

			var data = new FormData();
			data.append( 'post_id', $(".page-conf-info__conf").data("post") );
			data.append( 'user', $btn.closest(".speaker-item").data("id") );
			data.append( 'status', $btn.data("id") );

			$.ajax({
				method: 'POST',
				url: '/wp-content/themes/factory16/inc/actions/change-speaker-status.php',
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				data: data,
				success: function(data) {
					$btn.removeClass("disabled");
					$btn.closest(".speaker-item__btns").addClass("has-on");
					data = $.parseJSON( data );
					if ( data.status == 'ok' ) {
						$btn.closest(".speaker-item__btns").find(".btn.on").removeClass("on");
						$btn.addClass("on");
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$btn.removeClass("disabled");
					console.log( textStatus, errorThrown );
				}
			});
		}
	});
});
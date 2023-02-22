jQuery(function($) {
	/**********************************************************************************************/
	/**********************************      FILL USER INFO      **********************************/
	/**********************************************************************************************/
	$(".formarea #fill-user-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#fill-user-login").val() );
			
			if ( $("#fill-user-email").length )
				data.append( 'email', $("#fill-user-email").val() );
			if ( $("#fill-user-name-1").length )
				data.append( 'name-1', $("#fill-user-name-1").val() );
			if ( $("#fill-user-name-2").length )
				data.append( 'name-2', $("#fill-user-name-2").val() );
			if ( $("#fill-user-tel").length )
				data.append( 'tel', $("#fill-user-tel").val() );
			
			$.ajax({
				method: 'POST',
				url: $(form).attr("action"),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				data: data,
				success: function(data) {
					data = $.parseJSON( data );
					if ( data.status == 'ok' ) {
						$(form).find(".formarea__error").removeClass("show").text("");
						$(form).find(".formarea__submit").removeClass("disabled");
						$(".popup.show").removeClass("show");
						$("body").removeClass("popup-on");
						$(".page-add-article__body .formarea__submit").removeClass("fill-info");
						$(".page-add-article__body form").submit();
					}
					else if ( data.status == 'error' ) {
						$(form).find(".formarea__error").addClass("show").text( data.error );
						$(form).find(".formarea__submit").removeClass("disabled");
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$(form).find(".formarea__error").addClass("show").text( errorThrown );
					$(form).find(".formarea__submit").removeClass("disabled");
					console.log( textStatus, errorThrown );
				}
			});
        }
	});
});
jQuery(function($) {
	/**********************************************************************************************/
	/**********************************       FORGOT  PASS       **********************************/
	/**********************************************************************************************/
	$(".formarea #forgot-pass-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#forgot-pass-form #forgot-pass-user").val() );
			
			$.ajax({
				method: 'POST',
				url: $(form).attr("action"),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				data: data,
				success: function(data) {
					$(form).find(".formarea__submit").removeClass("disabled");
					data = $.parseJSON( data );
					if ( data.status == 'ok' ) {
						$("#forgot-pass-form")[0].reset();
						$("#forgot-pass-form .formarea__error").text("");
						$(".popup.show").removeClass("show");
						$("#forgot-pass-sent .popup__txt span").text( data.email );
						$("#forgot-pass-sent").addClass("show");
					}
					else if ( data.status == 'error' ) {
						$("#forgot-pass-sent .popup__txt span").text("");
						$(form).find(".formarea__error").addClass("show").text( data.error );
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
	
	
	
	/**********************************************************************************************/
	/**********************************        RESET PASS        **********************************/
	/**********************************************************************************************/
	$(".formarea #reset-pass-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#reset-pass-form #reset-pass-user").val() );
			data.append( 'pass-new', $("#reset-pass-form #reset-pass-pwd").val() );
			
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
						$("#reset-pass-form")[0].reset();
						$(form).find(".formarea__error").addClass("show").text("");
						$(form).find(".formarea__submit").removeClass("disabled");
						$(".popup.show").removeClass("show");
						$("#reset-pass-done").addClass("show");
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
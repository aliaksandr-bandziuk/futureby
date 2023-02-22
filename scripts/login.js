jQuery(function($) {
	/**********************************************************************************************/
	/**********************************     FORMAREA - LOGIN     **********************************/
	/**********************************************************************************************/
	$(".formarea #login-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			
			data.append( 'user', $("#login-form #login-user").val() );
			data.append( 'pass', $("#login-form #login-pass").val() );
			data.append( 'remember', $("#login-form #login-remember").is(':checked') );
			
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
						location.reload();
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
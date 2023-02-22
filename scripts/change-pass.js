jQuery(function($) {
	/**********************************************************************************************/
	/**********************************       CHANGE  PASS       **********************************/
	/**********************************************************************************************/
	$(".formarea #change-pass-form").validate({
		rules: {
			"change-pass-pass1": {
				minlength: 10
			},
			"change-pass-pass2": {
				minlength: 10,
				equalTo: "#change-pass-pass1"
			}
		},
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#change-pass-form #change-pass-user").val() );
			data.append( 'pass-old', $("#change-pass-form #change-pass-old").val() );
			data.append( 'pass-new', $("#change-pass-form #change-pass-pass1").val() );
			
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
						$("#change-pass-form")[0].reset();
						$(form).find(".formarea__error").addClass("show").text("");
						$(form).find(".formarea__submit").removeClass("disabled");
						$(".popup.show").removeClass("show");
						$("#change-pass-done").addClass("show");
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
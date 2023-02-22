jQuery(function($) {
	/**********************************************************************************************/
	/**********************************         REGISTER         **********************************/
	/**********************************************************************************************/
	$(".formarea #register-form").validate({
		rules: {
			"register-pass1": {
				minlength: 10
			},
			"register-pass2": {
				minlength: 10,
				equalTo: "#register-pass1"
			}
		},
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'email', $("#register-form #register-email").val() );
			
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
						$("#register-pass-form #register-pass-code-compare").val( data.code );
						$("#register-pass-form #register-pass-email").val(
							$("#register-form #register-email").val()
						);
						$("#register-pass-form #register-pass-name-1").val(
							$("#register-form #register-name-1").val()
						);
						$("#register-pass-form #register-pass-name-2").val(
							$("#register-form #register-name-2").val()
						);
						$("#register-pass-form #register-pass-pass").val(
							$("#register-form #register-pass1").val()
						);
						
						var email_src = $("#register-form #register-email").val();
						var pos = email_src.indexOf("@");
						var email = email_src[0];
						if ( pos > 2) {
							for ( var i = 1; i < pos - 1; i++ ) email += "*";
						}
						email += email_src.substr( pos - 1 );
						
						$("#register-form")[0].reset();
						$("#register-form .formarea__error").text("");
						$(".popup.show").removeClass("show");
						$("#register-pass .popup__txt span").text( email );
						$("#register-pass").addClass("show");
					}
					else if ( data.status == 'error' ) {
						$("#register-pass .popup__txt span").text("");
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
	/**********************************   REGISTER PASS RESEND   **********************************/
	/**********************************************************************************************/
	$(".formarea #register-pass-resend").click(function(e) {
		e.preventDefault();
		
		var data = new FormData();
		data.append( 'email', $("#register-pass-form #register-pass-email").val() );

		$.ajax({
			method: 'POST',
			url: $(".formarea #register-form").attr("action"),
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					$("#register-pass-form #register-pass-code-compare").val( data.code );
					$("#register-pass-form .formarea__note").addClass("active");
				}
				else if ( data.status == 'error' ) {
					$("#register-pass-form .formarea__error").addClass("show").text( data.error );
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$(".formarea #register-pass-form .formarea__error").addClass("show").text( errorThrown );
				console.log( textStatus, errorThrown );
			}
		});
	});
	
	
	/**********************************************************************************************/
	/**********************************      REGISTER  PASS      **********************************/
	/**********************************************************************************************/
	$.validator.addMethod( "checkRegisterCode", function() {
		var code_1 = $(".formarea #register-pass-form #register-pass-code-compare").val();
		var code_2 = $(".formarea #register-pass-form #register-pass-code").val();
        return code_1 == code_2;
    }, "РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРґ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ Рё РїРѕРІС‚РѕСЂРёС‚Рµ РїРѕРїС‹С‚РєСѓ.");
	
	$(".formarea #register-pass-form").validate({
		rules: {
            "register-pass-code": "checkRegisterCode"
        },
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'email', $("#register-pass-form #register-pass-email").val() );
			data.append( 'name-1', $("#register-pass-form #register-pass-name-1").val() );
			data.append( 'name-2', $("#register-pass-form #register-pass-name-2").val() );
			data.append( 'pass', $("#register-pass-form #register-pass-pass").val() );
			
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
						$("#register-pass-form")[0].reset();
						$(form).find(".formarea__error").removeClass("show").text("");
						$(form).find(".formarea__submit").removeClass("disabled");
						$(".popup.show").removeClass("show");
				
						$("#register-done .popup__content").append('<a href="/account/" class="btn btn-sm btn-color width-auto"><span>РџРµСЂРµР№С‚Рё</span></a>');
						$("#register-done").addClass("show");
						$("#register-pass-form .formarea__note").removeClass("active");
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
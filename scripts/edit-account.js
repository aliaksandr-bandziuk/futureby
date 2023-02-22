jQuery(function($) {
	/**********************************************************************************************/
	/**********************************      SET USER PHOTO      **********************************/
	/**********************************************************************************************/
	function readURL( input ) {
		$(".formarea #edit-account-form .formarea__error").text("");
		
        if ( input.files && input.files[0] ) {
			var photo_reader = new FileReader();
			photo_reader.size = input.files[0].size;
			photo_reader.onload = function( photo ) { 
				var image = new Image();
				image.src = photo.target.result;
				image.size = photo.target.size;
				image.onload = function( photo ) {
					var error = "";
					if ( photo.target.size > 2097152  )
						error += "Р Р°Р·РјРµСЂ РїСЂРµРІС‹С€Р°РµС‚ 2 MB.<br/>";
					if ( photo.target.width < 350 || photo.target.height < 350 )
						error += "Р Р°Р·СЂРµС€РµРЅРёРµ РјРµРЅРµРµ 350x350.<br/>";

					if ( error == "" ) {
						$(".formarea #edit-account-form .edit-photo__img")
							.css("background-image", "url(" + photo.target.src + ")");
						$(".formarea #edit-account-form .edit-photo__error").html("");
					}
					else $(".formarea #edit-account-form .edit-photo__error").html( error );
				};
			};
			photo_reader.readAsDataURL( input.files[0] );
		}
    }
	
	/**********************************************************************************************/
    $(".formarea #edit-account-form #edit-account-photo").change(function() {
        readURL( this );
    });
	
	
	
	/**********************************************************************************************/
	/**********************************        MAKE  BLOB        **********************************/
	/**********************************************************************************************/
	function makeblob( dataURL ) {
		var BASE64_MARKER = ';base64,';
		if ( dataURL.indexOf( BASE64_MARKER ) == -1 ) {
			var parts = dataURL.split(',');
			var contentType = parts[0].split(':')[1];
			var raw = decodeURIComponent( parts[1] );
			return new Blob( [raw], { type: contentType } );
		}
		var parts = dataURL.split( BASE64_MARKER );
		var contentType = parts[0].split(':')[1];
		var raw = window.atob( parts[1] );
		var rawLength = raw.length;

		var uInt8Array = new Uint8Array( rawLength );

		for ( var i = 0; i < rawLength; ++i )
			uInt8Array[i] = raw.charCodeAt(i);

		return new Blob( [uInt8Array], { type: contentType } );
	}
	
	
	
	/**********************************************************************************************/
	/**********************************       EDIT ACCOUNT       **********************************/
	/**********************************************************************************************/
	$(".formarea #edit-account-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			
			var photo = $(".formarea #edit-account-form .edit-photo__img").css("background-image");
			photo = photo.substr(5, photo.length - 7);
			var name1 = $("#edit-account-form #edit-account-name-1").val();
			var name2 = $("#edit-account-form #edit-account-name-2").val();
			var name = name1 + "-" + name2;
			
			data.append( 'user', $("#edit-account-form #edit-account-user").val() );
			if ( photo !== $(".formarea #edit-account-form .edit-photo__img").data("default") )
				data.append( 'photo', makeblob( photo ), name.replace( " ", "" ) );
			data.append( 'name-1', name1 );
			data.append( 'name-2', name2 );
			data.append( 'email', $("#edit-account-form #edit-account-email").val() );
			data.append( 'tel', $("#edit-account-form #edit-account-tel").val() );
			data.append( 'country', $("#edit-account-form #edit-account-country").val() );
			data.append( 'city', $("#edit-account-form #edit-account-city").val() );
			data.append( 'job-pos', $("#edit-account-form #edit-account-job-pos").val() );
			data.append( 'job-place', $("#edit-account-form #edit-account-job-place").val() );
			
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
						window.location.href = "/account/";
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
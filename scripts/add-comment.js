jQuery(function($) {
	/**********************************************************************************************/
	/**********************************        MAKE  BLOB        **********************************/
	/**********************************************************************************************/
	function makeblob( dataURL ) {
		var BASE64_MARKER = ';base64,';
		if ( dataURL.indexOf( BASE64_MARKER ) == -1 ) {
			var parts = dataURL.split(',');
			var contentType = parts[0].split(':')[1];
			var raw = decodeURIComponent( parts[1] );
			return new Blob([raw], { type: contentType });
		}
		var parts = dataURL.split( BASE64_MARKER );
		var contentType = parts[0].split(':')[1];
		var raw = window.atob( parts[1] );
		var rawLength = raw.length;

		var uInt8Array = new Uint8Array( rawLength );

		for ( var i = 0; i < rawLength; ++i )
			uInt8Array[i] = raw.charCodeAt(i);

		return new Blob([uInt8Array], { type: contentType });
	}
	
	
	
	
	/**********************************************************************************************/
	/**********************************       ADD  COMMENT       **********************************/
	/**********************************************************************************************/
	$(document).bind("bindComments", function(e) {
		$(".comments-form form").each(function() {
			/**************************************************************************************/
			$(this).find("#comments-form-"+ $(this).data("id") +"-img").change(function() {
				if ( this.files.length > 0 ) {
					$(this).closest(".comments-form__imgarea").find("label").removeClass("show");
					uploadCommentImages( this );
					$(this).val('');
            		$(this).closest("form").find(".formarea__input").prop("required", false);
				}
			});
			
			/**************************************************************************************/
			$(this).validate({
				submitHandler: function(form) {
					var $form = $(form);
					var form_id = $(form).data("id");
					$form.find(".formarea__submit").addClass("disabled");

					var data = new FormData();
					data.append( 'post_id', $form.find("#comments-form-"+ form_id +"-post").val() );
					data.append( 'user_login', $form.find("#comments-form-"+ form_id +"-user").val() );
					data.append( 'comment', $form.find("#comments-form-"+ form_id +"-txt").val() );
					data.append( 'parent', $form.find("#comments-form-"+ form_id +"-parent").val() );
					
					var counter = 0;
					$form.find(".comments-form__imglist .comments-form__img").each(function() {
						var img_url = $(this).css("background-image");
						img_url = img_url.substr( 5, img_url.length - 7 );
						data.append( 'img_'+ counter, makeblob( img_url ) );
						counter++;
					});
					data.append( 'imgs_num', counter );

					$.ajax({
						method: 'POST',
						url: $form.attr("action"),
						enctype: 'multipart/form-data',
						cache: false,
						contentType: false,
						processData: false,
						data: data,
						success: function(data) {
							data = $.parseJSON( data );
							if ( data.status == 'ok' ) {
								var href = 'https://'+ window.location.hostname;
								href += window.location.pathname;
								window.location.href = href + '#comment-' + data.id;
								location.reload();
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$form.find(".formarea__submit").removeClass("disabled");
							console.log( textStatus, errorThrown );
						}
					});
				}
			});
		});
	});
	
	/**********************************************************************************************/
	$(document).trigger("bindComments");
	
	
	
	
	/**********************************************************************************************/
	/*******************************    ATTACH IMAGES TO COMMENT    *******************************/
	/**********************************************************************************************/
	function uploadCommentImages( input ) {
		var $comment_imgarea = $(input).closest(".comments-form__imgarea");
		var images_attached = $comment_imgarea.find(".comments-form__img").length;
		
		if ( input.files && ( input.files.length + images_attached <= 2 ) ) {
			for ( var i = 0, f; f = input.files[i]; i++ ) {
				var photo_reader = new FileReader();
				photo_reader.size = f.size;
				photo_reader.onload = (function( photo ) { 
					var image = new Image();
					image.src = photo.target.result;
					image.size = photo.target.size;
					image.onload = function( photo ) {
						if ( photo.target.size > 1048576 )
							$comment_imgarea.find("label.error-size").addClass("show");
						else {
							var imgitem = '<div class="comments-form__img"';
							imgitem += ' style="background-image: url('+ photo.target.src +')">';
							imgitem += '<span></span></div>';
							$comment_imgarea.find(".comments-form__imglist").append( imgitem );
						}
					};
				});
				photo_reader.readAsDataURL(f);
			}
		}
		else $comment_imgarea.find("label.error-num").addClass("show");
    }
	
	/**********************************************************************************************/
	$("body").on("click", ".comments-form__img span", function() {
		if ( $(this).closest(".comments-form__imgarea").find(".comments-form__img").length == 1 )
			$(this).closest("form").find(".formarea__input").prop("required", true);
		$(this).parent().remove();
	});
	
	
	
	
	/**********************************************************************************************/
	/**********************************        ANSWER  FORM        **********************************/
	/**********************************************************************************************/
	$(".comments__list .comment__answer").click(function(e) {
		e.preventDefault();
		$(".comments-form:not(.answer-form)").addClass("blocked");
		$(".answer-form-wrap.show").removeClass("show");
		$(this).closest(".comment").find(".answer-form-wrap").removeClass("hide")
			.html( $(".answer-form")[0] ).addClass("show");
		var form_id = $(".answer-form form").data("id");
		var comment_id = $(this).closest(".comment").data("id");
		$(".answer-form").find("#comments-form-" + form_id + "-txt").val('');
		$(".answer-form").find("#comments-form-" + form_id + "-parent").val( comment_id );
		$(".answer-form").find("#comments-form-"+ form_id +"-img").val('');
		$(".answer-form .comments-form__imgarea label").removeClass("show");
		$(".answer-form .comments-form__img").remove();
		$(document).trigger("bindComments");
	});
	
	/**********************************************************************************************/
	$("body").on("click", ".answer-form__cancel", function() {
		$(".answer-form-wrap.show").removeClass("show").addClass("hide");
		var form_id = $(".answer-form form").data("id");
		$(".answer-form").find("#comments-form-" + form_id + "-txt").val('');
		$(".answer-form").find("#comments-form-" + form_id + "-parent").val( 0 );
		$(".answer-form").find("#comments-form-"+ form_id +"-img").val('');
		$(".answer-form .comments-form__imgarea label").removeClass("show");
		$(".answer-form .comments-form__img").remove();
	});
	
	/**********************************************************************************************/
	$(document).on("click", ".comments-form.blocked", function(e) {
		$(".comments-form.blocked").removeClass("blocked");
		$(".answer-form-wrap.show").removeClass("show").addClass("hide");
		var form_id = $(".answer-form form").data("id");
		$(".answer-form").find("#comments-form-" + form_id + "-txt").val('');
		$(".answer-form").find("#comments-form-" + form_id + "-parent").val( 0 );
		$(".answer-form").find("#comments-form-"+ form_id +"-img").val('');
		$(".answer-form .comments-form__imgarea label").removeClass("show");
		$(".answer-form .comments-form__img").remove();
    });
});
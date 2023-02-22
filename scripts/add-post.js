jQuery(function($) {
	/**********************************************************************************************/
	/**********************************         ADD POST         **********************************/
	/**********************************************************************************************/
	$(".formarea #add-post-form .formarea__submit input").click(function(e) {
		$("#add-post-form-status").val( $(this).data("status") );
		
		if ( $(this).closest(".formarea__submit").hasClass("fill-info") ) {
			e.preventDefault();
			$("body").addClass("popup-on");
			$("#fill-user").addClass("show");
		}
	});
	
	/**********************************************************************************************/
	$(".formarea #add-post-form").validate({
		submitHandler: function(form) {
			var $form = $(form);
			$form.find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#add-post-form-user").val() );
			data.append( 'cat', $("#add-post-form-cat").val() );
			data.append( 'descr', $("#add-post-form-descr").val() );
			data.append( 'card', $form.find(".color-cards__list-item.active").data("value") );
			data.append( 'title', $("#editor-form-title").val() );
			data.append( 'status', $("#add-post-form-status").val() );
			
			if ( $(".main").hasClass("page-edit-article") ) {
				data.append( 'action', 'edit' );
				data.append( 'post_id', $(".main").data("id") );
			}
			else data.append( 'action', 'add' );

			var tags = [];
			$("#add-post-form-tags").closest(".tags").find(".tags__list-item p").each(function() {
				tags.push( $(this).text() );
			});
			data.append( 'tags', tags );
			
			var editor = [];
			var img_counter = 0;
			$(".editor-block").each(function() {
				if ( $(this).data("id") == "h2" ) {
					editor.push({
						"id" : "h2",
						"h2" : $(this).find(".editor-block__h2").val()
					});
				}
				else if ( $(this).data("id") == "txt" ) {
					var txt_id = $(this).find(".editor-block__txt").attr("id");
					editor.push({
						"id" : "txt",
						"txt" : tinyMCE.get( txt_id ).getContent()
					});
				}
				else if ( $(this).data("id") == "img" ) {
					if ( $(this).find(".editor-block__img-show").data("id") !== undefined ) {
						editor.push({
							"id" : "img",
							"img_id" : $(this).find(".editor-block__img-show").data("id"),
							"age" : "old"
						});
					}
					else {
						editor.push({
							"id" : "img",
							"img_id" : img_counter,
							"age" : "new"
						});
						data.append( 'imgId_' + img_counter,
							makeblob( $(this).find(".editor-block__img-show").attr("src") ) );
						img_counter++;
					}
				}
				else if ( $(this).data("id") == "iframe" ) {
					editor.push({
						"id" : "iframe",
						"iframe" : $(this).find(".editor-block__iframe textarea").val()
					});
				}
				else if ( $(this).data("id") == "link" ) {
					editor.push({
						"id" : "link",
						"link_name" : $(this).find(".editor-block__link-name").val(),
						"link_url" : $(this).find(".editor-block__link-url").val()
					});
				}
			});
			data.append( 'editor', JSON.stringify( editor ) );
			
			$.ajax({
				method: 'POST',
				url: $form.attr("action"),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				data: data,
				success: function(data) {
					$form.find(".formarea__submit").removeClass("disabled");
					data = $.parseJSON( data );
					if ( data.status == 'ok' ) {
						$("#add-post-form .formarea__error").text("");
						$("body").addClass("popup-on popup-on-final");
						$("#add-post-" + $("#add-post-form-status").val() ).addClass("show");
					}
					else if ( data.status == 'error' )
						$form.find(".formarea__error").addClass("show").text( data.error );
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$form.find(".formarea__error").addClass("show").text( errorThrown );
					$form.find(".formarea__submit").removeClass("disabled");
					console.log( textStatus, errorThrown );
				}
			});
		},
		invalidHandler: function(event, validator) {
			var errors = validator.numberOfInvalids();
			
	  	}
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
});
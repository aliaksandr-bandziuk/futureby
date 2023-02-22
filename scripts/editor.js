jQuery(function($) {
	/**********************************************************************************************/
	/**********************************    EDITOR DRAG & DROP    **********************************/
	/**********************************************************************************************/
	$(".editor-form__body").sortable({
		axis: 'y',
		handle: '.editor-block__move',
		start: function(e, ui) {
			$(ui.item).find('.editor-block__txt').each(function() {
				tinymce.execCommand('mceRemoveEditor', false, $(this).attr('id'));
			});
		},
		stop: function(e, ui) {
			$(ui.item).find('.editor-block__txt').each(function() {
				tinymce.execCommand('mceAddEditor', true, $(this).attr('id'));
			});
		}
	});
	
	
	
	/**********************************************************************************************/
	/**********************************    EDITOR AUTO RESIZE    **********************************/
	/**********************************************************************************************/
	function initSpan( $autoresize ) {
		var $textarea = $autoresize.find("textarea");
		var $span = $autoresize.find("span");
		$span.text( $textarea.text() );
		$span.width( $textarea.width() );
		$span.css( 'font', $textarea.css('font') );
	}
	
	/**********************************************************************************************/
	function initResize( $autoresize ) {
		var $textarea = $autoresize.find("textarea");
		var $span = $autoresize.find("span");
		$span.text( $textarea.val() );
		$textarea.height( $textarea.val() ? $span.height() : '' );
	}
	
	/**********************************************************************************************/
	$(".autoresize").each(function() {
		initSpan( $(this) );
		initResize( $(this) );
	});
	
	/**********************************************************************************************/
	$("body").on("input", ".autoresize textarea", function() {
		initResize( $(this).closest(".autoresize") );
	});
	
	/**********************************************************************************************/
	$("body").on("focus", ".autoresize textarea", function() {
		initSpan( $(this).closest(".autoresize") );
	});
	
	/**********************************************************************************************/
	$("body").on("keypress", ".autoresize textarea", function(e) {
		if (e.which == 13) e.preventDefault();
	});
	
	
	
	/**********************************************************************************************/
	/**********************************        EDITOR TXT        **********************************/
	/**********************************************************************************************/
	$(".editor-block__txt").each(function() {
		var block_id = $(this).attr("id");
		
		var content_style = $("body").width() > 768 ? false : '@media screen and (max-width: 767px) { body.mce-content-body { font-size: 16px; line-height: 20px; } }';
		
		tinymce.init({
			selector: '#' + block_id,
			plugins: 'link lists quickbars autoresize paste',
			mobile: {
				plugins: 'link lists quickbars autoresize paste'
			},
			statusbar: false,
			menubar: false,
			toolbar: false,
			quickbars_insert_toolbar: false,
			quickbars_image_toolbar: false,
			quickbars_selection_toolbar: 'bold italic quicklink bullist',
			autoresize_bottom_margin: 0,
			content_css: [
				'/wp-content/themes/factory16/css/basic.css',
				'/wp-content/themes/factory16/css/fonts.css',
				'/wp-content/themes/factory16/css/editor-form.css'
			],
			content_style: content_style,
			auto_focus: '#' + block_id,
			paste_block_drop: true,
			paste_as_text: true,
			paste_remove_styles_if_webkit: true
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       EDITOR IMAGE       **********************************/
	/**********************************************************************************************/
	$("body").on("change", ".editor-block__img input", function() {
		var $imgblock = $(this).closest(".editor-block__img");
		var $imgblock_input = $(this);
		
        if ( this.files && this.files[0] ) {
			var photo_reader = new FileReader();
			photo_reader.size = this.files[0].size;
			photo_reader.onload = function( photo ) { 
				var image = new Image();
				image.src = photo.target.result;
				image.size = photo.target.size;
				image.onload = function( photo ) {
					var error = "";
					if ( photo.target.size > 1048576  )
						error += "Р Р°Р·РјРµСЂ РїСЂРµРІС‹С€Р°РµС‚ 1 MB.";
					
					if ( error == "" ) {
						$imgblock.find("label.error").remove();
						$imgblock.removeClass("error").addClass("valid");
						$imgblock.attr("aria-invalid", "false");
						$imgblock.find(".editor-block__img-btn").hide();
						var img = '<img alt class="editor-block__img-show" ';
						img += 'src="'+ photo.target.src +'">';
						$imgblock.append( img );
					}
					else {
						$imgblock.find("input").val("");
						$imgblock.find("label.error").remove();
						$imgblock.removeClass("valid").addClass("error");
						$imgblock.attr("aria-invalid", "true");
						$imgblock.append('<label id="'+ $imgblock_input.attr("id") +'-error" class="error" for="'+ $imgblock_input.attr("id") +'">'+ error +'</label>');
					}
				};
			};
			photo_reader.readAsDataURL( this.files[0] );
		}
    });
	
	
	
	/**********************************************************************************************/
	/**********************************      EDITOR  IFRAME      **********************************/
	/**********************************************************************************************/
	$("body").on("blur", ".editor-block__iframe textarea", function() {
		if ( $(this).val().length ) {
			$(this).closest(".editor-block__iframe").append( $(this).val() );
			$(this).prop("hidden", true);
		}
    });
	
	
	
	/**********************************************************************************************/
	/**********************************      EDITOR  REMOVE      **********************************/
	/**********************************************************************************************/
	$("body").on("click", ".editor-block__remove", function() {
		$(this).closest(".editor-block").remove();
	});
	
	
	
	/**********************************************************************************************/
	/**********************************        EDITOR ADD        **********************************/
	/**********************************************************************************************/
	var blockCounter = $(".editor-block").length + 1;

	/**********************************************************************************************/
	$(".editor-add__txt").click(function(e) {
		e.stopPropagation();
		$(this).closest(".editor-add").addClass("on");
	});
	
	/**********************************************************************************************/
	$(".editor-add__icon").click(function(e) {
		e.stopPropagation();
		$(this).closest(".editor-add").toggleClass("on");
	});
	
	/**********************************************************************************************/
    $("body").on("click", function() {
		$(".editor-add").removeClass("on");
    });
	
	/**********************************************************************************************/
	$("body").on("click", ".editor-add__nav-item", function(e) {
		e.stopPropagation();
		$(".editor-add").removeClass("on");
		
		var editorBlock = '<div class="editor-form__block editor-block" data-id="';
		editorBlock += $(this).data("id") +'">';
		
		editorBlock += '<div class="editor-block__move">';
		editorBlock += '<img src="/wp-content/themes/factory16/img/icons/move.svg" alt>';
		editorBlock += '</div>';
		
		editorBlock += '<div class="editor-block__body">';
		
		if ( $(this).data("id") == "txt" ) {
			editorBlock += '<textarea class="editor-block__txt" placeholder="РўРµРєСЃС‚РѕРІС‹Р№ Р±Р»РѕРє" ';
			editorBlock += 'id="editor-block-txt-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-txt-'+ blockCounter +'"></textarea>';
		}
		else if ( $(this).data("id") == "h2" ) {
			editorBlock += '<div class="autoresize">';
			editorBlock += '<textarea class="editor-block__h2" placeholder="РџРѕРґР·Р°РіРѕР»РѕРІРѕРє" required ';
			editorBlock += 'id="editor-block-h2-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-h2-'+ blockCounter +'"></textarea>';
			editorBlock += '<span></span>';
			editorBlock += '</div>';
		}
		else if ( $(this).data("id") == "img" ) {
			editorBlock += '<div class="editor-block__img">';
			editorBlock += '<label class="editor-block__img-btn"';
			editorBlock += ' for="editor-block-img-'+ blockCounter +'">';
			editorBlock += '<img src="/wp-content/themes/factory16/img/icons/upload.svg" alt>';
			editorBlock += '<p>Р”РѕР±Р°РІРёС‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёРµ</p>';
			editorBlock += '</label>';
			editorBlock += '<input type="file" class="hidden" accept=".jpg,.jpeg,.png,.gif" required ';
			editorBlock += 'id="editor-block-img-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-img-'+ blockCounter +'">';
			editorBlock += '</div>';
		}
		else if ( $(this).data("id") == "iframe" ) {
			editorBlock += '<div class="editor-block__iframe">';
			editorBlock += '<div class="autoresize">';
			editorBlock += '<textarea placeholder="Р’СЃС‚Р°РІСЊС‚Рµ iframe" required ';
			editorBlock += 'id="editor-block-iframe-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-iframe-'+ blockCounter +'"></textarea>';
			editorBlock += '<span></span>';
			editorBlock += '</div>';
			editorBlock += '</div>';
		}
		else if ( $(this).data("id") == "link" ) {
			editorBlock += '<div class="editor-block__link">';
			editorBlock += '<input type="text" class="editor-block__link-name" ';
			editorBlock += 'id="editor-block-link-name-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-link-name-'+ blockCounter +'" ';
			editorBlock += 'placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ СЃСЃС‹Р»РєРё">';
			editorBlock += '<div class="editor-block__link-holder">';
			editorBlock += '<input type="url" class="editor-block__link-url" required ';
			editorBlock += 'id="editor-block-link-url-'+ blockCounter +'" ';
			editorBlock += 'name="editor-block-link-url-'+ blockCounter +'" ';
			editorBlock += 'placeholder="Р’РІРµРґРёС‚Рµ СЃСЃС‹Р»РєСѓ">';
			editorBlock += '</div></div>';
		}
		
		editorBlock += '</div>';
		
		editorBlock += '<div class="editor-block__remove">';
		editorBlock += '<img src="/wp-content/themes/factory16/img/icons/remove.svg" alt>';
		editorBlock += '</div>';
		
		editorBlock += '</div>';
		
		$(".editor-form__body").append( editorBlock );
		
		if ( $(this).data("id") == "txt" ) {
			/******************************      EDITOR TINYMCE      ******************************/
			var content_style = $("body").width() > 768 ? false : '@media screen and (max-width: 767px) { body.mce-content-body { font-size: 16px; line-height: 20px; } }';
			
			tinymce.init({
				selector: '#editor-block-txt-' + blockCounter,
				plugins: 'link lists quickbars autoresize paste',
				mobile: {
					plugins: 'link lists quickbars autoresize paste'
				},
				statusbar: false,
				menubar: false,
				toolbar: false,
				quickbars_insert_toolbar: false,
				quickbars_image_toolbar: false,
				quickbars_selection_toolbar: 'bold italic quicklink bullist',
				autoresize_bottom_margin: 0,
				content_css: [
					'/wp-content/themes/factory16/css/basic.css',
					'/wp-content/themes/factory16/css/fonts.css',
					'/wp-content/themes/factory16/css/editor-form.css'
				],
				content_style: content_style,
				auto_focus: '#editor-block-txt-' + blockCounter,
				paste_block_drop: true,
				paste_as_text: true,
				paste_remove_styles_if_webkit: true
			});
		}
		
		if ( $(this).data("id") == "h2" )
			$("#editor-block-h2-" + blockCounter).focus();
		else if ( $(this).data("id") == "iframe" )
			$("#editor-block-iframe-" + blockCounter).focus();
		else if ( $(this).data("id") == "link" )
			$("#editor-block-link-name-" + blockCounter).focus();
		
		blockCounter++;
    });
});
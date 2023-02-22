jQuery(function($) {
	/**********************************************************************************************/
	/**********************************       FIND SPEAKER       **********************************/
	/**********************************************************************************************/
	$("#add-conf-form #speakers-search").keyup(function() {
		if ( $(this).val().length > 3 ) {
			var action = $(this).data("action");
			
			var data = new FormData();
			data.append( 'name', $(this).val() );
			
			var notfound = '<p class="found-speaker__none">РЎРїРёРєРµСЂС‹ РЅРµ РЅР°Р№РґРµРЅС‹</p>';
			$.ajax({
				method: 'POST',
				url: action,
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				data: data,
				success: function(data) {
					data = $.parseJSON( data );
					$(".found-speakers").html("");
					if ( $("#add-conf-form #speakers-search").val().length > 3
						&& $("#add-conf-form #speakers-search").is(":focus") ) {
						$(".found-speakers").closest(".speakers__input").addClass("open");
						if ( data.status == 'ok' ) {
							if ( data.users.length > 0 ) {
								$.each( data.users, function( index, object ) {
									var user = '<div class="found-speaker">';
									user += '<img class="found-speaker__img" src="';
									user += object.img + '" alt>';
									user += '<div class="found-speaker__name">';
									user += '<p>' + object.name1 + '</p>';
									user += '<p>' + object.name2 + '</p>';
									user += '</div>';
									
									user += '<div class="found-speaker__add speaker-opener" ';
									user += 'data-id="' + object.id + '" ';
									user += 'data-name1="' + object.name1 + '" ';
									user += 'data-name2="' + object.name2 + '" ';
									user += 'data-img="' + object.img + '" ';
									user += 'data-tel="' + object.tel + '" ';
									user += 'data-email="' + object.email + '" ';
									user += 'data-jobplace="' + object.jobplace + '" ';
									user += 'data-jobpos="' + object.jobpos + '" ';
									user += 'data-country="' + object.country + '" ';
									user += 'data-city="' + object.city + '" ';
									user += 'data-topics-num="0">';
									
									user += '<img alt src="';
									user += '/wp-content/themes/factory16/img/icons/speaker-add.svg">';
									user += '</div>';
									user += '</div>';

									$(".found-speakers").append( user );
								});
							}
							else $(".found-speakers").append( notfound );
						}
						else if ( data.status == 'error' )
							$(".found-speakers").append( notfound );
					}
					else $(".found-speakers").closest(".speakers__input").removeClass("open");
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$(".found-speakers").html("").append( notfound );
					console.log( textStatus, errorThrown );
				}
			});
		}
		else $(".found-speakers").closest(".speakers__input").removeClass("open");
	});
	
	/**********************************************************************************************/
	$("#add-conf-form #speakers-search").on("focus", function() {
		if ( $(this).val().length > 3 && $(".found-speaker").length > 0 )
			$(this).closest(".speakers__input").addClass("open");
	});
	
	/**********************************************************************************************/
	$("body").on("click", function(e) {
		e.stopPropagation();
		if ( $(e.target).closest(".speakers__input").length <= 0 )
			$(".speakers__input").removeClass("open");
    });
	
	
	
	/**********************************************************************************************/
	/**********************************       ADD  SPEAKER       **********************************/
	/**********************************************************************************************/
	function escapeHtml( text ) {
		var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	
	/**********************************************************************************************/
	var topicsCounter = 1;
	$("#add-speaker-form .speaker-popup__add").click(function(e) {
		e.preventDefault();

		topicsCounter += 1;
		var topicInput = '<div class="formarea__line more-line">';
		topicInput += '<label>РўРµРјР° '+ topicsCounter +'</label>';
		topicInput += '<input type="text" class="formarea__input" maxlength="52" required ';
		topicInput += 'id="add-speaker-topics-'+ topicsCounter +'" ';
		topicInput += 'name="add-speaker-topics-'+ topicsCounter +'" ';
		topicInput += 'placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ С‚РµРјС‹">';
		topicInput += '</div>';
		$("#add-speaker-form .speaker-popup__topics").append( topicInput );
		if ( topicsCounter == 5 )
			$(this).addClass("disabled");
    });
	
	/**********************************************************************************************/
	$("body").on("click", ".speaker-opener", function() {
		$("#add-conf-form #speakers-search").val("");
		
		topicsCounter = 1;
		$("#add-speaker-form .speaker-popup__topics .more-line").remove();
		$("#add-speaker-form .speaker-popup__add").removeClass("disabled");
		
		var $this = $(this);
		$("#add-speaker-id").val( $this.data("id") );
		$("#add-speaker-name1").val( $this.data("name1") );
		$("#add-speaker-name2").val( $this.data("name2") );
		$("#add-speaker-img").val( $this.data("img") );
		$("#add-speaker-tel").val( $this.data("tel") );
		$("#add-speaker-email").val( $this.data("email") );
		$("#add-speaker-jobplace").val( $this.data("jobplace") );
		$("#add-speaker-jobpos").val( $this.data("jobpos") );
		$("#add-speaker-country").val( $this.data("country") );
		$("#add-speaker-city").val( $this.data("city") );
		$("#add-speaker-topics-num").val( $this.data("topics-num") );
		
		$("#add-speaker-form .speaker-popup__img").attr( "src", $this.data("img") );
		$("#add-speaker-form .speaker-popup__name").html("").append( '<p>'+ $this.data("name1") +'</p>' );
		$("#add-speaker-form .speaker-popup__name").append( '<p>'+ $this.data("name2") +'</p>' );
		$("#add-speaker-form .speaker-popup__body").html("");
		
		var params = {
			'tel': 'РўРµР»РµС„РѕРЅ', 'email': 'РџРѕС‡С‚Р°', 'jobplace': 'РћСЂРіР°РЅРёР·Р°С†РёСЏ',
			'jobpos': 'Р”РѕР»Р¶РЅРѕСЃС‚СЊ', 'country': 'РЎС‚СЂР°РЅР°', 'city': 'Р“РѕСЂРѕРґ'
		};
		$.each( params, function( key, value ) {
			if ( $this.data( key ) !== '' ) {
				var item = '<div class="speaker-popup__item">';
				item += '<p class="speaker-popup__label">'+ value +'</p>';
				item += '<p class="speaker-popup__value">'+ $this.data( key ) +'</p>';
				item += '</div">';
				$("#add-speaker-form .speaker-popup__body").append( item );
			}
		});
		
		if ( parseInt( $this.data('topics-num') ) > 0 ) {
			$("#add-speaker-topics-1").val( $this.data('topics-1') );
			for ( var i = 2; i <= parseInt( $this.data('topics-num') ); i++ ) {
				topicsCounter++;
				var topicInput = '<div class="formarea__line more-line">';
				topicInput += '<label>РўРµРјР° '+ topicsCounter +'</label>';
				topicInput += '<input type="text" class="formarea__input" required ';
				topicInput += 'id="add-speaker-topics-'+ topicsCounter +'" ';
				topicInput += 'name="add-speaker-topics-'+ topicsCounter +'" ';
				topicInput += 'placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ С‚РµРјС‹" value="';
				topicInput += $this.data('topics-' + i) +'">';
				topicInput += '</div>';
				$("#add-speaker-form .speaker-popup__topics").append( topicInput );
			}
		}
		else $("#add-speaker-topics-1").val("");
		
		$("body").addClass("popup-on");
		$("#add-speaker").addClass("show");
	});
	
	/**********************************************************************************************/
	$("#add-speaker-form").validate({
		submitHandler: function(form) {
			$(".speakers__input label.error").remove();
			$(".speakers__input input.formarea__input").removeClass("error").addClass("valid");
			$(".speakers__input input.formarea__input").attr("aria-invalid", "false");
			
			var currId = $("#add-speaker-id").val();
			if ( $(".speaker__body[data-id='"+ currId +"']") )
				$(".speaker__body[data-id='"+ currId +"']").closest(".speaker").remove();
			
			var speaker = '<div class="speakers__item speaker">';
			speaker += '<div class="speaker__body speaker-opener" ';
			speaker += 'data-id="'+ $("#add-speaker-id").val() +'" ';
			speaker += 'data-name1="'+ $("#add-speaker-name1").val() +'" ';
			speaker += 'data-name2="'+ $("#add-speaker-name2").val() +'" ';
			speaker += 'data-img="'+ $("#add-speaker-img").val() +'" ';
			speaker += 'data-tel="'+ $("#add-speaker-tel").val() +'" ';
			speaker += 'data-email="'+ $("#add-speaker-email").val() +'" ';
			speaker += 'data-jobplace="'+ $("#add-speaker-jobplace").val() +'" ';
			speaker += 'data-jobpos="'+ $("#add-speaker-jobpos").val() +'" ';
			speaker += 'data-country="'+ $("#add-speaker-country").val() +'" ';
			speaker += 'data-city="'+ $("#add-speaker-city").val() +'" ';
			speaker += 'data-topics-num="'+ topicsCounter +'"';
			if ( parseInt( topicsCounter ) > 0 ) {
				for ( var i = 1; i <= topicsCounter; i++ ) {
					speaker += ' data-topics-'+ i +'="';
					speaker += escapeHtml( $("#add-speaker-topics-"+ i).val() ) +'"';
				}
			}
			speaker += '>';
			
			speaker += '<img class="speaker__img" src="'+ $("#add-speaker-img").val() +'" alt>';
			speaker += '<div class="speaker__name">';
			speaker += '<p>'+ $("#add-speaker-name1").val() +'</p>';
			speaker += '<p>'+ $("#add-speaker-name2").val() +'</p>';
			speaker += '</div>';
			speaker += '</div>';
			
			speaker += '<div class="speaker__remove">';
			speaker += '<img src="/wp-content/themes/factory16/img/icons/speaker-remove.svg" alt>';
			speaker += '</div>';
			speaker += '</div>';
			
			$(".speakers__items").append( speaker );
			
			topicsCounter = 1;
			$("#add-speaker-form .speaker-popup__topics .more-line").remove();
			$("#add-speaker-form .speaker-popup__add").removeClass("disabled");

			$("body").removeClass("popup-on");
			$("#add-speaker").removeClass("show");
		}
	});
	
	/**********************************************************************************************/
	$("body").on("click", ".speaker__remove", function() {
		$(this).closest(".speaker").remove();
	});
	
	
	
	/**********************************************************************************************/
	/**********************************         ADD CONF         **********************************/
	/**********************************************************************************************/
	$("#add-conf-form-type").on("change", function() {
		$("#add-conf-form-url").closest(".formarea__line").toggleClass("hidden");
		$("#add-conf-form-address").closest(".formarea__line").toggleClass("hidden");
		
		if ( $(this).val() == "Online" ) {
			$("#add-conf-form-url").prop("required", true);
			$("#add-conf-form-address").prop("required", false);
		}
		else if ( $(this).val() == "Offline" ) {
			$("#add-conf-form-url").val("");
			$("#add-conf-form-url").prop("required", false);
			$("#add-conf-form-address").prop("required", true);
		}
    });
	
	
	/**********************************************************************************************/
	/**********************************************************************************************/
	$(".formarea #add-conf-form .formarea__submit input").click(function(e) {
		$("#add-conf-form-status").val( $(this).data("status") );
		
		if ( $(this).closest(".formarea__submit").hasClass("fill-info") ) {
			e.preventDefault();
			$("body").addClass("popup-on");
			$("#fill-user").addClass("show");
		}
	});

	
	/**********************************************************************************************/
	/**********************************************************************************************/
	$.validator.addMethod("time-format", function(value, element) { 
		return this.optional(element) || /^([0-1]?[0-9]|2[0-3]) : [0-5][0-9]$/.test(value);
	}, "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅРѕРµ РІСЂРµРјСЏ.");
	
	/**********************************************************************************************/
	$.validator.addMethod("speakers-requiered", function(value, element) { 
		return $(".speakers__items .speaker").length > 0;
	}, "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РґРѕР±Р°РІСЊС‚Рµ РїСЂРёРіР»Р°С€РµРЅРёСЏ РґР»СЏ СЃРїРёРєРµСЂРѕРІ.");
	
	/**********************************************************************************************/
	$(".formarea #add-conf-form").validate({
		rules: {
			"add-conf-form-time": "time-format",
			"speakers-search": "speakers-requiered"
		},
		submitHandler: function(form) {
			var $form = $(form);
			$form.find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#add-conf-form-user").val() );
			data.append( 'status', $("#add-conf-form-status").val() );
			
			data.append( 'type', $("#add-conf-form-type").val() );
			if ( $("#add-conf-form-type").val() == "Online" )
				data.append( 'url', $("#add-conf-form-url").val() );
			else data.append( 'address', $("#add-conf-form-address").val() );
			data.append( 'date', $("#add-conf-form-date").val() );
			data.append( 'time', $("#add-conf-form-time").val() );
			data.append( 'timezone', $("#add-conf-form-timezone").val() );
			data.append( 'cat', $("#add-conf-form-cat").val() );
			data.append( 'title', $("#editor-form-title").val() );
			
			if ( $(".main").hasClass("page-edit-article") ) {
				data.append( 'action', 'edit' );
				data.append( 'post_id', $(".main").data("id") );
			}
			else data.append( 'action', 'add' );

			var tags = [];
			$("#add-conf-form-tags").closest(".tags").find(".tags__list-item p").each(function() {
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
			
			var speakers = [];
			$(".speakers__items .speaker").each(function() {
				var topics = [];
				var topics_num = parseInt( $(this).find(".speaker__body").data("topics-num") );
				for ( var i = 1; i <= topics_num; i++ )
					 topics.push( $(this).find(".speaker__body").data("topics-" + i) );
				
				speakers.push({
					"id" : $(this).find(".speaker__body").data("id"),
					"topicsnum" : topics_num,
					"topics" : topics
				});
			});
			data.append( 'speakers', JSON.stringify( speakers ) );
			
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
						$("#add-conf-form .formarea__error").text("");
						$("body").addClass("popup-on popup-on-final");
						$("#add-conf-" + $("#add-conf-form-status").val()).addClass("show");
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
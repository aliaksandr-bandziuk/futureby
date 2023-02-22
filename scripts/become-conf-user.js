jQuery(function($) {
	/**********************************************************************************************/
	/**********************************     BECOME CONF USER     **********************************/
	/**********************************************************************************************/
	var become_type = '';
	var confTopicsCounter = 1;
	
	/**********************************************************************************************/
	$(".page-conf .conf__btns .btn").click(function(e) {
		if ( $("body").hasClass("logged-in") ) {
			e.preventDefault();	
			
			become_type = $(this).data("speaker");
			$("body").addClass("popup-on");
			
			if ( $(this).hasClass("fill-info") ) {
				$("#fill-conf-user").addClass("show");
			}
			else {
				if ( become_type == "0" )
					setConfUser();
				else if ( become_type == "1" )
					$("#add-conf-speaker").addClass("show");
			}
		}
	});
	
	/**********************************************************************************************/
	function setConfUser( speaker = false, $form = undefined ) {
		var user_data = new FormData();
		user_data.append( 'post_id', $(".page-conf .conf").data("post") );
		user_data.append( 'user', $(".page-conf .conf").data("user") );
		user_data.append( 'speaker', become_type );
		
		if ( speaker ) {
			if ( confTopicsCounter > 0 ) {
				var topics = [];
				for ( var i = 1; i <= confTopicsCounter; i++ )
					topics.push( $("#add-conf-speaker #add-conf-speaker-topics-" + i).val() );
				user_data.append( 'topics', JSON.stringify( topics ) );
			}
			user_data.append( 'plan', $("#add-conf-speaker #add-conf-speaker-plan").val() );
		}

		$.ajax({
			method: 'POST',
			url: '/wp-content/themes/factory16/inc/actions/become-conf-user.php',
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: user_data,
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					if ( speaker ) {
						$form.find(".formarea__error").removeClass("show").text("");
						$form.find(".formarea__submit").removeClass("disabled");
						
						$("#add-conf-speaker").removeClass("show");
						
						$("#conf-user-response .popup__title").text("Р—Р°СЏРІРєР° РѕС‚РїСЂР°РІР»РµРЅР°!");
						$("#conf-user-response .popup__txt").text("Р—Р°СЏРІРєР° РЅР° СЂРѕР»СЊ СЃРїРёРєРµСЂР° РєРѕРЅС„РµСЂРµРЅС†РёРё РѕС‚РїСЂР°РІР»РµРЅР°. Р”РѕР¶РґРёС‚РµСЃСЊ, РїРѕРєР° РµС‘ РѕРґРѕР±СЂРёС‚ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂ.");
					}
					else {
						$("#conf-user-response .popup__title").text("Р“РѕС‚РѕРІРѕ");
						$("#conf-user-response .popup__txt").text("Р’С‹ СѓСЃРїРµС€РЅРѕ Р·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°Р»РёСЃСЊ.");
					}
					
					$(".page-conf .conf__btns .btn[data-speaker='" + become_type + "']").addClass("toggled");
					$("#conf-user-response").addClass("show");
				}
				else if ( data.status == 'error' && speaker ) {
					$form.find(".formarea__error").addClass("show").text( data.error );
					$form.find(".formarea__submit").removeClass("disabled");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if ( speaker ) {
					$form.find(".formarea__error").addClass("show").text( errorThrown );
					$form.find(".formarea__submit").removeClass("disabled");
				}
				console.log( textStatus, errorThrown );
			}
		});
		
		
		$.ajax({
			success: function(data) {
				$form.find(".formarea__submit").removeClass("disabled");
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					$("#add-conf-form .formarea__error").text("");
					$("body").addClass("popup-on popup-on-final");
					$("#add-conf-" + $("#add-conf-form-status").val()).addClass("show");
				}
			}
		});
    }
	
	
	
	/**********************************************************************************************/
	/**********************************      FILL CONF USER      **********************************/
	/**********************************************************************************************/
	$(".formarea #fill-conf-user-form").validate({
		submitHandler: function(form) {
			$(form).find(".formarea__submit").addClass("disabled");
			
			var data = new FormData();
			data.append( 'user', $("#fill-conf-user-login").val() );
			
			if ( $("#fill-conf-user-email").length )
				data.append( 'email', $("#fill-conf-user-email").val() );
			if ( $("#fill-conf-user-name-1").length )
				data.append( 'name-1', $("#fill-conf-user-name-1").val() );
			if ( $("#fill-conf-user-name-2").length )
				data.append( 'name-2', $("#fill-conf-user-name-2").val() );
			if ( $("#fill-conf-user-tel").length )
				data.append( 'tel', $("#fill-conf-user-tel").val() );
			
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
						$(".page-conf .conf__btns .btn").removeClass("fill-info");
						if ( become_type == "0" )
							setConfUser();
						else if ( become_type == "1" )
							$("#add-conf-speaker").addClass("show");
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
	
	
	
	/**********************************************************************************************/
	/**********************************    ADD SPEAKER TOPICS    **********************************/
	/**********************************************************************************************/
	function escapeHtml( text ) {
		var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	
	/**********************************************************************************************/
	$("#add-conf-speaker .speaker-popup__add").click(function(e) {
		e.preventDefault();

		confTopicsCounter += 1;
		var topicInput = '<div class="formarea__line more-line">';
		topicInput += '<label>РўРµРјР° '+ confTopicsCounter +'</label>';
		topicInput += '<input type="text" class="formarea__input" maxlength="52" required ';
		topicInput += 'id="add-conf-speaker-topics-'+ confTopicsCounter +'" ';
		topicInput += 'name="add-conf-speaker-topics-'+ confTopicsCounter +'" ';
		topicInput += 'placeholder="Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ С‚РµРјС‹">';
		topicInput += '</div>';
		$("#add-conf-speaker .speaker-popup__topics").append( topicInput );
		if ( confTopicsCounter == 8 )
			$(this).addClass("disabled");
    });
	
	
	/**********************************************************************************************/
	/**********************************************************************************************/
	$(".formarea #add-conf-speaker-form").validate({
		submitHandler: function(form) {
			var $form = $(form);
			$form.find(".formarea__submit").addClass("disabled");
			setConfUser( true, $form );
		}
	});
});
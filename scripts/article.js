jQuery(function($) {
	/**********************************************************************************************/
	/**********************************        POST SHARE        **********************************/
	/**********************************************************************************************/
	window.fbAsyncInit = function() {     
		FB.init({
			appId : '3242806245976827',
			status: true,
			xfbml: true
		});
	};
	
	$(".share__fb").each(function() {
		$(this).click(function(e) {
			e.preventDefault();

			FB.ui({
				display: 'popup',
				method: 'share',
				href: location.href
			});
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************        POST LIKES        **********************************/
	/**********************************************************************************************/
	$("body").on("click",
		".post__likes:not(.open-popup), .post__dislikes:not(.open-popup)", function(e) {
		e.preventDefault();
		
		var $this = $(this);
		var $parent = $this.closest(".grid-block").length > 0 ?
			$this.closest(".grid-block") : $this.closest(".article");
		var like = $(this).closest(".icon-nav").find(".post__likes").hasClass("on");
		var dislike = $(this).closest(".icon-nav").find(".post__dislikes").hasClass("on");
		
		
		if ( $(this).hasClass("post__likes") ) {
			if ( $(this).hasClass("on") ) {
				$parent.find(".post__likes").removeClass("on");
				like = false;
			}
			else {
				$parent.find(".post__likes").addClass("on");
				like = true;
				$parent.find(".post__dislikes").removeClass("on");
				dislike = false;
			}
		}
		else {
			if ( $(this).hasClass("on") ) {
				$parent.find(".post__dislikes").removeClass("on");
				dislike = false;
			}
			else {
				$parent.find(".post__dislikes").addClass("on");
				dislike = true;
				$parent.find(".post__likes").removeClass("on");
				like = false;
			}
		}
		
		$this.addClass("disabled");
		
		var action = $parent.hasClass("grid-block") ? $(this).data("href") : $(this).attr("href");
		
		var data = new FormData();
		data.append( 'post', $parent.data("id") );
		data.append( 'user', $parent.data("user") );
		data.append( 'like', like );
		data.append( 'dislike', dislike );
		
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
				if ( data.status == 'ok' ) {
					$parent.find(".post__likes p").text( data.likes );
					$parent.find(".post__dislikes p").text( data.dislikes );
				}
				$this.removeClass("disabled");
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$this.removeClass("disabled");
			}
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      COMMENT  LIKES      **********************************/
	/**********************************************************************************************/
	$("body").on("click",
		".comment__likes:not(.open-popup), .comment__dislikes:not(.open-popup)", function(e) {
		e.preventDefault();
		
		var $this = $(this);
		var $comment = $(this).closest(".comment");
		var like = $(this).closest(".icon-nav").find(".comment__likes").hasClass("on");
		var dislike = $(this).closest(".icon-nav").find(".comment__dislikes").hasClass("on");
		
		if ( $(this).hasClass("comment__likes") ) {
			if ( $(this).hasClass("on") ) {
				$comment.find(".comment__likes").removeClass("on");
				like = false;
			}
			else {
				$comment.find(".comment__likes").addClass("on");
				like = true;
				$comment.find(".comment__dislikes").removeClass("on");
				dislike = false;
			}
		}
		else {
			if ( $(this).hasClass("on") ) {
				$comment.find(".comment__dislikes").removeClass("on");
				dislike = false;
			}
			else {
				$comment.find(".comment__dislikes").addClass("on");
				dislike = true;
				$comment.find(".comment__likes").removeClass("on");
				like = false;
			}
		}
		
		$this.addClass("disabled");
		
		var action = $comment.hasClass("grid-block") ? $(this).data("href") : $(this).attr("href");
		
		var data = new FormData();
		data.append( 'comment', $(this).closest(".comment").data("id") );
		data.append( 'user', $(this).closest(".comment").data("user") );
		data.append( 'like', like );
		data.append( 'dislike', dislike );
		
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
				if ( data.status == 'ok' ) {
					$comment.find(".comment__likes p").text( data.likes );
					$comment.find(".comment__dislikes p").text( data.dislikes );
				}
				$this.removeClass("disabled");
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$this.removeClass("disabled");
			}
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     ADD TO FAVOURITE     **********************************/
	/**********************************************************************************************/
	$("body").on("click",
		".post__favourite:not(.open-popup), .conf__favourite:not(.open-popup)", function(e) {
		e.preventDefault();
		
		var $this = $(this);
		var type = $(this).hasClass("post__favourite") ? 'post' : 'conf';
		
		if ( $this.closest(".grid-block").length > 0 )
			$this.toggleClass("on");
		else $(".article ."+ type +"__favourite").toggleClass("on");
		var fav = $(this).hasClass("on") ? true : false;
		$this.addClass("disabled");
		
		var action = $this.closest(".grid-block").length > 0 ?
			$(this).data("href") : $(this).attr("href");
		
		var data = new FormData();
		data.append( 'type', type );
		data.append( 'fav', fav );
		data.append( 'post', $(this).data("post") );
		data.append( 'user', $(this).data("user") );
		
		$.ajax({
			method: 'POST',
			url: action,
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				$this.removeClass("disabled");
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$this.removeClass("disabled");
			}
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************         SUBSCRIBE        **********************************/
	/**********************************************************************************************/
	$(".post__subscribe:not(.open-popup)").click(function(e) {
		e.preventDefault();
		
		var $this = $(this);
		
		$this.toggleClass("on");
		var subscribe = $(this).hasClass("on") ? true : false;
		$this.addClass("disabled");
		
		var action = $(this).attr("href");
		
		var data = new FormData();
		data.append( 'author', $(this).data("author") );
		data.append( 'user', $(this).closest(".article").data("user") );
		data.append( 'subscribe', subscribe );
		
		$.ajax({
			method: 'POST',
			url: action,
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				$this.removeClass("disabled");
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$this.removeClass("disabled");
			}
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************    CONFERENCE  SLIDER    **********************************/
	/**********************************************************************************************/
	$(".conf__speakers .slider .slider__items").each(function() {
		var slides_num = $(window).width > 599 ? 3 : 2;
		var dots = $(this).find(".slider__item").length > slides_num ? true : false;
		
		$(this).slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			speed: 600,
			cssEase: 'ease',
			autoplay: true,
			autoplaySpeed: 8000,
			arrows: true,
			dots: dots,
			appendArrows: $(this).closest(".slider").find(".slider__nav"),
			appendDots: $(this).closest(".slider").find(".slider__nav"),
			prevArrow: '<div class="slider__arr slider__arr_l"><img src="/wp-content/themes/factory16/img/icons/slider-arr-l.svg" alt></div>',
			nextArrow: '<div class="slider__arr slider__arr_r"><img src="/wp-content/themes/factory16/img/icons/slider-arr-r.svg" alt></div>',
			responsive: [
				{ breakpoint: 600, settings: { slidesToShow: 2 } }
			]
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       POST  SLIDER       **********************************/
	/**********************************************************************************************/
	$(".post__related .slider .slider__items").each(function() {
		var slides_num = $(window).width > 767 ? 3 : 2;
		var dots = $(this).find(".slider__item").length > slides_num ? true : false;
		
		$(this).slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			speed: 600,
			cssEase: 'ease',
			autoplay: true,
			autoplaySpeed: 8000,
			arrows: true,
			dots: dots,
			appendArrows: $(this).closest(".slider").find(".slider__nav"),
			appendDots: $(this).closest(".slider").find(".slider__nav"),
			prevArrow: '<div class="slider__arr slider__arr_l"><img src="/wp-content/themes/factory16/img/icons/slider-arr-l.svg" alt></div>',
			nextArrow: '<div class="slider__arr slider__arr_r"><img src="/wp-content/themes/factory16/img/icons/slider-arr-r.svg" alt></div>',
			responsive: [
				{ breakpoint: 768, settings: { slidesToShow: 2 } },
				{ breakpoint: 450, settings: { slidesToShow: 1 } }
			]
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     SPEAKER DECISION     **********************************/
	/**********************************************************************************************/
	if ( $(".page-conf").hasClass("agree") ) {
		$("#speaker-decide .popup__txt").text("РџСЂРёРіР»Р°С€РµРЅРёРµ Р±С‹Р»Рѕ РїСЂРёРЅСЏС‚Рѕ.");
		$("body").addClass("popup-on");
		$("#speaker-decide").addClass("show");
	}
	else if ( $(".page-conf").hasClass("disagree") ) {
		$("#speaker-decide .popup__txt").text("РџСЂРёРіР»Р°С€РµРЅРёРµ Р±С‹Р»Рѕ РѕС‚РєР»РѕРЅРµРЅРѕ.");
		$("body").addClass("popup-on");
		$("#speaker-decide").addClass("show");
	}
	else if ( $(".page-conf").hasClass("not-logged-in") ) {
		$("body").addClass("popup-on");
		$("#login").addClass("show");
	}
});
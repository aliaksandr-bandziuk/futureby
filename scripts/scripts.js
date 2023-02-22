jQuery(function($) {
	/**********************************************************************************************/
	/**********************************          HEADER          **********************************/
	/**********************************************************************************************/
	$(".header-profile__nav").click(function() {
		$(".header-profile__menu").toggleClass("show");
	});
	
	$("body").click(function(e) {
		if ( !e.target.classList.contains("header-profile__nav") )
	        $(".header-profile__menu").removeClass("show");
    });
	
	/**********************************************************************************************/
	$(".header .iconbar__menu").click(function() {
		$("body").addClass("menu-on");
	});
	
	$(".sidebar__close").click(function() {
		$("body").removeClass("menu-on");
	});
	
	/**********************************************************************************************/
	$(".header .notify.show .notify__icon").click(function() {
		if ( $(this).closest(".notify").hasClass("show") )
			$(this).closest(".notify").toggleClass("open");
	});
	
	/**********************************************************************************************/
    $("body").on("click", function(e) {
		if ( !$( e.target ).closest(".notify").length )
			$(".header .notify__icon").closest(".notify").removeClass("open");
    });

    /**********************************************************************************************/
    $('.hidden-link').click(function(){window.open($(this).data('link'));return false;});
    
	/**********************************************************************************************/
    $(".header .notify-content .notification__remove").click(function() {
		var $this = $(this);
		$this.addClass("disabled");
		
		var data = new FormData();
		var notify_id = $this.closest(".notification").data("id");
		data.append( 'notify_id', notify_id );
		
		$.ajax({
			method: 'POST',
			url: '/wp-content/themes/factory16/inc/actions/remove-notify.php',
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					$(".header .notify-content .notification[data-id='"+ notify_id +"']").remove();
					var num = parseInt( $(".header__iconbar .notify .notify__circle").first().text() );
					$(".header__iconbar .notify .notify__circle").text( num - 1 );
					$(".header__iconbar .notify .notify-title__circle").text( num - 1 );
					if ( num == 1 )
						$(".header .notify.show").removeClass("show open");
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
	$(".header .theme-toggle").click(function() {
		$(this).toggleClass("on");
	});
	
	/**********************************************************************************************/
	$(".main__back").click(function(e) {
		e.preventDefault();
		history.back();
	});
	
	
	
	/**********************************************************************************************/
	/**********************************          SCROLL          **********************************/
	/**********************************************************************************************/
	if ( window.location.hash ) window.scroll(0,0);
	setTimeout( function() { window.scroll(0,0); }, 1);
	
	$(window).on("load", function() {
		if ( window.location.hash ) {
			$("html").animate({
				scrollTop: $(window.location.hash).offset().top -
					$(".header").height() - $("#wpadminbar").height() + 'px'
			}, "300");
		}
	});
	
	$(".scroll-link").click(function(e) {
		e.preventDefault();
		$("html").animate({
			scrollTop: $( $(this).attr("href") ).offset().top -
				$(".header").height() - $("#wpadminbar").height() + 'px'
		}, "300");
	});
	
	$(".scroll-top").click(function(e) {
		e.preventDefault();
		$("html").animate({ scrollTop: 0 }, "300");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************        POPUP AREA        **********************************/
	/**********************************************************************************************/
	$("body").on("click", ".open-popup", function(e) {
		e.preventDefault();
		if ( !$(this).hasClass("popup-block") ) {
			$("body").addClass("popup-on");
			$(".popup.show").removeClass("show");
			var href = $(this).closest(".grid-block").length > 0 ?
				$(this).data("href") : $(this).attr("href");
			$( href ).addClass("show");
		}
	});
	
	/**********************************************************************************************/
	$(".popup__close, .close-popup, .overlay").click(function(e) {
		e.preventDefault();
		$(".popup.show").removeClass("show");
		$("body").removeClass("popup-on").removeClass("menu-on");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       ACCOUNT PAGE       **********************************/
	/**********************************************************************************************/
	$(".account-info__toggle").click(function() {
		$(this).closest(".account-info__body").toggleClass("show");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************          LOGOUT          **********************************/
	/**********************************************************************************************/
	$(".logout").click(function(e) {
		e.preventDefault();
		
		var $this = $(this);
		$this.addClass("disabled");
		
		$.ajax({
			method: 'POST',
			url: $(this).attr("href"),
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) window.location.href = "/";
				$this.removeClass("disabled");
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$this.removeClass("disabled");
			}
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      SIDEBAR SCROLL      **********************************/
	/**********************************************************************************************/
	$(window).on("scroll", function(e) {
		if ( $(".main__aside").hasClass("scrollarea") ) {
			if ( $(window).width() >= 768 &&
				$(".grid__items").height() > $(".main__aside .adbanner").height() ) {
				let topDelta = $(".header").outerHeight() + 20;
				if ( $("body").hasClass("admin-bar") )
					topDelta += $("#wpadminbar").height();

				if ( $(window).scrollTop() > $(".main__aside").offset().top - topDelta ) {
					$(".main__aside .adbanner").addClass("sticky");
					$(".main__aside .adbanner").css("top", topDelta + "px");
					$(".main__aside .adbanner").css("width", $(".main__aside").width() + "px");
				}
				else {
					if ( $(".main__aside .adbanner").hasClass("sticky") ) {
						$(".main__aside .adbanner").removeClass("sticky");
						$(".main__aside .adbanner").css("top", "").css("width", "");
					}
				}
			}
		}
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     MARKETS  MARQUEE     **********************************/
	/**********************************************************************************************/
	$(".header__markets .markets__track").marquee({
		duration: 30000,
		delayBeforeStart: 0,
		direction: 'left',
		duplicated: true,
		startVisible: true
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       SIDEBAR TAGS       **********************************/
	/**********************************************************************************************/
	$(".sidebar-tags .sidebar__subtitle").click(function() {
		let $tags = $(this).closest(".sidebar-tags");
		$tags.toggleClass("open");
		if ( $tags.hasClass("open") ) {
			$tags.find(".sidebar-tags__body").slideDown("300");
		} else {
			$tags.find(".sidebar-tags__body").slideUp("300");
		}
	});
	
	/**********************************************************************************************/
	$(".sidebar-tags__btn").click(function() {
		$(this).closest(".sidebar-tags").toggleClass("show-all");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************          COOKIE          **********************************/
	/**********************************************************************************************/
	function setCookie(cname, cvalue, exdays, path) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
	}

	/**********************************************************************************************/
	$(".cookie-popup__btn").click(function () {
		setCookie("futureby_cookie_policy", "hide", 30, "/");
		$(".cookie-popup").remove();
	});
});
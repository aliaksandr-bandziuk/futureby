jQuery(function($) {
	/**********************************************************************************************/
	/**********************************   CONFERENCE  CALENDAR   **********************************/
	/**********************************************************************************************/
	$(".page-grid__calendar").click(function(e) {
		e.preventDefault();
		$(this).closest(".page-grid__nav-item").find(".page-grid__calendar-menu").toggleClass("show");
	});
	
	/**********************************************************************************************/
	$("body").click(function(e) {
		if ( !e.target.classList.contains("page-grid__calendar") )
	        $(".page-grid__calendar-menu").removeClass("show");
    });
	
	/**********************************************************************************************/
	$(".page-grid__calendar-menu a").click(function(e) {
		e.preventDefault();
		
		if ( !$(this).hasClass("active") ) {
			$(".page-grid__calendar-menu .active").removeClass("active");
			$(this).addClass("active");
		
			reset_grid( $(".page-grid .grid") );
		}
	});
	
	
	
	
	/**********************************************************************************************/
	/**********************************    GRID FILTER TOGGLE    **********************************/
	/**********************************************************************************************/
	$(".grid__filter p").click(function(e) {
		e.preventDefault();

		if ( !load_blocked ) {
			var $toggle = $(this).closest(".grid__filter");
			if ( !$(this).hasClass("active") ) {
				var is_search = $(this).closest(".grid").hasClass("popup-search__grid") ? true : false;
				
				if ( !is_search ) {
					$(".page-grid .grid__items").removeClass("show-"
						+ $toggle.find(".active").data("id"));
					$(".page-grid .grid__items").addClass("show-" + $(this).data("id"));
				}
				
				$toggle.find(".active").removeClass("active");
				$(this).addClass("active");
				
				if ( is_search ) {
					if ( $(".popup-search #search-form #search-word").val().length == 0 )
						search_on = false;
					reset_grid( $(".popup-search .grid"), search_on );
				}
				else reset_grid( $(".page-grid .grid") );
			}
		}
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      PAGE GRID TABS      **********************************/
	/**********************************************************************************************/
	$(".page-grid .tabs__item").click(function(e) {
		e.preventDefault();

		if ( !load_blocked ) {
			var $tabs = $(this).closest(".tabs");
			if ( !$(this).hasClass("active") ) {
				$(".page-grid .grid__items").removeClass("show-"
					+ $(".page-grid .grid__filter .active").data("id"));
				
				$tabs.find(".active").removeClass("active");
				$(this).addClass("active");
				
				if ( $(".main").hasClass("page-account") ) {
					if ( !$("#post-sort [data-id='publish']").hasClass("active") ) {
						$("#post-sort .active").removeClass("active");
						$(".page-grid .grid__items").removeClass("show-"
							+ $("#post-sort .active").data("id"));
						$("#post-sort [data-id='publish']").addClass("active");
						$(".page-grid .grid__items").addClass("show-publish");
					}
					
					if ( $(this).data("id") !== "conf" ) {
						$(".grid__select").addClass("hide");
						
						if ( $("#conf-date-sort").val() !== "all" )
							$("#conf-date-sort").val("all").change();
					}
					else $(".grid__select").removeClass("hide");
					
					if ( $(this).data("id") == "post" || $(this).data("id") == "conf" ) {
						$(".page-grid .grid__nav").removeClass("hide");
						$(".page-grid .grid__items").addClass("show-btns");
						$(".page-grid .grid__items").addClass("show-"
							+ $("#post-sort .active").data("id"));
						
						if ( $(this).data("id") == "conf" ) {
							$(".add-area__item_post").addClass("hide");
							$(".add-area__item_conf").removeClass("hide");
						}
						else {
							$(".add-area__item_post").removeClass("hide");
							$(".add-area__item_conf").addClass("hide");
						}
					}
					else {
						$(".page-grid .grid__nav").addClass("hide");
						$(".page-grid .grid__items").removeClass("show-btns");
						$(".add-area__item_post").addClass("hide");
						$(".add-area__item_conf").addClass("hide");
					}
				}
				
				reset_grid( $(".page-grid .grid") );
			}
		}
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     CONF DATE SELECT     **********************************/
	/**********************************************************************************************/
	$(".page-account #conf-date-sort").on("change", function() {
		if ( $(".page-grid .tabs .active").data("id") == "conf" && !load_blocked )
			reset_grid( $(".page-grid .grid") );
    });
	
	
	
	/**********************************************************************************************/
	/**********************************      GRID BLOCK BTN      **********************************/
	/**********************************************************************************************/
	$("body").on("click", ".page-grid .grid-block__btns .grid-block__edit", function(e) {
		e.preventDefault();
		window.location.href = $(this).data("href");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     GRID BLOCK ICONS     **********************************/
	/**********************************************************************************************/
	$("body").on("click", ".grid-block__datalink", function(e) {
		e.preventDefault();
		window.location.href = $(this).data("href");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      LAZY PACK LOAD      **********************************/
	/**********************************************************************************************/
	var load_blocked = false;
	var load_complete = false;
	var search_complete = false;
	var post_paged = 2;
	if ( $("body").hasClass("paged") ) {
		var bodyClasses = $("body").attr("class").split(/\s+/);
		
		$.each(bodyClasses, function(index, value) {
			if ( value.substring(0, 6) == 'paged-' ) {
				post_paged = parseInt( value.substring(6) ) + 1;
				return false;
			}
		});
	}
	var search_paged = 1;
	var search_on = false;
			
	/******************************************************************************************/
	function load_grid_package( $grid ) {
		var is_search = $grid.hasClass("popup-search__grid") ? true : false;
		
		load_blocked = true;

		var post_fix = $grid.find(".grid-block.fix").length > 0 ?
			$grid.find(".grid-block.fix").data("id") : '';

		var post_sort = 'date';

		var post_type = $(".page-grid").data("type") ? $(".page-grid").data("type") + ',' : '';

		var post_status = 'publish';
		var post_author = '';

		var post_cats = $(".page-grid").data("slug") ? $(".page-grid").data("slug") + ',' : '';

		var post_date_from = $(".page-grid__calendar-menu .active").data("from");
		var post_date_to = $(".page-grid__calendar-menu .active").data("to");

		// PAGE AUTHOR PARAMETERS
		if ( $(".main").hasClass("page-author") ) {
			post_sort = $("#author-sort .active").data("id");
			post_type = $(".tabs .active").data("type");
			post_author = $(".page-author__head").data("id");
			post_cats = '';
			post_date_from = '';
			post_date_to = '';
		}

		// PAGE ACCOUNT PARAMETERS
		if ( $(".main").hasClass("page-account") ) {
			post_sort = 'date';
			post_type = $(".tabs .active").data("type");
			post_status = $("#post-sort .active").data("id");
			post_author = $(".page-account").data("user");
			post_cats = '';
			post_date_from = '';
			post_date_to = '';

			if ( $(".tabs .active").data("id") == "conf" ) {
				if ( $("#conf-date-sort").val() == "past" ) {
					post_date_from = '-1';
					post_date_to = $("#conf-date-sort").val();
				}
				else if ( $("#conf-date-sort").val() == "future" ) {
					post_date_from = $("#conf-date-sort").val();
					post_date_to = '-1';
				}
			}
		}
		
		// SEARCH POPUP
		if ( is_search ) {
			var $search_type = $grid.find(".grid__filter .active").data("id");
			post_sort = 'date';
			if ( $search_type == 'post' ) post_type = 'post,';
			else if ( $search_type == 'conf' ) post_type = 'conf,';
			else post_type = 'conf,post,';
			post_status = 'publish';
			post_author = '';
			post_cats = '';
			post_date_from = '';
			post_date_to = '';
		}

		var data = new FormData();
		data.append( 'sort', post_sort );
		data.append( 'type', post_type );
		data.append( 'status', post_status );
		data.append( 'author', post_author );
		data.append( 'cats', post_cats );
		data.append( 'fix', post_fix );
		data.append( 'date_from', post_date_from );
		data.append( 'date_to', post_date_to );
		var paged = is_search ? search_paged : post_paged;
		data.append( 'paged', paged );
		
		if ( is_search ) {
			data.append( 'search_word', $(".popup-search #search-form #search-word").val() );
			data.append( 'search_type', $grid.find(".grid__filter .active").data("id") );
		}

		if ( $(".main").hasClass("page-tag") ) {
			var post_tag = $(".page-grid__title").data("id");
			data.append( 'post_tag', post_tag );
		}
		else if ( $(".main").hasClass("page-conf-tag") ) {
			var conf_tag = $(".page-grid__title").data("id");
			data.append( 'conf_tag', conf_tag );
		}
		else if ( $(".main").hasClass("page-category") ) {
			if ( $(".page-grid .tags-filter__tag.active").length > 0 ) {
				data.append( 'post_tag', $(".page-grid .tags-filter__tag.active").data("id") );
			}
		}
		else if ( $(".main").hasClass("page-account") && $(".tabs .active").data("id") == "wish" )
			data.append( 'post_wish', 'on' );

		$grid.find(".grid__loader").addClass("show");

		$.ajax({
			method: 'POST',
			url: '/wp-content/themes/factory16/inc/actions/grid.php',
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			data: data,
			success: function(data) {
				data = $.parseJSON( data );
				if ( data.status == 'ok' ) {
					if ( data.package == 'empty' ) {
						if ( is_search ) search_complete = true;
						else {
							load_complete = true;
							$(".page-grid .grid__loadmore").remove();
						}
					}
					else {
						if ( is_search ) search_paged += 1;
						else post_paged += 1;
						$grid.find(".grid__items").append( data.package );
					}
				}
				$grid.find(".grid__loader").removeClass("show");
				load_blocked = false;
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log( textStatus, errorThrown );
				$grid.find(".grid__loader").removeClass("show");
				load_blocked = false;
			}
		});
	}
		
		
	/******************************************************************************************/
	function reset_grid( $grid, $load = true ) {
		var is_search = $grid.hasClass("popup-search__grid") ? true : false;
		
		$grid.find(".grid-block:not(.fix)").remove();

		if ( is_search ) {
			search_complete = false;
			search_paged = 1;
		}
		else {
			load_complete = false;
			post_paged = 1;
		}
		
		if ( $load ) load_grid_package( $grid );
	}
	
	
	
	
	/**********************************************************************************************/
	/**********************************     PAGE GRID SCROLL     **********************************/
	/**********************************************************************************************/
	if ( $(".main").hasClass("page-grid") ) {
		var last_scroll = 0;
		
		if ( !$(".grid").hasClass("grid-loadmore") ) {
			$(".main__content").on("scroll wheel touchmove", function() {
				var curr_scroll = $(window).scrollTop();
				if ( !load_complete && !load_blocked && curr_scroll >= last_scroll ) {
					var main_h = $(".main").offset().top + $(".main").outerHeight();
					if ( main_h <= window.innerHeight ||
						curr_scroll >= main_h - window.innerHeight - 50 ) {
						load_grid_package( $(".page-grid .grid") );
					}
				}
				last_scroll = curr_scroll;
			});
		}
		else {
			$(".page-grid .grid__loadmore").click(function() {
				load_grid_package( $(".page-grid .grid") );
			});
		}
	}
	
	
	
	/**********************************************************************************************/
	/**********************************      SEARCH  SCROLL      **********************************/
	/**********************************************************************************************/
	$(".open-popup").click(function(e) {
		e.preventDefault();
		if ( $(this).attr("href") == "#search" ) {
			$(".popup-search__content").on("scroll wheel touchmove", function() {
				var curr_scroll = $(window).scrollTop();
				if ( search_on ) {
					if ( !search_complete && !load_blocked && curr_scroll >= last_scroll ) {
						var main_h = $(".popup-search").offset().top
							+ $(".popup-search").outerHeight();
						if ( main_h <= window.innerHeight ||
							curr_scroll >= main_h - window.innerHeight - 50 ) {
							load_grid_package( $(".popup-search .grid") );
						}
					}
					last_scroll = curr_scroll;
				}
			});
		}
	});
	
	/**********************************************************************************************/
	$(".popup__close, .close-popup, .overlay").click(function(e) {
		e.preventDefault();
		reset_grid( $(".popup-search .grid"), false );
		$(".popup-search #search-form #search-word").val('');
		search_on = false;
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       SEARCH POPUP       **********************************/
	/**********************************************************************************************/
	$(".popup-search #search-form").validate({
		submitHandler: function(form) {
			search_on = true;
			reset_grid( $(".popup-search .grid") );
		}
	});
	
	/**********************************************************************************************/
	$(".search-formarea__submit").click(function() {
		$(this).closest("form").submit();
	});
});
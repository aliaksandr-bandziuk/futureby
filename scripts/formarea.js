jQuery(function($) {
	/**********************************************************************************************/
	/**********************************    FORMAREA  PASSWORD    **********************************/
	/**********************************************************************************************/
	$(".formarea__pass-icon").click(function() {
		$(this).closest(".formarea__pass").toggleClass("show");
		if ( $(this).closest(".formarea__pass").hasClass("show") )
			$(this).closest(".formarea__pass").find("input").attr("type", "text");
		else $(this).closest(".formarea__pass").find("input").attr("type", "password");
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      FORMAREA  DATE      **********************************/
	/**********************************************************************************************/
	$.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
	
	/**********************************************************************************************/
	$(".formarea__date input").each(function() {
		$(this).datepicker({
			dateFormat: "dd / mm / yy",
			firstDay: 1,
			minDate: 0,
			maxDate: "+1Y",
			showAnim: "fadeIn"
		});
	});
	
	
	
	/**********************************************************************************************/
	/**********************************      FORMAREA  TIME      **********************************/
	/**********************************************************************************************/
	$(".formarea__time input").each(function() {
		$(this).mask('00 : 00');
	});
	
	
	
	/**********************************************************************************************/
	/**********************************       FORMAREA  TEL      **********************************/
	/**********************************************************************************************/
	$(".formarea__tel").each(function() {
		$(this).mask('+ZZZZZZZZZZZZZZZZZZZZ', { translation: {
			'Z': { pattern: /[0-9]/, optional: true } } } );
	});
	
	
	
	/**********************************************************************************************/
	/**********************************     FORMAREA  SELECT     **********************************/
	/**********************************************************************************************/
	$(".formarea__select").each(function() {
		var $select = $(this).find("select");
		
		var selectContent = '<div class="select__selected">'
			+ $select.find("option:selected").text() + '</div>';
		
		selectContent += '<div class="select__items hide">';
		$select.find("option").each(function( $index ) {
			selectContent += '<div data-val="' + $(this).val() + '"';
			/*if ( $(this).data("id") !== 'undefined' )
				selectContent += ' data-id="'+ $(this).data("id") +'"';*/
			selectContent += ' class="select__item';
			if ( $(this).is(":selected") ) selectContent += ' same';
			selectContent += '">' + $(this).text() + '</div>';
		});
		selectContent += '</div>';
		
		$select.after( selectContent );
	});
	
	/**********************************************************************************************/
	$("body").on("click", ".formarea__select .select__item", function() {
        var field = $(this).closest(".select");
        field.find(".select__selected").html( $(this).html() );
        field.find(".same").removeClass("same");
        $(this).addClass("same");
        field.find("select").val( $(this).attr("data-val") ).change();
    });
	
	/**********************************************************************************************/
    $("body").on("click", ".formarea__select .select__selected", function(e) {
        e.stopPropagation();
		$(this).closest(".formarea__select").addClass("open");
        $(this).closest(".formarea__select").find(".select__items").toggleClass("hide");
    });
	
	/**********************************************************************************************/
    $("body").on("click", function() {
		$(".formarea__select").removeClass("open");
        $(".formarea__select .select__items").addClass("hide");
    });
	
	/**********************************************************************************************/
	$(".formarea__select select").on("change", function() {
		var field = $(this).closest(".select");
		if ( $(this).val() !== field.find(".same").data("val") ) {
			field.find(".select__selected").html(
				field.find("option[value='"+ $(this).val() +"']").text() );
			field.find(".same").removeClass("same");
			field.find(".select__item[data-val='"+ $(this).val() +"']").addClass("same");
		}
    });
	
	
	
	
	/**********************************************************************************************/
	/**********************************      FORMAREA  TAGS      **********************************/
	/**********************************************************************************************/
	var tagsArr = [];
	if ( $(".tags__list-item").length > 0 ) {
		$(".tags__list-item").each(function() {
			tagsArr[ tagsArr.length ] = $(this).find("p").text();
		});
		if ( tagsArr.length == 10 )
			$(this).closest(".tags").find("input").addClass("disabled");
	}
	
	/**********************************************************************************************/
	$(".formarea__tags input").on("keyup keypress", function(e) {
        var keyCode = e.keyCode || e.which;
		if ( keyCode === 13 ) {
			e.preventDefault();
			addTag( $(this).closest(".formarea__tags") );
		}
    });
	
	/**********************************************************************************************/
	$(".formarea__tags input + img").click(function() {
		addTag( $(this).closest(".formarea__tags") );
    });
	
	/**********************************************************************************************/
	function addTag( $tagsBlock ) {
		var tagValue = $tagsBlock.find("input").val();
		
		if ( tagValue !== "" && $.inArray( tagValue, tagsArr ) == -1 ) {
			$tagsBlock.find("input").val("");
			var tagElement = '<div class="tags__list-item">';
			tagElement += '<p>' + tagValue + '</p>';
			tagElement += '<span>';
			tagElement += '<img src="/wp-content/themes/factory16/img/icons/tag-remove.svg" alt>';
			tagElement += '</span>';
			tagElement += '</div>';
			$tagsBlock.find(".tags__list").append( tagElement );
			tagsArr[ tagsArr.length ] = tagValue;
			if ( tagsArr.length == 10 ) {
				$tagsBlock.find("input").addClass("disabled");
				$tagsBlock.find("input").blur();
			}
		}
	}
	
	/**********************************************************************************************/
	$("body").on("click", ".formarea__tags .tags__list-item span", function() {
		var tagText = $(this).closest(".tags__list-item").find("p").text();
		var tagPos = $.inArray( tagText, tagsArr );
		tagsArr.splice( tagPos, 1 );
		$(this).closest(".tags__list-item").remove();
		$(".formarea__tags").find("input").removeClass("disabled");
    });
	
	
	
	
	/**********************************************************************************************/
	/**********************************      FORMAREA CARDS      **********************************/
	/**********************************************************************************************/
	$(".formarea__cards .color-cards__list-item").click(function() {
		if ( !$(this).hasClass("active") ) {
			$(".formarea__cards .color-cards__list-item.active").removeClass("active");
			$(this).addClass("active");
		}
    });
});
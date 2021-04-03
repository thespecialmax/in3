(function ($) {
	"use strict";

	$(document).ready(function(e){
		// Make responsive menu
		var $vu_mobile_menu = $('<div></div>').addClass('vu_mobile-menu'),
			$vu_mobile_menu_list = $('<ul></ul>');

		$('.vu_main-menu .vu_mm-list').each(function(){
			$vu_mobile_menu_list.append( $(this).html() );
		});

		$vu_mobile_menu_list.find('li.vu_wc-menu-item').remove();

		$vu_mobile_menu_list.appendTo( $vu_mobile_menu );
		$vu_mobile_menu.appendTo( $('#all') );
		$vu_mobile_menu.prepend( '<div class="text-right"><a href="#" class="vu_mm-toggle vu_mm-remove"><i class="fa fa-times-circle"></i></a></div>' );

		$(document).on('click', '.vu_mm-toggle', function(e){
			e.preventDefault();

			$('body').toggleClass('vu_no-scroll');
			$('.vu_mobile-menu').fadeToggle();
		});

		// Menu item icon
		var $vu_menu_item_icon = $('li.menu-item.fa');

		$vu_menu_item_icon.each(function(){
			var $this = $(this),
				$a = $this.children('a');

			$this.removeClass(function(index, css) {
				var icon = (css.match(/(fa?[\w+\-]+)/g) || []).join(' ');
				$a.prepend('<i class="'+ icon +'"></i>');
				return icon;
			});
		});

		// Performs a smooth page scroll to an anchor on the same page
		$(document.body).on('click', '.vu_main-menu a[href*="#"]:not([href="#"]), .vu_mobile-menu a[href*="#"]:not([href="#"])', function(){
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);

				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

				if (target.length) {
					if( $('.vu_mobile-menu').is(':visible') ){
						$('body').removeClass('vu_no-scroll');
						$('.vu_mobile-menu').fadeOut();
					}

					var offset = target.offset().top;

					offset -= parseInt( $('#vu_menu-affix .vu_main-menu-container').outerHeight() ) || 0;
					offset -= parseInt( $('#wpadminbar').outerHeight() ) || 0;

					$('html,body').stop().animate({
						scrollTop: offset
					}, 800);
					
					return false;
				}
			}
		});

		// Generate Custom CSS for VC Rows
		var $vu_vc_rows = $('.vu_color-overlay[data-color-overlay]'),
			vu_vc_rows_style = '';

		$vu_vc_rows.each(function(){
			var vu_vc_custom_class = 'vu_custom_'+ Math.floor((Math.random() * 10000) + 1);
			vu_vc_rows_style += '.'+ vu_vc_custom_class +':before{background-color:'+ $(this).attr('data-color-overlay') +';}';
			$(this).addClass(vu_vc_custom_class);
		});

		$('head').append('<style id="custom_css_for_vc_rows">'+ vu_vc_rows_style +'</style>');
		
		// Replace all SVG images with inline SVG
		$('img[src$=".svg"]').each(function(){
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = $(data).find('svg');

				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}

				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');

				// Replace image with new SVG
				$img.replaceWith($svg);

			}, 'xml');
		});

		// iOS Hover Event Class Fix
		if(navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
			$('.vu_product-item').on('touchstart', function(e) {
				var $link = $(this);

				if ($link.hasClass('hover')) {
					return true;
				} else {
					$link.addClass('hover');
					$('.vu_product-item').not(this).removeClass('hover');
					e.preventDefault();
					return false;
				}
			});

			$(document.body).on('touchstart', function(e) {
				if(e.target !== $('.vu_product-item') && e.target !== $('.vu_product-item a') ) {
					$('.vu_product-item').removeClass('hover');
				}
			});
		}

		// Submit forms via ajax
		var $vu_frm_ajax = $('.vu_frm-ajax');

		$vu_frm_ajax.on('submit', function(e){
			e.preventDefault();

			var $form = $(this),
				$progress = $form.find('.vu_progress'),
				$msg = $form.find('.vu_msg');
			
			$progress.removeClass('hide');
			$msg.html('');

			$.ajax({
				url: vu_config.ajaxurl,
				type: 'POST',
				dataType: 'json',
				cache: false,
				data: $form.serialize(),
				success: function(data) {
					$progress.addClass('hide');

					if(data.status !== 'error'){
						$msg.html('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>'+ data.title +'</strong> '+ data.msg +'</div>');

						if( $form.hasClass('vu_clear-fields') ){
							$form.find('input[type="text"], select, textarea').val('');
						}

						if(data.redirect){
							window.location = data.redirect;
						}
					} else {
						$msg.html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>'+ data.title +'</strong> '+ data.msg +'</div>');
						$form.find('input[data-focus]').focus();
					}
				}
			});
		});

		// Social Share
		var $vu_social_links = $('.vu_social-link');

		$vu_social_links.on('click', function(e){
			e.preventDefault();

			window.open( $(this).data('href'), "_blank", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" ) 
			
			return false;
		});

		// Magnific Popup - http://dimsemenov.com/plugins/magnific-popup/
		var $vu_lightbox = $('.vu_lightbox');

		$vu_lightbox.each(function(){
			var $this = $(this);

			if( $this.hasClass('vu_gallery') ){
				try {
					$this.magnificPopup({
						delegate: $this.data('delegate') || 'a',
						type: 'image',
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						}
					});
				} catch(err) {}
			} else {
				try {
					$this.magnificPopup({
						type: ($this.data('type') == undefined) ? 'image' : $this.data('type')
					});
				} catch(err) {}
			}
		});

		// Tweeter widget
		var $twitter = $(".vu_latest-tweets");

		$twitter.each(function(){
			var $this = $(this);

			try {
				$this.tweet({
					username: $this.data("user"), // Change username here
					avatar_size: ($this.data("avatarsize") == undefined) ? 90 : $this.data("avatarsize"), // you can active avatar
					count: ($this.data("count") == undefined) ? 3 : $this.data("count"), // number of tweets
					loading_text: ($this.data("text") == undefined) ? null : $this.data("text"),
					modpath: ($this.data("modpath") == undefined) ? vu_config.ajaxurl : $this.data("modpath"), // Twitter files path
					action: ($this.data("action") == undefined) ? null : $this.data("action"),
					join_text: false
				});
			} catch(err) {}
		});

		// Facebook Like Box widget
		try {
			var $vu_facebook_like_box_widget = $(".vu_fb-like-box-container");

			$vu_facebook_like_box_widget.each(function(e){
				$(this).html('<iframe src="http://www.facebook.com/plugins/likebox.php?href='+ encodeURIComponent($(this).data('href')) +'&amp;width='+ $(this).data('width') +'&amp;colorscheme='+ $(this).data('colorscheme') +'&amp;show_faces='+ $(this).data('show-faces') +'&amp;show_border='+ $(this).data('show-border') +'&amp;stream='+ $(this).data('stream') +'&amp;header='+ $(this).data('header') +'&amp;height='+ $(this).data('height') +'" allowtransparency="true" style="height: '+ $(this).data('height') +'px;"></iframe>');
			});
		} catch(err) {}

		// Flickr widget
		var $flickr = $(".vu_flickr-photos");

		$flickr.each(function(){
			var user = $(this).data("user"),
				limit = $(this).data("limit");
			try {
				$(this).jflickrfeed({
					limit: limit,
					qstrings: {
						id: user
					},
					//itemTemplate: '<a href="http://www.flickr.com/photos/'+ user +'" target="_blank"><img src="{{image_s}}" alt="{{title}}"></a>'
					itemTemplate: '<a href="{{image_b}}" title="{{title}}"><img src="{{image_s}}"></a>'
				});
			} catch(err) {}
		});

		// Comment Form
		var $vu_comment_reply_link = $('#comments a.vu_comment-reply-link');

		$vu_comment_reply_link.on('click', function(e){
			e.preventDefault();

			var id = $(this).data('id'),
				$appendTo = $(this).parents('div#comment-'+ id),
				$comment_form = $('#respond').clone();

			$('#respond').remove();

			$comment_form.addClass('m-t-30 m-b-30').find('a#cancel-comment-reply-link').show();
			$comment_form.find('input#comment_parent').val(id);
			$comment_form.appendTo( $appendTo );
		});

		$(document).on('click', '#respond a#cancel-comment-reply-link', function(e){
			e.preventDefault();

			var $comment_form = $('#respond').clone();

			$('#respond').remove();

			$comment_form.removeClass('m-t-30').removeClass('m-b-30').find('a#cancel-comment-reply-link').hide();
			$comment_form.find('input#comment_parent').val('0');
			$comment_form.appendTo( $('div#comments.blog-post-comments') );
		});

		// Owl Carousels - http://owlgraphic.com/owlcarousel/index.html
		var $vu_carousel = $('.vu_owl-carousel');

		$vu_carousel.each(function(){
			var $this = $(this),
				options = $this.data('options'),
				$carousel = ($this.data('owl') == undefined) ? $this : $this.find( $this.data('owl') );

			if( options == undefined ) {
				options = {
					navigation: ($this.data('navigation') == undefined) ? true : $this.data('navigation'),
					navigationText: ($this.data('navigationtext') == undefined) ? false : $this.data('navigationtext'),
					singleItem: ($this.data('single') == undefined) ? true : $this.data('single'),
					items: ($this.data('items') == undefined) ? 1 : $this.data('items'),
					autoHeight: ($this.data('autoheight') == undefined) ? false : $this.data('autoheight'),
					pagination: ($this.data('pagination') == undefined) ? true : $this.data('pagination'),
					rewindNav: ($this.data('rewindnav') == undefined) ? true : $this.data('rewindnav'),
					autoPlay: ($this.data('autoplay') == undefined) ? false : $this.data('autoplay')
				};
			}

			options['afterUpdate'] = function(){
				var owl = $this.data('owlCarousel');

				$this.attr({'data-items': owl.visibleItems.length});

				//Add extra class for last active element
				$this.find('.owl-item').removeClass('last');
				$this.find('.owl-item.active').last().addClass('last');
			}

			options['afterMove'] = function(){
				//Add extra class for last active element
				$this.find('.owl-item').removeClass('last');
				$this.find('.owl-item.active').last().addClass('last');

				if( options.autoHeight === true ) {
					$(window).trigger('resize.px.parallax');
				}
			}
			
			if( $('body').hasClass('rtl') ) {
				options.rtl = true;

				options.dragBeforeAnimFinish = false;
				options.mouseDrag = false;
				options.touchDrag = false;
			}

			try {
				$carousel.owlCarousel(options);
				$carousel.attr({'data-items': $carousel.find('.owl-wrapper .owl-item.active').length});
				$carousel.find('.owl-wrapper .owl-item.active').last().addClass('last');
			} catch(err) {}
		});

		// Multiselect - http://davidstutz.github.io/bootstrap-multiselect/
		var $vu_multiselect = $('select.vu_multiselect');

		$vu_multiselect.each(function(){
			var $this = $(this);

			try {
				$this.multiselect({
					buttonWidth: ($this.data('width') == undefined) ? '100%' : $this.data('width'),
					maxHeight: ($this.data('height') == undefined) ? 216 : ($this.data('height')).toInteger(),
					numberDisplayed: ($this.data('display') == undefined) ? 5 : ($this.data('display')).toInteger(),
					includeSelectAllOption: ($this.data('width') == undefined) ? true : $this.data('width'),
					selectAllText: ($this.data('selectalltext') == undefined) ? '' : $this.data('selectalltext'),
					checkboxName: ($this.data('name') == undefined) ? '' : $this.data('name'),
					nonSelectedText: ($this.data('placeholder') == undefined) ? '' : $this.data('placeholder'),
					buttonClass: 'form-control vu_btn-multiselect',
				});
			} catch(err) {}
		});

		// Milestone
		var $vu_milestone = $('.vu_milestone .vu_counter');

		$vu_milestone.each(function(){
			var $this = $(this);

			try {
				$(this).counterUp({
					delay: ($this.data('delay') == undefined) ? 10 : $this.data('delay'),
					time: ($this.data('time') == undefined) ? 1000 : $this.data('time')
				});
			} catch(err) {}
		});

		// Countdown
		var $vu_countdown = $('.countdown');

		$vu_countdown.each(function(){
			var date = $(this).data('date').split('-'),
				format = $(this).data('format');
			try	{
				$(this).countdown({
					until: new Date( parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]) ),
					padZeroes: true,
					format: format
				});
			} catch(err){}
		});

		// Count Up
		var $vu_count_up = $('.vu_count-up');

		$vu_count_up.each(function(){
			var date = $(this).data('date').split('-'),
				format = $(this).data('format');
			try	{
				$(this).countdown({
					since: new Date( parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]) ),
					padZeroes: true,
					format: format
				});
			} catch(err){}
		});

		// Image Slider
		var $vu_image_slider = $('.vu_image-slider'),
			vu_is_custom_css = '';

		$vu_image_slider.each(function(){
			var $this = $(this),
				color = $this.data('color');

			var vu_is_custom_class = 'vu_is-custom_'+ Math.floor((Math.random() * 10000) + 1);
			vu_is_custom_css += '.'+ vu_is_custom_class +' .owl-buttons .owl-prev,.'+ vu_is_custom_class +' .owl-buttons .owl-next{color:'+ color +'!important; border-color:'+ color +'!important;}.'+ vu_is_custom_class +' .owl-pagination .owl-page{border-color:'+ color +'!important;}.'+ vu_is_custom_class +' .owl-pagination .owl-page.active{border-color:'+ color +'!important;}.'+ vu_is_custom_class +' .owl-pagination .owl-page.active span{background-color:'+ color +'!important;}';
			$this.addClass(vu_is_custom_class);
		});

		$('head').append('<style id="vu_is-custom-css">'+ vu_is_custom_css +'</style>');

		//Datepicker - https://bootstrap-datepicker.readthedocs.org/en/latest/
		var $vu_datepicker = $('.vu_datepicker');

		$vu_datepicker.each(function(){
			var $this = $(this);

			try {
				$this.datepicker({
					startDate: new Date(),
					weekStart: ($this.data('weekstart') == undefined) ? 1 : ($this.data('weekstart')).toInteger(),
					autoclose: true,
					format: ($this.data('format') == undefined) ? 'dd/mm/yyyy' : $this.data('format'),
					custom_class: ($this.data('class') == undefined) ? '' : $this.data('class')
				});
			} catch(err) {}
		});
		
		// Add Custom class for default WP Calendar Widget
		$('.sidebar .widget_calendar #calendar_wrap table#wp-calendar').addClass('table table-striped');
		$('.page-footer .widget_calendar #calendar_wrap table#wp-calendar').addClass('table');
		
		// Menu trigger
		$(document).on('click', '#menu-button', function(e) {
			$(this).parents('.page-header').find('#nav-top').stop().slideToggle();
		});
		
		// In page scrolling
		$('.scroll-to').on('click', function(e) {
			e.preventDefault();
			$.scrollTo($(this).attr('href'), 800, {axis:'y'});
		});
		
		// On-scroll animations
		var on_scroll_anims = $('.onscroll-animate');

		on_scroll_anims.each(function(){
			$(this).one('inview', function(event, visible){
				var el = $(this),
					anim = (el.attr("data-animation") !== undefined) ? el.attr("data-animation") : "fadeIn",
					delay = (el.attr("data-delay") !== undefined ) ? el.attr("data-delay") : 200;

				var timer = setTimeout(function() {
					el.removeClass('onscroll-animate').addClass(anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						$(this).removeClass('animated').removeClass(anim);
					});
					clearTimeout(timer);
				}, delay);
			});
		});

		//Load image with lazy load
		var $vu_lazy_load = $('.vu_lazy-load');

		$vu_lazy_load.each(function(){
			var $this = $(this),
				img = $this.data('img') || false;

			if( img != false ) {
				$('<img/>').attr('src', img).load(function() {
					$(this).remove();
					$this.css('background-image', 'url('+ img +')');
				});
			}
		});

		// Equal Height Columns
		$('[data-equal-height-columns="true"]').each(function(){
			$(this).addClass('row-same-height row-full-height');
			$(this).find('[class*="col-"]').addClass('col-md-height col-full-height');
		});

		// Google Maps
		var vu_maps = function() {
			var $vu_maps = $('.vu_map');
		
			$vu_maps.each(function(){
				try {
					google.maps.event.addDomListener(window, 'load', initialize_map($(this)));
				} catch(err) {}
			});
		}

		if (typeof google === 'object' && typeof google.maps === 'object') {
			vu_maps();
		} else {
			$.getScript('//maps.googleapis.com/maps/api/js?v=3.34'+ ((vu_config.google_maps_api_key !== '') ? '&key='+ vu_config.google_maps_api_key : ''), function() {
				vu_maps();
			});
		}

		// ToolTip
		try {
			$('[data-toggle="tooltip"]').tooltip();
		} catch(err) {}

		// Fix VC Front End Editor
		if ( $('body').hasClass('vc_editor') ) {
			$('.vc_element[data-model-id] > div[class*="col-sm-"]').attr('class', function(i, c){
				$(this).parent('.vc_element').addClass((c.match(/(col-(top|middle|bottom))/g) || []).join(' ')).removeClass('vc_element');

				return c.replace(/col-sm-\d+/g, 'wpb_column vc_column_container').replace('col-md-height', '').replace('col-full-height', '').replace(/(col-(top|middle|bottom))/g, '').trim();
			});
		}
	});
		
	$(window).on('load', function() {
		// Preloader
		try {
			$('body').imagesLoaded(function(){
				$('#vu_preloader').fadeOut();
			});
		} catch(err) {}

		// Menu affix height
		$('.vu_menu-affix-height').height( $('#vu_menu-affix').outerHeight() );

		//Products Menu with filter
		var $vu_products = $('.vu_products');

		$vu_products.each(function () {
			var $this = $(this),
				options = {
					itemSelector: '.vu_product-item-container',
					filter: '*',
					layoutMode: 'masonry'
				},
				$filter = $this.parents('.vu_products-container').find('.vu_products-filters a.vu_filter');

			try {
				$this.isotope(options);
			} catch(err) {}

			$filter.on('click', function(e){
				e.preventDefault();

				$filter.removeClass('active');
				$(this).addClass('active');

				try {
					$this.isotope({ filter: $(this).data('filter') });
				} catch(err) {}

				return false;
			});
		});

		//Gallery with filter
		var $vu_gallery = $('.vu_gallery.vu_g-filterable');

		$vu_gallery.each(function () {
			var $this = $(this).find('.vu_g-items'),
				options = {
					itemSelector: '.vu_g-item',
					filter: '*',
					layoutMode: 'masonry'
				},
				$filter = $this.parents('.vu_gallery').find('.vu_g-filters .vu_g-filter');

			try {
				$this.isotope(options);
			} catch(err) {}

			$filter.on('click', function(e){
				e.preventDefault();

				$filter.removeClass('active');
				$(this).addClass('active');

				try {
					$this.isotope({ filter: $(this).data('filter') });
				} catch(err) {}

				return false;
			});
		});
	});

	// Top menu switch
	$(window).on('scroll', function(e) {
		var $vu_menu_affix_height = $('.vu_menu-affix-height'),
			$vu_menu_affix = $('#vu_menu-affix');

		if( $vu_menu_affix.hasClass('affix-top') ) {
			$vu_menu_affix_height.height( $vu_menu_affix.outerHeight() );
		}
	});

	// Map Initialize - https://developers.google.com/maps/documentation/javascript/reference
	function initialize_map(map_element){
		"use strict";

		var $map = map_element,
			options = $map.data('options') || window.vu_map_options,
			element_id = 'map_' + Math.floor((Math.random() * 10000) + 1);

		$map.attr({'id': element_id});

		var mapOptions = { 
			zoom: options.zoom_level.toInteger(),
			center: new google.maps.LatLng(options.center_lat, options.center_lng),
			zoomControl: options.others_options.zoomControl.toBoolean(),
			disableDoubleClickZoom: options.others_options.disableDoubleClickZoom.toBoolean(),	
			scrollwheel: options.others_options.scrollwheel.toBoolean(),
			panControl: options.others_options.panControl.toBoolean(),
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeControl: options.others_options.mapTypeControl.toBoolean(),
			scaleControl: options.others_options.scaleControl.toBoolean(),
			streetViewControl: options.others_options.streetViewControl.toBoolean()
		};

		var map = new google.maps.Map(document.getElementById(element_id), mapOptions),
			marker = null,
			infowindows = [];

		switch(options.map_type){
			case "satellite":
				map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
				
				if( options.tilt_45.toBoolean() == true ) {
					map.setTilt(45);
				}
			break;

			case "hybrid":
				map.setMapTypeId(google.maps.MapTypeId.HYBRID);
			break;

			case "terrain":
				map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
			break;
			
			default:
				map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
				map.setOptions({styles: $.parseJSON(options.styles)});
			break;
		}

		for(var i=0; i<options.locations.length; i++){
			marker = new google.maps.Marker({
				index: i,
				map: map,
				position: new google.maps.LatLng(options.locations[i].lat, options.locations[i].lng),
				animation: ( options.enable_animation.toBoolean() == true ) ? google.maps.Animation.BOUNCE : google.maps.Animation.DROP,
				icon: (options.use_marker_img.toBoolean() == true) ? options.marker_img : null
			});

			if( !options.locations[i].info.isEmpty() ) {
				infowindows[i] = new google.maps.InfoWindow({
					content: options.locations[i].info,
					maxWidth: 200,
					maxHeight: 200
				});

				google.maps.event.addListener(marker, 'click', function(){
					for(var i=0; i<options.locations.length; i++){
						try {
							infowindows[i].close();
						} catch (err) {}
					}
					
					infowindows[this.index].open(map, this);
				});
			}
		}
	}

	// Convert String to Boolean
	String.prototype.toBoolean = function(){
		return (this == "1" || this.toLowerCase() == "true") ? true : false;
	}

	// Convert String to Integer
	String.prototype.toInteger = function(){
		return parseInt(this);
	}

	// Checking if a string is blank or contains only white-space
	String.prototype.isEmpty = function(){
		return (this.length === 0 || !this.trim());
	}
})(jQuery);
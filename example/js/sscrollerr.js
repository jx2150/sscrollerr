window.SScrollerr = (function( window, document, undefined ) {
	var version = '0.2',
	SScrollerr = {},
	sections = [],
	currentSection = 0,
	sectionAnimationDuration = 1000,
	scrollReady = true,
	minHeight = 600,
	scrollCallbacks = [];

	SScrollerr.init = function(obj) {
		if (obj && obj.sectionSelector) {
			$(obj.sectionSelector).each(function(){
				sections.push( $(this).attr('id') );
			});
		}
		SScrollerr.resize();
	};

	SScrollerr.addScrollCallback = function(func) {
		scrollCallbacks.push(func);
	};

	SScrollerr.doScroll = function(direction) {
		if (scrollReady === true) {
			scrollReady = false;
			if (direction === 'prev' && currentSection > 0) { currentSection--; }
			if (direction === 'next' && currentSection < sections.length-1) { currentSection++; }
			console.log(currentSection)
			var newYPos = Math.ceil($('#'+sections[currentSection]).offset().top);
			$("html, body").animate(
				{ scrollTop: newYPos },
				sectionAnimationDuration,
				'easeInOutExpo',
				function() {
					scrollReady = true;
				}
			);
		}
	};

	SScrollerr.resize = function() {
		var screenHeight = $(window).height() > minHeight ? $(window).height() : minHeight;
		$('.section').height(screenHeight);
		SScrollerr.doScroll();
	};

	SScrollerr.scrollDirection = 'down';
	SScrollerr.lastScrollPosition = 0,

	$(window).scroll(function() {
		var winScrollTop = $(window).scrollTop();
		var winHeight = $(window).height();

		if (SScrollerr.lastScrollPosition >= winScrollTop) SScrollerr.scrollDirection = 'up';
		else SScrollerr.scrollDirection = 'down';

		for (var i = 0; i < scrollCallbacks.length; i++) {
			scrollCallbacks[i]();
		}

		for (var i = 1; i <= sections.length; i++) {
			var height = winHeight*i;

			if (SScrollerr.scrollDirection == 'down') {
				if (winScrollTop >= height && SScrollerr.lastScrollPosition < height) {
					SScrollerr.SectionActions[sections[currentSection]]['setup']();
					if (SScrollerr.SectionActions[sections[currentSection-1]]) { 
						SScrollerr.SectionActions[sections[currentSection-1]]['teardown']();
					}
				}
			} else {
				if (winScrollTop <= height && SScrollerr.lastScrollPosition >= height) {
					SScrollerr.SectionActions[sections[currentSection]]['setup']();
					if (SScrollerr.SectionActions[sections[currentSection+1]]) { 
						SScrollerr.SectionActions[sections[currentSection+1]]['teardown']();
					}
				}
			}

		}

		SScrollerr.lastScrollPosition = winScrollTop;

	}).resize( $.throttle( 250, SScrollerr.resize ) );

	$("body").bind("mousewheel", function (delta, aS, aQ, deltaY) {
		delta.preventDefault();
		if (deltaY > 0) {
			SScrollerr.doScroll('prev');
		} else {
			if (deltaY < 0) {
				SScrollerr.doScroll('next');
			}
		}
		return false;
	});

	return SScrollerr;

})(this, this.document);



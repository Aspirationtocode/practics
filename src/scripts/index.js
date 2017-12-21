import $ from 'jquery';
import viewport from 'get-viewport-size';
import '../views/index.pug';
import '../styles/main.styl';
import './static-init';

import j from './jquery-constants';

j.headerElement.on('click', function() {
	const currentTabIndex = $(this).data('tab');
	j.headerElement.removeClass(j.headerElementActiveClass);
	$(this).addClass(j.headerElementActiveClass);
	$('.tabs-content-element').removeClass('tabs-content-element--active');
	$(`.tabs-content-element--${currentTabIndex}`).addClass('tabs-content-element--active');
});

$('.header-open-mobile-menu').on('click', function() {
	$(this).toggleClass('header-open-mobile-menu--close');
	$('.header-elements').toggleClass('header-elements--mobiled');
	$('.header-overlay').toggleClass('header-overlay--active');
});

$(window).on('resize', () => {
	if (viewport().width > 722) {
		$('.header-elements').removeClass('header-elements--mobiled');
		$('.header-overlay').removeClass('header-overlay--active');
		$('.header-open-mobile-menu').removeClass('header-open-mobile-menu--close');
	}
});

$('.dropdown-menu-header').bind('click', function() {
	$(this).toggleClass('dropdown-menu-header--active')
	$(this).parent().children('.dropdown-menu-elements').toggleClass('dropdown-menu-elements--active')
})

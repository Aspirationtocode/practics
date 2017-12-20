import $ from 'jquery';
import viewport from 'get-viewport-size';
import '../views/index.pug';
import '../views/about.pug';
import '../styles/main.styl';
import './static-init';


require('jquery-ui-bundle');

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



const data = {
	"1 курс": {
		"1 семестр": ["1 doc", "2 doc"],
		"2 семестр": ["3 doc", "4 doc"]
	},
	"2 курс": {
		"3 семестр": ["1 doc", "2 doc"],
		"4 семестр": ["3 doc", "4 doc"],
	},
}

$('body').on('click', '.dropdown-menu-header', function() {
	$(this).toggleClass('dropdown-menu-header--active')
	$(this).parent().children('.dropdown-menu-elements').toggleClass('dropdown-menu-elements--active')
})

const baseDropdown = $('.dropdown-menu.dropdown-menu--base');

//
// function initDropdown(containerSelector, title, baseObject) {
// 	const finalArray = [];
// 	function traverseObject(object, lvl) {
// 		const currentKeys = Object.keys(object);
// 		if ($('.dropdown-menu .dropdown-menu-elements').length === 0) {
// 			$('.dropdown-menu').append('<div class="dropdown-menu-elements"></div>')
// 		}
// 		currentKeys.forEach((key) => {
// 			$('.dropdown-menu .dropdown-menu-elements').append(`<div class="dropdown-menu-el dropdown-menu">${key}</div>`)
// 		})
// 		lvl++;
// 		Object.keys(object).forEach((item) => {
// 			if (typeof object[item] === 'object' && !object[item].slice) {
// 				traverseObject(object[item], lvl)
// 			}
// 		})
// 	}
// 	$(containerSelector).append(`
// 		<div class="dropdown-menu">
// 			<div class="dropdown-menu-header">${title}</div>
// 		</div>
// 	`);
// 	traverseObject(baseObject, 0)
//
// }
//
// initDropdown('.tabs-content-data-documents', 'Документы', data)

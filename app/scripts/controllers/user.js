'use strict';

/**
 * @ngdoc function
 * @name findteacherApp.controller:MainCtrl
 * @description
 * # FilterCtrl
 * Controller of the findteacherApp
 */
angular.module('app').controller('UserCtrl', function($scope, Data, Server) {

	// 取用户信息
	$scope.user = Data.user;
	Server.getUser(function(json){angular.extend($scope,json);});


	Data.header = "个人中心";
	$scope.care = false;

	var item = function(id){
		var res = {base:false,recode:false,anthen:false,x:false};
		id && res[id] !== undefined && (res[id] = true);
		return res;
	}
	$scope.item = item('base');


	// $scope.call = 
	$scope.call = function(nub){
		if(!nub){
			alert('该讲师联系电话为空');
			return;
		}
		window.clientWebView.jsCallPhone(nub);
	};

	// 点击滚动到
	$scope.nav = function(id){
		$scope.item = item(id);
		return false;
	}

	
	var nav = (function(name){var elem = angular.element(name);return {elem:elem,top:elem.offset().top,item:elem.find('a')}})('.user_nav');

	angular.element(window).scroll(function(){
		var top = document.body.scrollTop;

		

		// var active = function(item){
		// 	nav.item.removeClass('active');
		// 	item.addClass('active');
		// }
		// var item = {
		// 	base : angular.element("#base").offset().top,
		// 	recode : angular.element("#recode").offset().top,
		// 	anthen : angular.element("#anthen").offset().top,
		// 	x : angular.element("#x").offset().top
		// }


		top>nav.top && nav.elem.not('.fixed') && nav.elem.addClass('fixed');
		top<nav.top && nav.elem.is('.fixed') && nav.elem.removeClass('fixed');

		// top>item.base && nav.item.eq(0).not('.active') && active(nav.item.eq(0));
		// top>item.recode && nav.item.eq(1).not('.active') && active(nav.item.eq(1));
		// top>item.anthen && nav.item.eq(2).not('.active') && active(nav.item.eq(2));
		// top>item.x && nav.item.eq(3).not('.active') && active(nav.item.eq(3));
	});



});
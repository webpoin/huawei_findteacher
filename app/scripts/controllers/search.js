'use strict';

/**
 * @ngdoc function
 * @name findteacherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findteacherApp
 */
angular.module('app').controller('search', function($scope,$location, Data, Server, localStorageService) {
		$scope.data = Data;

		$scope.submit = function() {
			if ($scope.data.key.length == 0) return;
			var key = $scope.data.key;


			// 储存到本地数据库
			// 最近搜索规则
			// 不能重复(如果重复则重复项提前)
			// 不能为空
			// 最长为5个
			// 最新搜索放最前（倒序）
			
			var late = localStorageService.get('late');
			late = late && late.split('\n') || [];

			if (late.indexOf(key) < 0) {
				// 无重复
				localStorageService.add('late', [key].concat(late.slice(0, 4)).join('\n'));
			} else {
				// 有重复
				late.splice(late.indexOf(key), 1);
				localStorageService.add('late', [key].concat(late).join('\n'));
			}
			Data.key = key;
			Server.search();
			$location.path('/list');

		}
		$scope.filter = function() {
			$location.path('/filter');
		}
	});
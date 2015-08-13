'use strict';

/**
 * @ngdoc function
 * @name findteacherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the findteacherApp
 */
angular.module('app').controller('MainCtrl', function($scope, $http ,$location, Data, Server, localStorageService) {

		Data.header = "找老师";
		Data.goback = false;

		var hot = [];
		var hot_idx = 0;
		var hot_each = 8;
		var late = localStorageService.get('late');

		$scope.late = late && late.split('\n') || [];
		$scope.lately = $scope.late.length > 0;
		$scope.replace = true;
		$scope.data = Data;
		$scope.data.key = '';

		// 点击“换一批”时更新数据
		$scope.updateHot = function() {

			$scope.hot = hot.slice(hot_idx * hot_each, (hot_idx + 1) * hot_each);
			hot_idx++;
			hot_idx = hot.length > hot_idx * hot_each ? hot_idx:0;
		}

		// 点击“清除” 清除本地数据
		$scope.cleanUp = function() {
			$scope.lately = false;
			localStorageService.add('late', '');
		}

		// 搜索
		$scope.search =function(key){
			Data.key = key;
			$location.path('/list');
		} 
		// = Server.search;




		// 异步取热门搜索
		Server.getHot(function(json){
			hot = json;
			$scope.updateHot();
		})
		

		

	});
'use strict';

/**
* @ngdoc function
* @name findteacherApp.controller:MainCtrl
* @description
* # FilterCtrl
* Controller of the findteacherApp
*/


angular.module('app').controller('FilterCtrl', function ($scope,$location,Data,Server) {
	// $scope.form = {};
	// $scope.data = Data;
	Data.header = "筛选";

	Data.filter_show = Data.filter_show || {level:true,satisfied:false,duration:false};
	$scope.show = Data.filter_show;


	// 级别 初始化
	if(!Data.level_elem){
		Server.getLevel(function(json){
			$scope.level = Data.level_elem = json;
		});
	}
	$scope.level = Data.level_elem;

	// 满意度
	$scope.satisfied = Data.filter.satisfied;

	// 授课时长
	$scope.duration = Data.filter.duration;

	// 展开收缩标题
	$scope.toggle = function(name){
		$scope.show[name] = !$scope.show[name]; 
	}
	



	$scope.submit = function(){
		var res = [];
		for(var i=0,l=$scope.level.length;i<l;i++){
			$scope.level[i].selected && res.push($scope.level[i].hu_levelid);
		}
		Data.filter.level = res.join(',');
		Server.search();
		$location.path('/list');		
	}

	$scope.reset = function(){

		for(var i=0,l=$scope.level.length;i<l;i++){
			$scope.level[i].selected = false;
		}

		Data.filter.satisfied.low = 0;
		Data.filter.satisfied.high = 100;

		Data.filter.duration.low = 0;
		Data.filter.duration.high = 100;

	}






});
